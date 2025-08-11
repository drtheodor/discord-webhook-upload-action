/** Shamelessly copied from https://github.com/actions/upload-artifact/blob/main/src/shared/search.ts */
export interface SearchResult {
    filesToUpload: string[];
    rootDirectory: string;
}
export declare function findFilesToUpload(searchPath: string, includeHiddenFiles?: boolean): Promise<SearchResult>;
