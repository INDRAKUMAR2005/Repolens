import type { RepoProvider, RepoInfo, LanguageInfo } from "./base";

export class GitLabProvider implements RepoProvider {
    private getApiUrl() {
        return "https://gitlab.com/api/v4";
    }

    detect(url: string): boolean {
        return url.includes("gitlab.com");
    }

    parseUrl(url: string): { owner: string; repo: string } | null {
        const cleaned = url.trim().replace(/\/+$/, "");
        const match = cleaned.match(/gitlab\.com\/([\s\S]+)\/([^/]+)/);
        if (match) {
            // For GitLab, the 'owner' can be a path of groups (group/subgroup)
            const owner = match[1].split('/-')[0]; // Remove anything after the /-/ separator if present
            const repo = match[2].replace(/\.git$/, "");
            return { owner, repo };
        }
        return null;
    }

    private async fetchGitLab(path: string) {
        const token = process.env.GITLAB_TOKEN;
        const headers: Record<string, string> = {};
        if (token) {
            headers["PRIVATE-TOKEN"] = token;
        }
        const response = await fetch(`${this.getApiUrl()}${path}`, { headers });
        if (!response.ok) {
            if (response.status === 404) throw new Error("GitLab repository not found.");
            throw new Error(`GitLab API error: ${response.statusText}`);
        }
        return response.json();
    }

    async fetchRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
        const projectPath = encodeURIComponent(`${owner}/${repo}`);
        const data: any = await this.fetchGitLab(`/projects/${projectPath}`);
        return {
            name: data.name,
            owner: data.namespace.path,
            description: data.description || "",
            stars: data.star_count,
            forks: data.forks_count,
            language: "Unknown", // GitLab languages API is separate
            url: data.web_url,
            defaultBranch: data.default_branch,
        };
    }

    async fetchRepoTree(owner: string, repo: string): Promise<string[]> {
        const projectPath = encodeURIComponent(`${owner}/${repo}`);
        let allFiles: string[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const data: any = await this.fetchGitLab(`/projects/${projectPath}/repository/tree?recursive=true&per_page=100&page=${page}`);
            if (data.length === 0) {
                hasMore = false;
            } else {
                allFiles.push(...data.filter((item: any) => item.type === "blob").map((item: any) => item.path));
                page++;
            }
            if (page > 10) hasMore = false; // Safety limit
        }

        return allFiles;
    }

    async fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
        const projectPath = encodeURIComponent(`${owner}/${repo}`);
        const filePath = encodeURIComponent(path);
        const token = process.env.GITLAB_TOKEN;
        const headers: Record<string, string> = {};
        if (token) {
            headers["PRIVATE-TOKEN"] = token;
        }

        // Get default branch first or assume main/master
        const repoInfo = await this.fetchGitLab(`/projects/${projectPath}`);
        const branch = repoInfo.default_branch || "main";

        const response = await fetch(`${this.getApiUrl()}/projects/${projectPath}/repository/files/${filePath}/raw?ref=${branch}`, { headers });
        if (!response.ok) return "";
        return response.text();
    }

    async fetchLanguages(owner: string, repo: string): Promise<LanguageInfo[]> {
        const projectPath = encodeURIComponent(`${owner}/${repo}`);
        const data: any = await this.fetchGitLab(`/projects/${projectPath}/languages`);
        const total = Object.values(data).reduce((sum: number, val: any) => sum + val, 0);
        return Object.entries(data).map(([name, bytes]) => ({
            name,
            percentage: Math.round((Number(bytes) / total) * 100),
        }));
    }

    getDownloadUrl(owner: string, repo: string, branch?: string): string {
        const ref = branch || "main";
        return `https://gitlab.com/${owner}/${repo}/-/archive/${ref}/${repo}-${ref}.zip?ref_type=heads`;
    }
}
