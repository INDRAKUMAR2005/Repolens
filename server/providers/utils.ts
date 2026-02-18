export const KEY_FILE_PATTERNS = [
    "package.json",
    "requirements.txt",
    "Pipfile",
    "pyproject.toml",
    "Cargo.toml",
    "go.mod",
    "pom.xml",
    "build.gradle",
    "Gemfile",
    "composer.json",
    ".env.example",
    ".env.sample",
    "docker-compose.yml",
    "Dockerfile",
    "Makefile",
    "README.md",
    "tsconfig.json",
    "vite.config.ts",
    "vite.config.js",
    "webpack.config.js",
    "next.config.js",
    "next.config.ts",
    "nuxt.config.ts",
    "angular.json",
];

export const CODE_EXTENSIONS = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".py",
    ".go",
    ".rs",
    ".java",
    ".rb",
    ".php",
    ".cs",
    ".vue",
    ".svelte",
];

export const ROUTE_PATTERNS = [
    "route",
    "router",
    "controller",
    "endpoint",
    "api",
    "handler",
    "middleware",
    "server",
    "app",
    "index",
    "main",
    "urls",
    "views",
];

export async function fetchKeyFiles(
    allFiles: string[],
    fetchFileContent: (path: string) => Promise<string>,
): Promise<{ path: string; content: string }[]> {
    const filesToFetch: string[] = [];

    for (const file of allFiles) {
        const fileName = file.split("/").pop() || "";
        const fileLower = file.toLowerCase();

        if (KEY_FILE_PATTERNS.some((p) => fileName === p || fileLower.endsWith(p))) {
            filesToFetch.push(file);
            continue;
        }

        const ext = "." + fileName.split(".").pop();
        if (CODE_EXTENSIONS.includes(ext)) {
            if (
                ROUTE_PATTERNS.some(
                    (p) => fileLower.includes(p) || fileName.toLowerCase().includes(p),
                )
            ) {
                filesToFetch.push(file);
                continue;
            }

            if (
                fileLower.includes("page") ||
                fileLower.includes("screen") ||
                fileLower.includes("component") ||
                fileLower.includes("service") ||
                fileLower.includes("model") ||
                fileLower.includes("schema") ||
                fileLower.includes("database") ||
                fileLower.includes("db") ||
                fileLower.includes("auth") ||
                fileLower.includes("config")
            ) {
                filesToFetch.push(file);
            }
        }
    }

    const limitedFiles = filesToFetch.slice(0, 60);
    const results: { path: string; content: string }[] = [];

    // Boost speed: Fetch all key files in a single parallel batch
    const batchResults = await Promise.all(
        limitedFiles.map(async (path) => {
            const content = await fetchFileContent(path).catch(() => "");
            const truncated = content.slice(0, 4000); // Increased context window slightly
            return { path, content: truncated };
        }),
    );
    results.push(...batchResults);

    return results;
}
