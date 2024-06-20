const core = require('@actions/core')
const { WebhookClient } = require('discord.js')

function files(path) {
  if (file.endsWith('*')) {
    let files = []

    fs.readdir(file, (err, files) => {
      files.forEach(f => {
        files.add(f);
      })
    })

    return files
  }

  return [path]
}

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

    const webhookClient = new WebhookClient({ url })

    const files = files(file)
    core.info(`Sending ${files}`)

    await webhookClient.send({
      content: '',
      username,
      avatarURL: avatar,
      embeds: [embed],
      files: files(file)
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
