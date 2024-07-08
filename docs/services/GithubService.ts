import { Octokit } from 'octokit';

let octokit: Octokit;
type RepoFileResponse = Extract<
  Exclude<Awaited<ReturnType<Octokit['rest']['repos']['getContent']>>, 200>['data'],
  { download_url: string | null; type: 'dir' | 'file' | 'submodule' | 'symlink' }[]
>;
type RepoTreeResponse = Awaited<ReturnType<Octokit['rest']['git']['getTree']>>['data']['tree'];
type ElementType<T> = T extends (infer U)[] ? U : never;
type RepoFileSystemInfo = ElementType<RepoFileResponse>;
class GithubRepositoryEndPointMethods {
  constructor(
    private owner: string,
    private repo: string,
  ) {}
  private async fetchStructureByPath(path: string): Promise<RepoFileResponse> {
    return (
      await octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path,
      })
    ).data as RepoFileResponse;
  }
  async getTree(options: { branchSHA?: string; branch?: string }): Promise<RepoTreeResponse> {
    let branch: string = options.branch ?? 'main';
    let sha: string;
    try {
      sha =
        options.branchSHA ??
        (
          await octokit.rest.git.getRef({
            owner: this.owner,
            repo: this.repo,
            ref: `heads/${branch}`,
          })
        ).data.object.sha;
    } catch (error) {
      console.log(
        `Error fetching ref of ${JSON.stringify({
          repo: `${this.owner}/${this.repo}`,
          branch: branch,
        })}`,
        error,
      );
      throw error;
    }
    try {
      return (
        await octokit.rest.git.getTree({
          owner: this.owner,
          repo: this.repo,
          tree_sha: sha,
          recursive: 'true',
        })
      ).data.tree;
    } catch (error) {
      console.log(
        `Error fetching tree of ${JSON.stringify({
          repo: `${this.owner}/${this.repo}`,
          branch: branch,
        })}`,
        error,
      );
      throw error;
    }
  }
  async getFiles(dir: string, searchOption: 'top' | 'deep'): Promise<RepoFileResponse> {
    const current = await this.fetchStructureByPath(dir);
    switch (searchOption) {
      case 'top':
        return current.filter(x => x.type === 'file');
      case 'deep':
        return [
          ...current.filter(x => x.type === 'file'),
          ...(await dive(
            current.filter(x => x.type === 'dir'),
            this,
          )),
        ];
    }
    async function dive(
      dirs: RepoFileResponse,
      self: GithubRepositoryEndPointMethods,
    ): Promise<RepoFileResponse> {
      const tasks = dirs.map(async x => {
        const nexts = await self.fetchStructureByPath(x.path);
        const currentFiles = nexts.filter(x => x.type === 'file');
        const currentDirs = nexts.filter(x => x.type === 'dir');
        const restFiles = currentDirs.length ? await dive(currentDirs, self) : [];
        return [...currentFiles, ...restFiles];
      });
      return (await Promise.all(tasks)).flat();
    }
  }
  async getFileInfo(path: string) {
    const repo = `${this.owner}/${this.repo}`;
    if (/^[\w.]+\/\b[-\w]+\b$/.test(repo)) {
      const split = repo.split('/');
      const owner = split[0];
      const _repo = split[1];
      return (
        await octokit.rest.repos.getContent({
          owner: owner,
          repo: _repo,
          path: path,
        })
      ).data as RepoFileSystemInfo;
    } else throw new Error();
  }
}
export class GithubService {
  constructor(token: string) {
    octokit = new Octokit({
      auth: token,
    });
  }
  fromRepository(repo: { owner: string; repo: string } | string) {
    if (typeof repo === 'string' && /^[\w.]+\/\b[-\w]+\b$/.test(repo)) {
      const split = repo.split('/');
      return new GithubRepositoryEndPointMethods(split[0], split[1]);
    }
    if (repo instanceof Object) {
      return new GithubRepositoryEndPointMethods(repo.owner, repo.repo);
    }
    throw new Error('pattern invalid');
  }
}

export const githubService = new GithubService(process.env.GITHUB_TOKEN);
