# 🔍 RepoLens: Visualize Your Repository Architecture

**RepoLens** is a powerful, AI-driven tool designed to help developers instantly understand complex codebases. By analyzing GitHub and GitLab repositories, it generates interactive architecture diagrams, maps API endpoints, identifies database schemas, and more.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Express](https://img.shields.io/badge/Express-5-green)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5-orange)

## 🚀 Key Features

- **Multi-Provider Support**: Seamlessly analyze repositories from **GitHub** and **GitLab** (including nested groups).
- **Interactive Architecture Flow**: Visual node-based diagrams showing how your frontend, API, and Database interact.
- **Deep Code Analysis**: AI-powered detection of Tech Stacks, Environment Variables, and architecture patterns.
- **Source Code Hub**: Download the source code of any interpreted repository as a ZIP instantly.
- **Export Capabilities**: Download your architecture diagrams as **SVG**, **PNG**, or **PDF**.
- **Modern UI**: A premium, glassmorphism-inspired interface with dark mode support.

## 🛠️ Built With

- **Frontend**: React, Vite, TanStack Query, Radix UI, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express, Drizzle ORM, Supabase (PostgreSQL).
- **AI Engine**: Google Gemini 2.5 Flash API.
- **Visualization**: React Flow / XYFlow.

## 📦 Getting Started

### Local Development

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/INDRAKUMAR2005/Repolens.git
   cd Repolens
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root:
   ```env
   DATABASE_URL=your_supabase_postgresql_url
   GEMINI_API_KEY=your_google_ai_studio_key
   GITHUB_TOKEN=your_personal_access_token
   SESSION_SECRET=your_random_secret
   ```

4. **Run the App**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5000](http://localhost:5000)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### 👤 Author
This project was conceived, designed, and implemented **100% solo** by:
**[INDRAKUMAR](https://github.com/INDRAKUMAR2005)**

No external contributors were involved in the development of this codebase.
Built with ❤️ by INDRAKUMAR.
