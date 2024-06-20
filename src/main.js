const core = require('@actions/core')
const { Webhook } = require('discord-webhook-node')

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

    const hook = new Webhook(url)

    hook.setUsername(username)
    hook.setAvatar(avatar)

    if (file.endsWith('*')) {
      fs.readdir(file, (err, files) => {
        files.forEach(async f => {
          core.info(`Sent file from ${file}: ${f}`)
          await hook.sendFile(f)
        })
      })

      return
    }

    core.info(`Sent ${file}`)
    //await hook.sendFile(file)
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
