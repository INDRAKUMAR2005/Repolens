import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Radar,
  GitFork,
  Database,
  Globe,
  Layers,
  Download,
  ArrowRight,
  Search,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  Github,
  Sparkles,
  Code2,
} from "lucide-react";

const REPO_URL_PATTERN = /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com)\/[a-zA-Z0-9_./-]+\/[a-zA-Z0-9_.-]+\/?$/;

const features = [
  {
    icon: Radar,
    title: "API Endpoint Detection",
    description: "Automatically discover and catalog all REST and GraphQL endpoints across your codebase.",
    tag: "Detection",
  },
  {
    icon: GitFork,
    title: "Frontend-Backend Flow",
    description: "Trace data flow from UI components through API calls to backend handlers and responses.",
    tag: "Flow",
  },
  {
    icon: Database,
    title: "Database Mapping",
    description: "Visualize your database schema, relationships, and how models connect to your application logic.",
    tag: "Schema",
  },
  {
    icon: Globe,
    title: "External Services",
    description: "Identify third-party integrations, webhooks, and external API dependencies in your project.",
    tag: "Services",
  },
  {
    icon: Layers,
    title: "Tech Stack Summary",
    description: "Get a comprehensive overview of frameworks, libraries, and tools powering your repository.",
    tag: "Stack",
  },
  {
    icon: Download,
    title: "Downloadable Diagrams",
    description: "Export architecture diagrams as SVG or PNG for documentation and team presentations.",
    tag: "Export",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const validateUrl = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError("Please enter a repository URL");
      return false;
    }
    if (!REPO_URL_PATTERN.test(trimmed)) {
      setValidationError("URL must match: {github|gitlab}.com/username/repository");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) {
      validateUrl(value);
    } else {
      setValidationError("");
    }
  };

  const mutation = useMutation({
    mutationFn: async (repoUrl: string) => {
      const res = await apiRequest("POST", "/api/validate-url", { url: repoUrl });
      return res.json();
    },
    onSuccess: () => {
      const encodedUrl = encodeURIComponent(url.trim());
      setLocation(`/analysis?url=${encodedUrl}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Validation Failed",
        description: error.message || "Could not validate the repository URL.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!validateUrl(url)) return;
    mutation.mutate(url.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, hsl(9 75% 61%) 0%, transparent 50%), " +
            "radial-gradient(circle at 80% 70%, hsl(35 90% 55%) 0%, transparent 50%), " +
            "radial-gradient(circle at 50% 50%, hsl(170 50% 45%) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-6 text-xs">
            Architecture Analysis
          </Badge>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
            style={{
              background: "linear-gradient(135deg, hsl(9 75% 61%), hsl(35 90% 55%), hsl(170 50% 45%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            data-testid="text-hero-title"
          >
            RepoLens
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Visualize Your Repository Architecture
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-xl mx-auto mb-20"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="github.com or gitlab.com URL"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9"
                data-testid="input-repo-url"
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              data-testid="button-analyze"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                  Validating
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Analyze
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>

          <AnimatePresence>
            {validationError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 mt-2 text-sm text-destructive"
                data-testid="text-validation-error"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {validationError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/generate-docs")}
              data-testid="button-generate-docs"
            >
              <FileText className="w-4 h-4" />
              Generate README Docs
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={cardVariants}>
                <Card
                  className="hover-elevate active-elevate-2 h-full"
                  data-testid={`card-feature-${index}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: "hsl(9 75% 61% / 0.12)" }}
                      >
                        <Icon
                          className="w-4.5 h-4.5"
                          style={{ color: "hsl(9 75% 61%)" }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <h3 className="text-sm font-semibold">{feature.title}</h3>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {feature.tag}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-16 text-sm text-muted-foreground"
          data-testid="text-footer"
        >
          Paste any public GitHub or GitLab repository URL to get started
        </motion.div>

        {/* Creative Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7, ease: "easeOut" }}
          className="mt-24 relative"
        >
          {/* Decorative top border */}
          <div
            className="h-px w-full mb-12"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(9 75% 61% / 0.4), hsl(35 90% 55% / 0.4), transparent)",
            }}
          />

          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="inline-block mb-3"
            >
              <Sparkles className="w-6 h-6 mx-auto" style={{ color: "hsl(35 90% 55%)" }} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2" style={{
              background: "linear-gradient(135deg, hsl(9 75% 61%), hsl(35 90% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Let's Build Something Together
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Open to collaborating on open source projects, innovative ideas, and exciting developer tools. Let's connect!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            {/* Name Card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1 w-full"
            >
              <Card className="border-0 overflow-hidden" style={{
                background: "linear-gradient(135deg, hsl(9 75% 61% / 0.08), hsl(35 90% 55% / 0.08))",
                boxShadow: "0 0 0 1px hsl(9 75% 61% / 0.15)",
              }}>
                <CardContent className="p-5 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: "linear-gradient(135deg, hsl(9 75% 61%), hsl(35 90% 55%))" }}>
                    IM
                  </div>
                  <p className="font-semibold text-sm">Indrakumar M</p>
                  <p className="text-xs text-muted-foreground mt-1">Full Stack Developer</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Code2 className="w-3 h-3" style={{ color: "hsl(9 75% 61%)" }} />
                    <span className="text-xs text-muted-foreground">Open Source Enthusiast</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Links */}
            <div className="flex flex-col gap-3 flex-1 w-full">
              <motion.a
                href="mailto:indrakumar.m2005@gmail.com"
                whileHover={{ scale: 1.03, x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer group"
                style={{
                  background: "hsl(9 75% 61% / 0.07)",
                  border: "1px solid hsl(9 75% 61% / 0.2)",
                }}
              >
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: "hsl(9 75% 61% / 0.15)" }}>
                  <Mail className="w-4 h-4" style={{ color: "hsl(9 75% 61%)" }} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">indrakumar.m2005@gmail.com</p>
                </div>
              </motion.a>

              <motion.a
                href="tel:+919095334806"
                whileHover={{ scale: 1.03, x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer group"
                style={{
                  background: "hsl(35 90% 55% / 0.07)",
                  border: "1px solid hsl(35 90% 55% / 0.2)",
                }}
              >
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: "hsl(35 90% 55% / 0.15)" }}>
                  <Phone className="w-4 h-4" style={{ color: "hsl(35 90% 55%)" }} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">+91 9095334806</p>
                </div>
              </motion.a>

              <motion.a
                href="https://github.com/INDRAKUMAR2005"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer group"
                style={{
                  background: "hsl(170 50% 45% / 0.07)",
                  border: "1px solid hsl(170 50% 45% / 0.2)",
                }}
              >
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: "hsl(170 50% 45% / 0.15)" }}>
                  <Github className="w-4 h-4" style={{ color: "hsl(170 50% 45%)" }} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">GitHub</p>
                  <p className="text-sm font-medium">@INDRAKUMAR2005</p>
                </div>
              </motion.a>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-center text-xs text-muted-foreground mt-10"
          >
            Built with ❤️ by <span className="font-semibold" style={{ color: "hsl(9 75% 61%)" }}>Indrakumar M</span> · Open for collaboration & open source projects
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
