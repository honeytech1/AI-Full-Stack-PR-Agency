# 📋 Project Board: AI-Powered PR Suite (MCP)

This project board outlines the roadmap, milestones, and deliverables for the open-source execution of the **Media Communication Partner (MCP)** — an AI-powered PR automation platform.

---

## 🚀 Milestones

### ✅ Phase 0: Setup & Environment (Week 1)

* [ ] Initialize monorepo using Turborepo
* [ ] Scaffold frontend with Next.js + Tailwind + shadcn/ui
* [ ] Set up authentication with Clerk.dev or Supabase Auth
* [ ] Connect PostgreSQL + Prisma via Supabase
* [ ] Deploy CI/CD on Railway or Render

### 🔄 Phase 1: MVP Features (Weeks 2–4)

* [ ] Reputation Scanner Agent (NER + Sentiment)
* [ ] Narrative Gap Detector (Vector comparison via Weaviate)
* [ ] Brief Generator Bot (LLM fine-tuned prompts)
* [ ] Message Stress Testing (Simulated Q\&A via LangGraph)
* [ ] LangGraph Agent Orchestration Setup

### 📊 Phase 2: Analytics & Attribution (Weeks 5–6)

* [ ] Attribution Agent (Integrate GA4/PostHog)
* [ ] Visual Analytics Dashboard (Nivo/React Charts)
* [ ] Embed Support: Smart FAQ widget generator
* [ ] CRM-style database with founder profiles and hooks

### 🎨 Phase 3: Micro-content Studio (Weeks 7–8)

* [ ] Content Repurposing Agent (Carousel, Reel, Threads)
* [ ] Drag & Drop UI (DndKit)
* [ ] Canva/Figma Export Integration
* [ ] Prompt templating system (Plop.js)

### ⚠️ Phase 4: Crisis & Executive Training (Weeks 9–10)

* [ ] Real-Time Crisis Detector (RSSHub + alert bot)
* [ ] Interview Coach Agent (Simulated feedback loops)
* [ ] Final polish, unit tests, error monitoring
* [ ] Public release candidate build

---

## 📁 Modules

| Module                           | Status        | Owner    | Notes                                     |
| -------------------------------- | ------------- | -------- | ----------------------------------------- |
| Frontend UI (Next.js + Tailwind) | ⬜ Not started | FE Dev   | Includes shadcn/ui + dashboard components |
| Backend APIs (FastAPI/Express)   | ⬜ Not started | BE Dev   | Connects all core services                |
| LLM Agents (LangGraph)           | ⬜ Not started | LLM Eng  | Agent orchestration + RAG logic           |
| Vector DB (Weaviate)             | ⬜ Not started | Infra    | Embedding and search layer                |
| Analytics Layer                  | ⬜ Not started | Data Eng | PostHog/GA4 setup with visual UI          |

---

## ✅ Phase-Wise Toolchain

### 📦 Phase 0: Open Source Setup

* **Turborepo** – Monorepo manager
* **shadcn/ui** + Tailwind – UI scaffolding
* **Clerk.dev / Supabase Auth** – Auth + roles
* **Supabase + Prisma** – Postgres ORM & database
* **Railway / Render** – CI/CD & deployment

### ⚙️ Phase 1: Core Features

* **Haystack / LLMWare** – Sentiment + NER audit agent
* **LangChain + Weaviate** – Narrative gap detection
* **LangGraph** – Agent orchestration engine
* **PromptLayer + LangChain** – Prompt versioning & control
* **OpenRouter / Ollama** – LLM API routing layer

### 🧪 Phase 2: Analytics

* **PostHog / Ackee** – Attribution & behavior tracking
* **Nivo / Tanstack Charts** – Dashboard visualization
* **Smart Widget SDK** – Custom Q\&A embedding

### 🎯 Phase 3: Studio Tools

* **UnifyAI / Prompt Tools** – Repurposing agent
* **DndKit** – Drag-drop interface
* **Canva/Figma API** – Export content templates
* **Plop.js** – Prompt skeleton generator

### ⚠️ Phase 4: Risk & Coaching

* **RSSHub** – Web monitoring feed integration
* **LangChain** – Executive Q\&A simulation
* **Sentry + OpenStatus** – Monitoring + uptime

---

## 📌 Weekly Sprint Format

Each sprint includes:

* Clear objectives and feature branches
* LLM prompt reviews and test runs
* Demo walkthrough every Friday
* Issues + learnings documented in `/sprint-reports/`

---

## 🧠 Prompt & LLM Evaluation

| Tool                  | Purpose                                    |
| --------------------- | ------------------------------------------ |
| PromptLayer           | Prompt versioning & feedback               |
| LangSmith / Promptfoo | Prompt evaluation workflows                |
| OpenRouter            | Use multiple LLM providers interchangeably |

---

## 📦 Labels & Tags

* `feature` – Core feature work
* `bug` – Bugs or errors
* `infra` – Deployment, DB, or auth-related
* `agent` – LangGraph or LLM agent logic
* `prompt` – Prompt tuning / RAG
* `ui` – Frontend component styling
* `release` – Milestone tagging for Alpha, Beta, V1

---

## 🧑‍💻 Contributors & Roles

| Name     | Role            | Area                         |
| -------- | --------------- | ---------------------------- |
| PM (You) | Product Manager | Roadmap, QA, Release mgmt    |
| Dev A    | Full-stack Dev  | Frontend + API integration   |
| Dev B    | LLM Engineer    | Agent logic, LangGraph setup |
| Dev C    | UI Designer     | UX, drag-and-drop studio     |
| Dev D    | Infra Engineer  | CI/CD, Weaviate, Supabase    |

---

## 📎 Resources

* [LangGraph](https://github.com/langchain-ai/langgraph)
* [shadcn/ui](https://ui.shadcn.com/)
* [Weaviate](https://weaviate.io/)
* [Supabase](https://supabase.com/)
* [PromptLayer](https://www.promptlayer.com/)
* [PostHog](https://posthog.com/)
* [Ollama](https://ollama.com/)
* [Turborepo](https://turbo.build/repo)
* [Promptfoo](https://github.com/promptfoo/promptfoo)

---

> Want to contribute? Check out `CONTRIBUTING.md` (coming soon) or open an issue!
