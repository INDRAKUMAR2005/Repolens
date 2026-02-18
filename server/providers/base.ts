export interface RepoInfo {
    name: string;
    owner: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    defaultBranch?: string;
}

export interface FileContent {
    path: string;
    content: string;
}

export interface LanguageInfo {
    name: string;
    percentage: number;
}

export interface RepoProvider {
    detect(url: string): boolean;
    parseUrl(url: string): { owner: string; repo: string } | null;
    fetchRepoInfo(owner: string, repo: string): Promise<RepoInfo>;
    fetchRepoTree(owner: string, repo: string): Promise<string[]>;
    fetchFileContent(owner: string, repo: string, path: string): Promise<string>;
    fetchLanguages(owner: string, repo: string): Promise<LanguageInfo[]>;
    getDownloadUrl(owner: string, repo: string, branch?: string): string;
}
