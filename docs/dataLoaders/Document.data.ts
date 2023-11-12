import { DirectoryInfo, Path } from "../components/FileSystem";
const loader = {
  load: () => {
    const projRoot = new DirectoryInfo(__dirname).parent;

    const documentRoot = projRoot
      ?.getDirectories()
      .filter((d) => d.name === "document")[0];

    const documents = documentRoot
      ?.getDirectories()
      .filter((d) => d.name === "Docker" || d.name === "JavaScript");

    return documents?.map((d) => {
      return d.getFiles().map((f) => {
        return {
          documentName: d.name,
          route: Path.GetRelativePath(projRoot!.fullName, f.fullName),
        };
      });
    });
  },
};

export default loader;
