import { Octokit } from "@octokit/rest";
import type { RepoProvider, RepoInfo, LanguageInfo } from "./base";

export class GitHubProvider implements RepoProvider {
    private async getAccessToken() {
        if (process.env.GITHUB_TOKEN) {
            return process.env.GITHUB_TOKEN;
        }
        throw new Error(
            "GitHub authentication not configured. Please set GITHUB_TOKEN environment variable."
        );
    }

    private async getClient() {
        const accessToken = await this.getAccessToken();
        return new Octokit({ auth: accessToken });
    }

    detect(url: string): boolean {
        return url.includes("github.com");
    }

    parseUrl(url: string): { owner: string; repo: string } | null {
        const cleaned = url.trim().replace(/\/+$/, "");
        const patterns = [
            /^https?:\/\/(www\.)?github\.com\/([^/]+)\/([^/]+)/,
            /^github\.com\/([^/]+)\/([^/]+)/,
            /^([^/]+)\/([^/]+)$/,
        ];

        for (const pattern of patterns) {
            const match = cleaned.match(pattern);
            if (match) {
                const owner = match[match.length - 2];
                const repo = match[match.length - 1].replace(/\.git$/, "");
                if (owner && repo && !owner.includes(".")) {
                    return { owner, repo };
                }
            }
        }
        return null;
    }

    async fetchRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
        try {
            const octokit = await this.getClient();
            const { data } = await octokit.repos.get({ owner, repo });
            return {
                name: data.name,
                owner: data.owner.login,
                description: data.description || "",
                stars: data.stargazers_count,
                forks: data.forks_count,
                language: data.language || "Unknown",
                url: data.html_url,
                defaultBranch: data.default_branch,
            };
        } catch (error: any) {
            if (error.status === 404) {
                throw new Error(`Repository not found: ${owner}/${repo}. Make sure it exists and is public.`);
            }
            throw error;
        }
    }

    async fetchRepoTree(owner: string, repo: string): Promise<string[]> {
        const octokit = await this.getClient();
        const { data: repoData } = await octokit.repos.get({ owner, repo });
        const defaultBranch = repoData.default_branch;

        const { data: refData } = await octokit.git.getRef({
            owner,
            repo,
            ref: `heads/${defaultBranch}`,
        });

        const { data: treeData } = await octokit.git.getTree({
            owner,
            repo,
            tree_sha: refData.object.sha,
            recursive: "true",
        });

        return treeData.tree
            .filter((item) => item.type === "blob")
            .map((item) => item.path || "")
            .filter(Boolean);
    }

    async fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
        const octokit = await this.getClient();
        try {
            const { data } = await octokit.repos.getContent({ owner, repo, path });
            if ("content" in data && data.content) {
                return Buffer.from(data.content, "base64").toString("utf-8");
            }
            return "";
        } catch {
            return "";
        }
    }

    async fetchLanguages(owner: string, repo: string): Promise<LanguageInfo[]> {
        const octokit = await this.getClient();
        const { data } = await octokit.repos.listLanguages({ owner, repo });
        const total = Object.values(data).reduce((sum, val) => sum + val, 0);
        return Object.entries(data).map(([name, bytes]) => ({
            name,
            percentage: Math.round((Number(bytes) / total) * 100),
        }));
    }

    getDownloadUrl(owner: string, repo: string, branch?: string): string {
        const ref = branch || "main";
        return `https://github.com/${owner}/${repo}/archive/refs/heads/${ref}.zip`;
    }
}
