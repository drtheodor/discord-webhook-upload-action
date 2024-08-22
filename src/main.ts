import * as core from '@actions/core'
import * as github from '@actions/github'

import { WebhookClient } from 'discord.js'
import { flatFiles } from './util'

type Commit = { author: { name: string; username: any }; message: string; url: string }

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  const url = core.getInput('url')
  const username = core.getInput('username')
  const avatar = core.getInput('avatar')
  const file = core.getInput('file')
  const rawMessage = core.getInput('message')
  const commitFormat = core.getInput('commit')

  const webhookClient = new WebhookClient({ url })

  const files = flatFiles(file)
  core.info(`Sending ${files}`)

  const commits = github.context.payload.commits.map((commit: Commit) => commitFormat
    .replace('%AUTHOR%', commit.author.name)
    .replace('%AUTHOR_LINK%', `https://github.com/${commit.author.username}`)
    .replace('%MESSAGE%', commit.message.split("\n")[0] + " (...)")
    .replace('%LINK%', commit.url)
  );

  core.info(commits[0])

  const message = rawMessage.replace('%COMMITS%', commits.join('\n')).substring(0, 1999)

  try {
    await webhookClient.send({
      content: message,
      username,
      avatarURL: avatar,
      files: files
    })
  } catch (error) {
    core.setFailed(error as Error)
  }
}