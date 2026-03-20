# Modern CI/CD Pipeline & Container Promotion Platform

**Role:** DevOps Engineer & Infrastructure Automation Lead

## The Challenge

In our legacy continuous integration and deployment (CI/CD) setup, our organization relied on virtual machine-based Jenkins servers individually mapped to each environment (Dev, Staging, Production). This architecture presented significant bottlenecks:
* **Code Promotion over Container Promotion:** For every promotion between environments, Docker images were rebuilt from scratch rather than promoting tested artifacts. This bypassed a core tenet of immutable infrastructure.
* **Redundant Builds:** Pipeline runs unnecessarily triggered full image builds even if only configuration files had changed, burning valuable compute compute time.
* **Maintenance Overhead:** Operating a swarm of Jenkins VM instances across multiple environments meant we had to manage and scale CI infrastructure manually.

To modernize our stack, we needed a unified single-pane-of-glass solution that strictly enforced container promotion, intelligently differentiated between code and config changes, and ran efficiently on our Kubernetes infrastructure.

## The Solution: The Argo Ecosystem

We moved entirely to an enterprise-grade, Kubernetes-native pipeline leveraging the Argo ecosystem. Instead of Jenkins' opinionated structure, Argo Workflows allowed us to implement logic where each pipeline step runs reliably within an ephemeral Pod. 

### Technology Stack
* **Source Control:** GitHub
* **Event Triggers:** Argo Events (to capture webhooks directly from GitHub)
* **Pipeline Orchestration:** Argo Workflows
* **GitOps Deployment:** Argo CD
* **Image Management:** Google Artifact Registry (utilizing distinct registries per environment along with a unified virtual registry)

## Key Features & Workflow Intelligence

### 1. True Container Promotion
We configured a rigid branch strategy that promotes containers instead of rebuilding code:
* **Dev Environment:** Commits to `feature/` branches merged into `dev` trigger an Argo Workflow to build a new image, push it to the Dev Artifact Registry, update the manifest repository, and trigger Argo CD.
* **Staging Promotion:** Creating a `release/` branch from `dev` triggers a *promotion workflow*. Instead of rebuilding, the pipeline fetches the exact Dev Docker image and promotes it directly directly to the Staging Artifact Registry.
* **Production Deployment:** Merging `release/` into `master` promotes the Staging image directly to the Production registry, ensuring complete immutability before heading to live environments.

### 2. Intelligent Smart Builds via Python
While Argo handles the heavy lifting of orchestration, the "brain" of the pipeline is a custom Python service I programmed.
* **Code vs. Config Detection:** The Python code pulls the repository to analyze the commit. If only configurations (e.g., config maps) changed, the pipeline skips the image build and directly copies the configurations to the target manifest directory. 
* **Dynamic Manifest Updates:** The code identifies whether the service utilizes Helm, Kustomize, or raw Argo CD Application manifests, applying the resulting configuration or image updates to the appropriate deployment definition.
* **Context-Aware Building:** It detects if a repository uses a standard `Dockerfile` or a multi-service `Docker bake` file, subsequently triggering the correct DAG task in the Argo Workflow.

### 3. Automated Bugfix and Hotfix Management
* **Staging Bugfixes:** If QA finds bugs on a `release` branch, developers can create a `bugfix/` branch. The pipeline securely builds a fresh image just for staging. Crucially, the pipeline automatically processes a *back-merge* to the `dev` branch to keep codebases synchronized.
* **Production Hotfixes:** If a critical error reaches production and the `release` branch is already ahead of `master`, developers create a `hotfix/` branch directly directly from `master`. Our Python script deploys this to Staging, orchestrates a back-merge directly to both `release` and `dev` branches, and cleans up the Staging environment automatically.

## Security Architecture
Our revamp ensured strict security adherence:
* **No Long-Lived Credentials:** Eliminated GitHub Personal Access Tokens (PATs) in favor of GitHub Apps.
* **Rootless Builds:** Docker builds initially run using Moby BuildKit (rootless instances), eventually transitioning to ephemeral Docker-in-Docker (DinD) pods that spin down immediately after building `bake` files.
* **Cloud-Native Secrets:** Implemented Workload Identity Federation so the CI/CD pipeline running in Kubernetes uses IAM to fetch pipeline variables from Google Secret Manager.

## Key Learnings & Takeaways

1. **Mastering the Argo Ecosystem:** Gained deep architectural expertise in Argo Workflows and Argo Events. I discovered the immense flexibility of Workflow DAGs, which our organization actually started adopting over Apache Airflow for certain ETL processes.
2. **Developing with Python:** Transitioned from Go to Python to build the core pipeline logic. Python was deliberately chosen over Go so that other DevOps engineers cross-functionally could easily read, reason about, and modify the scripts.
3. **Object-Oriented Design (OOP):** Deepened my software engineering skills by leaning heavily into OOP principles, leveraging factories and inheritance architectures to build scalable logic.
4. **Open Source Contribution:** Discovered a limitation regarding GitHub RuleSets while using the `PyGithub` library. I made my first open-source contributions by submitting test-case fixes to a pending Pull Request on the PyGithub main repository, ultimately helping that crucial PR get successfully merged.