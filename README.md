# Discord Webhook Upload Action

An action that lets you upload files and send them as discord webhooks!

Example:
```yaml
name: Automated discord builds

on:
  workflow_dispatch:
  push:
    paths:
      - src/**
      - build.gradle
      - gradle.properties
      - settings.gradle
      - gradle/**
      - gradlew
      - gradlew.bat
      - versioning.gradle

jobs:
  build:

    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
    - uses: actions/checkout@v4
    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Setup Gradle
      uses: gradle/actions/setup-gradle@417ae3ccd767c252f5661f1ace9f835f9654f2b5 # v3.1.0

    - name: Build
      run: ./gradlew build

    - name: Publish artifacts
      uses: DrTheodor/discord-webhook-upload-action@180e436b3993cdca2e0a7d6d0951f417927bfe84
      with:
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
- `%MESSAGE%` - commit message
- `%LINK%` - link to the commit
- `%AUTHOR%` - the author of the commit
- `%AUTHOR_LINK%` - link to the author's profile

### Message placeholders
- `%COMMITS%` - the commits' messages. Gets replaced with the `commit` parameter formatted for each commit.

From [AIT](https://github.com/amblelabs/ait/blob/main/.github/workflows/publish-devbuilds.yml).
