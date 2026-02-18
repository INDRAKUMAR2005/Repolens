import { GitHubProvider } from "./github";
import { GitLabProvider } from "./gitlab";
import type { RepoProvider } from "./base";

const providers: RepoProvider[] = [
    new GitHubProvider(),
    new GitLabProvider(),
];

export function getProvider(url: string): RepoProvider {
    const provider = providers.find((p) => p.detect(url));
    return provider || providers[0]; // Default to GitHub if unsure
}

export function parseRepoUrl(url: string) {
    for (const provider of providers) {
        if (provider.detect(url)) {
            const parsed = provider.parseUrl(url);
            if (parsed) return { ...parsed, provider };
        }
    }

    // Final fallback to GitHub parsing logic
    const github = providers[0];
    const parsed = github.parseUrl(url);
    return parsed ? { ...parsed, provider: github } : null;
}
