const { Webhook } = require('discord-webhook-node');

const core = require('@actions/core');
const github = require('@actions/github');

try {
    const url = core.getInput('url');
    const username = core.getInput('username');
    const avatar = core.getInput('avatar');

    const file = core.getInput('file');

    const hook = new Webhook(url);

    hook.setUsername(username);
    hook.setAvatar(avatar);

    hook.sendFile(file);
} catch (error) {
  core.setFailed(error.message);
}