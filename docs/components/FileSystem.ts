import * as fs from "fs";
import * as path from "path";

abstract class FileSystemInfo {
  protected path: string;
  abstract get name(): string;
  abstract get fullName(): string;
  abstract get exists(): boolean;
  constructor(path: string, isRelative: boolean = false) {
    this.path = path;
  }
}
export class DirectoryInfo extends FileSystemInfo {
  constructor(directoryPath: string, isRelative: boolean = false) {
    super(directoryPath, isRelative);
    this.path = directoryPath;
  }

  get name(): string {
    return path.basename(this.path);
  }

  get fullName(): string {
    return this.path;
  }

  get exists(): boolean {
    return fs.existsSync(this.path) && fs.statSync(this.path).isDirectory();
  }
  get parent(): DirectoryInfo | null {
    const parentPath = path.dirname(this.path);
    return parentPath !== this.path ? new DirectoryInfo(parentPath) : null;
  }

  getFiles(): FileInfo[] {
    if (!this.exists) {
      return [];
    }

    const fileNames = fs.readdirSync(this.path);
    return fileNames.map(
      (fileName) => new FileInfo(path.join(this.path, fileName))
    );
  }
  getDirectories(): DirectoryInfo[] {
    try {
      const directoryNames = fs
        .readdirSync(this.path)
        .filter((item) =>
          fs.statSync(path.join(this.path, item)).isDirectory()
        );
      return directoryNames.map(
        (directory) => new DirectoryInfo(path.join(this.path, directory))
      );
    } catch (error) {
      console.error(
        `Error reading directories in ${this.path}: ${error.message}`
      );
      return [];
    }
  }
}

export class FileInfo extends FileSystemInfo {
  constructor(filePath: string) {
    super(filePath);
    this.path = filePath;
  }

  get name(): string {
    return path.basename(this.path);
  }

  get fullName(): string {
    return this.path;
  }

  get exists(): boolean {
    return fs.existsSync(this.path) && fs.statSync(this.path).isFile();
  }

  get length(): number {
    if (!this.exists) {
      return 0;
    }
    return fs.statSync(this.path).size;
  }
  get directory(): DirectoryInfo {
    const directoryPath = path.dirname(this.path);
    return new DirectoryInfo(directoryPath);
  }
}

export abstract class Path {
  static GetRelativePath(relativeTo: string, to: string): string {
    return path.relative(relativeTo, to);
  }
}
