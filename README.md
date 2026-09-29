# Discord Webhook Upload Action

An action that lets you upload files and send them as discord webhooks!

Example:
```yaml
- name: Publish artifacts
  uses: drtheodor/discord-webhook-upload-action@v0.4
  with:
    url: ${{ secrets.DEV_BUILDS }}
    username: george washington
    avatar: 'https://i.imgur.com/uiFqrQh.png'
    
    message: |
      <:new1:1253371736510959636><:new2:1253371805734015006> New <:al_ait:1393920126645960704> **Adventures in Time** (**AIT**) dev build [**`#${{ github.run_number }}`**](<https://github.com/amblelabs/ait/actions/runs/${{ github.run_id }}>):
      ${commits}
      
    file: |
      build/libs/*.jar
      !build/libs/*-sources.jar
```

(Example from [Adventures in Time by AmbleLabs](https://github.com/amblelabs/ait/blob/main/.github/workflows/publish-devbuilds.yml))


## Inputs
- `url`: the webhook url
- `username`: username
- `avatar`: url to an image of the avatar (profile picture)
- `message`: the base message
- `file`: glob pattern for the files

## Formatting
You can use multiple placeholders:

### Message placeholders (`message`)
- `${commits}` - the commits (will use `msg_commit` and `msg_commit_desc`)

### Commit description placeholders (`msg_commit_desc`)
- `${message}` - the commit message (a single line)

### Commit placeholders (`msg_commit`)
- `${commitMessage}` - commit message
- `${commitUrl}` - link to the commit
- `${authors}` - the authors

### Author placeholders (`msg_author`)
- `${authorName}` - the author of the commit
- `${authorUrl}` - link to the author's profile
