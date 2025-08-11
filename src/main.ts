import * as core from '@actions/core'
import * as github from '@actions/github'

import { fmt, send } from './util'

type Commit = { author: { name: string; username: any }; message: string; url: string }

type CommitFormat = {
  authorName: string,
  authorUrl: string,
  commitUrl: string,
  commitMessage: string,
}

function fmtCommit(format: string, commit: Commit): string[] {
  return commit.message.split(/\r?\n|\r/).map(v => v.trim())
  .map(message => fmt<CommitFormat>(format, { 
      authorName: commit.author.name,
      authorUrl: `https://github.com/${commit.author.username}`,
      commitUrl: commit.url,
      commitMessage: message,
  }));
}

export async function run() {
  const commits: Commit[] = github.context.payload.commits;
  
  const msgHeader = core.getInput('message_header');
  const msgCommit = core.getInput('message_commit')

  let message = msgHeader;
  commits.map(commit => fmtCommit(msgCommit, commit)).forEach(v => message += '\n' + v);
  
  const url = core.getInput('url');
  const username = core.getInput('username');
  const avatar = core.getInput('avatar');
  
  const file = core.getInput('file');
  
  try {
    await send(url, username, avatar, message, file);
  } catch (e) {
    core.setFailed(e as Error);
  }
}
