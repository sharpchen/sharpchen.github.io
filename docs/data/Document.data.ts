import { DirectoryInfo, Path } from '../shared/FileSystem';
import { projectRoot, documentRoot } from '../shared/FileSystem';
import { routeNameOfDocument } from '../shared/utils';
const loader = {
    load: (): DocumentResponse[] => {
        return getDocumentInfos();
    },
};
export type DocumentInfo = {
    docName: string;
    relativeToRoot: string;
    chapters: ChapterDirectory[];
    filesRelativeToProjectRoot?: string[];
};
type ChapterDirectory = {
    name: string;
    filesRelativeToProjectRoot?: string[];
};

export type DocumentResponse = {
    docRoute: string;
    docName: string;
    content: DocumentInfo;
};
/**
 *
 * @returns DirectoryInfos of document roots
 */
function getAllDocumentRoots(): DirectoryInfo[] {
    return documentRoot()
        .getDirectories()
        .filter(x => !x.name.startsWith('.'))
        .map(x => x.getDirectories().filter(d => d.name === 'docs')[0]);
}

function getDocumentInfos(): DocumentResponse[] {
    const docRoots: DirectoryInfo[] = getAllDocumentRoots();
    const pairs: DocumentResponse[] = [];
    for (let index = 0; index < docRoots.length; index++) {
        const docFolder: DirectoryInfo = docRoots[index];
        let root: DocumentInfo = {
            docName: docFolder.parent!.name,
            relativeToRoot: Path.GetRelativePath(projectRoot().fullName, docFolder.fullName),
            chapters: docFolder.getDirectories().map(chapter => {
                return {
                    name: chapter.name,
                    filesRelativeToProjectRoot: chapter
                        .getFiles()
                        .map(f => Path.GetRelativePath(projectRoot().fullName, f.fullName)),
                };
            }),
            filesRelativeToProjectRoot: docFolder
                .getFiles()
                .map(f => Path.GetRelativePath(projectRoot().fullName, f.fullName))
                .filter(f => !f.startsWith('.')),
        };
        pairs.push({
            docRoute: routeNameOfDocument(docFolder.parent!.name),
            docName: docFolder.parent!.name,
            content: root,
        });
    }
    return pairs;
}

export default loader;
export declare const data: DocumentResponse[];
