<div align="center">

<img src="https://github.com/user-attachments/assets/eb6176b1-3516-4e11-a313-49de53f809dc" alt="Luminary Journal Banner" width="100%" style="border-radius: 15px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">

# MEAN Microservices Architecture with GitOps  
**Enterprise-Grade Kubernetes Infrastructure on AWS EKS using Jenkins, ArgoCD, and Nginx Ingress.**

<p align="center">
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/AWS_EKS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/ArgoCD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white" alt="ArgoCD" />
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white" alt="Jenkins" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Nginx_Ingress-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
</p>

[Architecture & Design](#-enterprise-devops--kubernetes) • [GitOps CI/CD](#-automated-gitops-pipeline-jenkins--argocd) • [Security & Autoscaling](#-security--autoscaling) • [Installation](#-getting-started)

</div>

---

## About The Project

This repository serves as a showcase of modern **DevOps, Cloud-Native architecture, and GitOps practices**. While the core application is a polished, Notion-inspired MEAN stack journaling platform, the true focus of this project is the robust, highly scalable infrastructure orchestrating it.

Built on **Amazon Elastic Kubernetes Service (EKS)**, the platform implements a zero-trust microservice architecture, true GitOps continuous delivery via **ArgoCD**, dynamic CI pipelines via **Jenkins**, and traffic routing via an **AWS Network Load Balancer (NLB)** managed by Nginx Ingress.

---

## Enterprise DevOps & Kubernetes Architecture

The environment is entirely declaratively defined in the `/k8s` directory and architected for high availability, self-healing, and zero-downtime rolling updates.

```mermaid
flowchart TD
    %% Custom Styling
    classDef user fill:#6366f1,stroke:#4338ca,stroke-width:3px,color:#ffffff
    classDef aws fill:#ff9900,stroke:#e68a00,stroke-width:3px,color:#ffffff
    classDef backend fill:#22c55e,stroke:#166534,stroke-width:3px,color:#ffffff
    classDef frontend fill:#ef4444,stroke:#991b1b,stroke-width:3px,color:#ffffff
    classDef auth fill:#0ea5e9,stroke:#0369a1,stroke-width:3px,color:#ffffff
    classDef database fill:#eab308,stroke:#854d0e,stroke-width:3px,color:#ffffff
    classDef storage fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#ffffff
    classDef cicd fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#ffffff
    classDef argocd fill:#f97316,stroke:#c2410c,stroke-width:3px,color:#ffffff

    User((User Traffic)):::user --> |HTTP/HTTPS| NLB[AWS Network Load Balancer]:::aws
    NLB --> Ingress[Nginx Ingress Controller]:::aws
    
    subgraph EKS [Amazon EKS Cluster / Namespace: mean-app]
        direction TB
        Ingress --> |"/"| FE[Angular Frontend]:::frontend
        Ingress --> |"/api"| BE[Node.js Core Backend]:::backend
        Ingress --> |"/auth"| AUTH[Node.js Auth Service]:::auth
        
        FE -.-> BE
        BE --> |Mongoose| DB[MongoDB]:::database
        AUTH --> |SQL| PG[PostgreSQL]:::database
        
        DB --> |Stateful Volume| PVC1[(AWS EBS gp2)]:::storage
        PG --> |Stateful Volume| PVC2[(AWS EBS gp2)]:::storage
    end

    subgraph GITOPS [GitOps & CI/CD Pipeline]
        Repo(GitHub Repository)
        Jenkins[Jenkins CI]:::cicd
        DHub[Docker Hub]:::cicd
        Argo[ArgoCD Controller]:::argocd
        
        Repo --> |Webhook Trigger| Jenkins
        Jenkins --> |1. Build & Push Image| DHub
        Jenkins --> |2. Commit YAML Tag Bumps| Repo
        Argo <==> |3. Auto Sync K8s State| Repo
        Argo --> |4. Deploy Updates| EKS
    end
```

### Infrastructure Highlights
* **Nginx Ingress on AWS EKS:** An AWS Network Load Balancer (NLB) provisions external IPs automatically. Advanced Regex rewriting at the ingress level (`nginx.ingress.kubernetes.io/rewrite-target`) seamlessly routes traffic to independent microservices (`/api` vs `/auth`).
* **Microservices Segmentation:** Monoliths are broken down. The core backend and authentication backend are decoupled, utilizing MongoDB and PostgreSQL respectively to demonstrate multi-database stateful deployments.
* **Declarative Config & Secrets:** Environment variables are strictly maintained through K8s `ConfigMap` resources, avoiding hard-coded variables inside Docker images. Sensitive credentials are Base64 encoded into `Secret` resources.

---

## Automated GitOps Pipeline (Jenkins + ArgoCD)

This infrastructure aggressively abandons imperative `kubectl apply` commands in favor of a true **Pull-based GitOps approach**. 

1. **Continuous Integration (Jenkins):** Upon a code merge, Jenkins executes a declarative pipeline (`Jenkinsfile1`). It builds Docker images dynamically tagged with the `$BUILD_NUMBER` and pushes them to Docker Hub.
2. **Manifest Updation:** Jenkins securely authenticates back into the GitHub repository, sed-replaces the old image tags in the specific Kubernetes deployment YAMLs (`k8s/`), and commits the new tags bypassing the CI trigger.
3. **Continuous Deployment (ArgoCD):** Deployed inside the EKS cluster, ArgoCD continuously monitors the `main` branch. The moment Jenkins pushes the manifest update, ArgoCD catches the drift and automatically initiates a zero-downtime rolling update to synchronize the live cluster state with the Git repository.

---

## Security & Autoscaling

- **Horizontal Pod Autoscaling (HPA):** Powered by the Kubernetes Metrics Server. If CPU spikes over 60% or Memory over 70%, the HPA automatically provisions new replicas (scaling from 1 to 5 pods) to absorb traffic spikes, scaling back down when load subsides.
- **Self-Healing Infrastructure:** Rigorous HTTP `livenessProbe` and `readinessProbe` blocks ensure traffic isn't routed to malfunctioning or starting containers.
- **Zero-Trust Network Limits:** Pods utilize precise Resource Requests and Limits (e.g. CPU `100m` request, `500m` limit) to prevent rogue memory leaks from crashing the host EKS nodes.

---

## Getting Started

Deploying the entire infrastructure can be done via ArgoCD.

### 1. Provision the Cluster & Ingress
Ensure your Kubernetes core components (like the AWS Nginx Ingress Controller) are installed:
```bash
# Install Ingress for AWS EKS
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.4/deploy/static/provider/aws/deploy.yaml
```

### 2. Install ArgoCD
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml --server-side --force-conflicts
```

### 3. Deploy the Application
Apply the overarching ArgoCD Application manifest. ArgoCD will instantly construct the cluster matching the GitHub `k8s/` directory.
```bash
kubectl apply -f k8s/argocd-app.yaml
```

### Option 2: Docker Compose (Local Testing)
For rapid local validation without Kubernetes overhead:
```bash
docker-compose up -d --build
```

---

<div align="center">
  <b>Architected for the Cloud, Built for Scale.</b><br><br>
</div>
