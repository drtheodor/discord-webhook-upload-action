import { UploadArtifactOptions } from '@actions/artifact';
type UploadCallback = (url: string) => void;
export declare function flatFiles(file: string): string[];
export declare function fileName(path: string): string;
export declare function uploadArtifact(artifactName: string, filesToUpload: string, rootDirectory: string, options: UploadArtifactOptions, callback: UploadCallback): Promise<void>;
export {};
