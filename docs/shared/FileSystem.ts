import * as fs from 'fs';
import * as path from 'path';

abstract class FileSystemInfo {
    protected path: string;
    abstract get name(): string;
    abstract get fullName(): string;
    abstract get exists(): boolean;
    constructor(path: string) {
        this.path = path;
    }
}
export class DirectoryInfo extends FileSystemInfo {
    constructor(directoryPath: string) {
        super(directoryPath);
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
        const fileInfos = fs
            .readdirSync(this.path)
            .map(fileName => {
                const filePath = path.join(this.path, fileName);
                const stat = fs.statSync(filePath);

                if (stat.isFile()) {
                    return new FileInfo(filePath);
                }
            })
            .filter(Boolean) as FileInfo[];
        return fileInfos;
    }

    getDirectories(): DirectoryInfo[] {
        try {
            const directoryNames = fs
                .readdirSync(this.path)
                .filter(item => fs.statSync(path.join(this.path, item)).isDirectory());
            return directoryNames.map(
                directory => new DirectoryInfo(path.join(this.path, directory))
            );
        } catch (error) {
            console.error(`Error reading directories in ${this.path}: ${error.message}`);
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
    static GetBaseName(fullName: string) {
        return path.basename(fullName);
    }
    static GetFileNameWithoutExtension(path: string): string {
        const fileName: string = new FileInfo(path).name;
        const lastPeriod: number = fileName.lastIndexOf('.');
        return lastPeriod < 0
            ? fileName // No extension was found
            : fileName.slice(0, lastPeriod);
    }
}

export function projectRoot(): DirectoryInfo {
    return new DirectoryInfo(__dirname).parent!;
}

export function documentRoot(): DirectoryInfo {
    return projectRoot()
        .getDirectories()
        .filter(x => x.name === 'document')[0];
}
