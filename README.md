# Discord Webhook Upload Action

An action that lets you upload files and send them as discord webhooks!

Example:
```yaml
- name: Publish artifacts
  uses: DrTheodor/discord-webhook-upload-action@v0.2
  with:
    # the discord webhook url
    url: ${{ secrets.WEBHOOK_URL }}
    username: george washington
    avatar: 'https://i.imgur.com/uiFqrQh.png'
    
    message_commit: '> :sparkles: [${commitMessage}](<${commitUrl}>) by [${authorName}](<${authorUrl}>)'
    message_header: |
      <:new1:1253371736510959636><:new2:1253371805734015006> New dev build `#${{ github.run_number }}`:
        
    file: 'build/libs/*'
```

(Example from [Adventures in Time by AmbleLabs](https://github.com/amblelabs/ait/blob/main/.github/workflows/publish-devbuilds.yml))


## Inputs
- `url`: the webhook url
- `username`: username
- `avatar`: url to an image of the avatar (profile picture)
- `message`: the base message
- `file`: glob pattern for the files
- `mode`: the mode for the action to work in, currently only supports "commit" and "echo".

"commit" mode will append commit message formatting (see below or the example usage), while "echo" will only send the `message`.

## Formatting
You can use multiple placeholders:

### Commit description placeholders (`msg_commit_desc`)
- `${message}` - the commit message (a single line)

### Commit placeholders (`msg_commit`)
- `${commitMessage}` - commit message
- `${commitUrl}` - link to the commit
- `${authors}` - the authors

### Author placeholders (`msg_author`)
- `${authorName}` - the author of the commit
- `${authorUrl}` - link to the author's profile
