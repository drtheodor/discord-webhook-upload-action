const core = require('@actions/core')
const github = require('@actions/github')
const { WebhookClient } = require('discord.js')
const { flatFiles } = require('./util')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const url = core.getInput('url')
    const username = core.getInput('username')
    const avatar = core.getInput('avatar')
    const file = core.getInput('file')
    const rawMessage = core.getInput('message')
    const commitFormat = core.getInput('commit')

    const webhookClient = new WebhookClient({ url })

    const files = flatFiles(file)
    core.info(`Sending ${files}`)

    const commits = github.context.payload.commits.map((commit) => commitFormat
      .replace('%AUTHOR%', commit.author.name)
      .replace('%AUTHOR_LINK%', `https://github.com/${commit.author.username}`)
      .replace('%MESSAGE%', commit.message)
      .replace('%LINK%', commit.url)
    );

    const message = rawMessage.replace('%COMMITS%', commits.join('\n'))

    await webhookClient.send({
      content: message,
      username,
      avatarURL: avatar,
      files: files
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
