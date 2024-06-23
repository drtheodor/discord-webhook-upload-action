import * as core from '@actions/core'
import * as github from '@actions/github'
import artifact, {UploadArtifactOptions} from '@actions/artifact'

import * as fs from 'fs';

type UploadCallback = (url: string) => void;

export function flatFiles(file: string) {
    if (file.endsWith('*')) {
      const sliced = file.slice(0, file.length - 1)
      return fs.readdirSync(sliced).flatMap((f) => sliced + '/' + f);
    }

    return [file]
}

export function fileName(path: string): string {
  return path.split('\\').pop()!.split('/').pop()!;
}

export async function uploadArtifact(
  artifactName: string,
  filesToUpload: string,
  rootDirectory: string,
  options: UploadArtifactOptions,
  callback: UploadCallback
) {
  const uploadResponse = await artifact.uploadArtifact(
    artifactName,
    [filesToUpload],
    rootDirectory,
    options
  )

  core.info(
    `Artifact ${artifactName} has been successfully uploaded! Final size is ${uploadResponse.size} bytes. Artifact ID is ${uploadResponse.id}`
  )
  core.setOutput('artifact-id', uploadResponse.id)

  const repository = github.context.repo
  const artifactURL = `${github.context.serverUrl}/${repository.owner}/${repository.repo}/actions/runs/${github.context.runId}/artifacts/${uploadResponse.id}`

  core.info(`Artifact download URL: ${artifactURL}`)
  core.setOutput('artifact-url', artifactURL)

  callback(artifactURL)
}