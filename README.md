# Discord Webhook Upload Action

An action that lets you upload files and send them as discord webhooks!

Example:
```yaml
- name: Publish artifacts
  uses: DrTheodor/discord-webhook-upload-action@1e778986786ada4f9eedf766df8a19d5fc4eeede
  with:
    # the discord webhook url
    url: ${{ secrets.DEV_BUILDS }}
    username: george washington
    avatar: 'https://i.imgur.com/uiFqrQh.png'
    
    message_commit: '> :sparkles: [${commitMessage}](<${commitUrl}>) by [${authorName}](<${authorUrl}>)'
    message_header: |
      <:new1:1253371736510959636><:new2:1253371805734015006> New `Adventures in Time` dev build `#${{ github.run_number }}`:
        
    file: 'build/libs/*'
```

## Formatting
You can use multiple placeholders:

### Commit placeholders
- `${commitMessage}` - commit message
- `${commitUrl}` - link to the commit
- `${authorName}` - the author of the commit
- `${authorUrl}` - link to the author's profile

From [Adventures in Time by AmbleLabs](https://github.com/amblelabs/ait/blob/main/.github/workflows/publish-devbuilds.yml).
