# Discord Webhook Upload Action

An action that lets you upload files and send them as discord webhooks!

Example:
```yaml
- name: Publish artifacts
  uses: DrTheodor/discord-webhook-upload-action@v1.0
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
- `message_commit`: the formatting for each commit
- `message_header`: the formatting for each message
- `file`: glob pattern for the files

## Formatting
You can use multiple placeholders:

### Commit placeholders
- `${commitMessage}` - commit message
- `${commitUrl}` - link to the commit
- `${authorName}` - the author of the commit
- `${authorUrl}` - link to the author's profile