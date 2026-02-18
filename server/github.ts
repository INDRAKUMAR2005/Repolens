import { parseRepoUrl, getProvider } from "./providers/index";
import { fetchKeyFiles as utilsFetchKeyFiles } from "./providers/utils";

export async function fetchRepoInfo(owner: string, repo: string, url?: string) {
  const provider = url ? getProvider(url) : getProvider("github.com");
  return provider.fetchRepoInfo(owner, repo);
}

export async function fetchRepoTree(owner: string, repo: string, url?: string) {
  const provider = url ? getProvider(url) : getProvider("github.com");
  return provider.fetchRepoTree(owner, repo);
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  url?: string
): Promise<string> {
  const provider = url ? getProvider(url) : getProvider("github.com");
  return provider.fetchFileContent(owner, repo, path);
}

export async function fetchLanguages(owner: string, repo: string, url?: string) {
  const provider = url ? getProvider(url) : getProvider("github.com");
  return provider.fetchLanguages(owner, repo);
}

export async function fetchKeyFiles(
  owner: string,
  repo: string,
  allFiles: string[],
  url?: string
): Promise<{ path: string; content: string }[]> {
  const provider = url ? getProvider(url) : getProvider("github.com");
  return utilsFetchKeyFiles(allFiles, (path) => provider.fetchFileContent(owner, repo, path));
}

export function getDownloadUrl(owner: string, repo: string, url: string, branch?: string): string {
  const provider = getProvider(url);
  return provider.getDownloadUrl(owner, repo, branch);
}

export { parseRepoUrl };
