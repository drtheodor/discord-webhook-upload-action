export declare function fmt<T extends Record<string, unknown>>(template: string, values: T): string;
export interface SplitOptions {
    maxLength?: number;
    char?: string;
    prepend?: string;
    append?: string;
}
export declare function send(url: string, name: string, avatar: string, text: string, file: string, options?: SplitOptions): Promise<void>;
