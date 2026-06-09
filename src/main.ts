import * as core from '@actions/core'
import * as github from '@actions/github'

import { fmt, send } from './util'

type Commit = {
  author: { name: string; username: string }
  message: string
  url: string
}

type AuthorFormat = {
  authorName: string
  authorUrl: string
}

type CommitFormat = {
  commitUrl: string
  commitMessage: string
  authors: string
}

type CommitMessageFormat = {
  message: string
}

const PREFIX_CO_AUTHORED = 'Co-authored-by: '
const PREFIX_SIGNED_BY = 'Signed-off-by: '

/**
 * Parses a "Co-authored-by: Name <email>" line into name and email.
 * Returns null if the line doesn't match the expected format.
 */
function parseCoAuthor(line: string): AuthorFormat | null {
  const rest = line.slice(PREFIX_CO_AUTHORED.length).trim()
  const lastSpace = rest.lastIndexOf(' ')

  if (lastSpace === -1 || rest[lastSpace + 1] !== '<' || !rest.endsWith('>')) {
    return null
  }

  const name = rest.slice(0, lastSpace).trim()
  const email = rest.slice(lastSpace + 2, -1).trim() // remove '<' and '>'
  return { authorName: name, authorUrl: email }
}

function fmtCommit(commit: Commit): string[] {
  const authors: AuthorFormat[] = [
    {
      authorName: commit.author.name,
      authorUrl: `https://github.com/${commit.author.username}`
    }
  ]

  // Separate header from the rest, filter out special lines (co-authors, signed-off-by)
  const [commitHeader, ...remainingLines] = commit.message
    .split(/\r?\n|\r/)
    .map(line => line.trim())
    .filter(Boolean)

  const commitDesc = remainingLines.filter(line => {
    if (line.startsWith(PREFIX_CO_AUTHORED)) {
      const coAuthor = parseCoAuthor(line)
      if (coAuthor) {
        authors.push(coAuthor)
      }
      return false // exclude this line from commit description
    }
    return !line.startsWith(PREFIX_SIGNED_BY) // exclude signed-off-by lines
  })

  const commitHeaderFmt = core.getInput('msg_commit')
  const commitMessageFmt = core.getInput('msg_commit_desc')
  const messageAuthorFmt = core.getInput('msg_author')
  const messageAuthorSep = core.getInput('msg_author_separator')

  const authorBlock = authors
    .map(author => fmt<AuthorFormat>(messageAuthorFmt, author))
    .join(messageAuthorSep)

  const formattedHeader = fmt<CommitFormat>(commitHeaderFmt, {
    authors: authorBlock,
    commitUrl: commit.url,
    commitMessage: commitHeader
  })

  const formattedBody = commitDesc.map(message =>
    fmt<CommitMessageFormat>(commitMessageFmt, {
      message
    })
  )

  return [formattedHeader, ...formattedBody]
}

export async function run(): Promise<void> {
  const baseMessage = core.getInput('message')

  let finalMessage = baseMessage

  if (
    'commits' in github.context.payload &&
    baseMessage.includes('${commits}')
  ) {
    const commits = github.context.payload.commits as Commit[]

    if (commits && commits.length > 0) {
      const formattedCommits = commits.flatMap(fmtCommit).join('\n')

      fmt(finalMessage, {
        commits: formattedCommits
      })
    }
  }

  const url = core.getInput('url')
  const username = core.getInput('username')
  const avatar = core.getInput('avatar')
  const file = core.getInput('file')

  try {
    await send(url, username, avatar, finalMessage, file)
  } catch (e) {
    core.setFailed(e as Error)
  }
}
