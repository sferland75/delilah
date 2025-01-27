interface FileSystem {
  readFile(path: string, options?: { encoding?: string }): Promise<Buffer | string>;
  writeFile(path: string, data: string): Promise<void>;
}

interface Window {
  fs: FileSystem;
}

declare global {
  interface Window {
    fs: FileSystem;
  }
}