<div align="center">

<img src="https://github.com/user-attachments/assets/eb6176b1-3516-4e11-a313-49de53f809dc" alt="Luminary Journal Banner" width="100%" style="border-radius: 15px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">

# ✨ Luminary Journal ✨  
**A breathtaking, distraction-free personal journaling platform powered by Enterprise-Grade Kubernetes Infrastructure.**

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <br/>
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white" alt="Jenkins" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
</p>

[Explore Features](#-uiux-features) • [DevOps Architecture](#-enterprise-devops--kubernetes) • [Getting Started](#-getting-started) • [CI/CD](#-automated-cicd-pipeline)

</div>

---

## 📖 About The Project

What started as a simple Mean Stack CRUD tutorial application has evolved into **Luminary Journal**: a highly polished, Notion-inspired writing companion designed to capture your thoughts in a beautifully minimalist environment. 

But Luminary isn't just a pretty interface. Underneath its glassmorphic design lies a **production-ready Kubernetes engine**, featuring horizontal auto-scaling, stateful persistent storage, zero-trust networking, and seamless Jenkins CI/CD integration. 

---

## 🎨 UI/UX Features

We obsessed over every pixel to create a journaling experience that feels like a premium SaaS product.

| Feature | Description |
| :--- | :--- |
| **📝 Notion-Style Canvas** | Say goodbye to clunky borders. The "New Entry" screen mimics a flawless blank page with oversized typography, edge-to-edge inputs, and soft ghost-text placeholders. |
| **🔒 Journal Vault System** | Luminary natively acts as a private draft board. When an entry is finished, click the **Lock** padlock to instantly vault it securely. |
| **🧠 AI-Powered Tagging** | Titles are scanned intelligently. An entry named "My Work Ideas" gets automatically categorized under `Work` and `Ideas` tags directly on your dashboard. |
| **⭐ Interactive Rating** | Instantly rank your days/entries from 0 to 5 stars via hovering icon interactions directly from the list view—no reloading required. |
| **📊 Live Word Count** | A sleek, floating widget instantly counts and updates your word statistics in real-time as you type your thoughts onto the canvas. |
| **🌗 Glassmorphism UI** | Built with fully custom, modern CSS. Enjoy beautiful Vercel-inspired tab layouts, smooth micro-animations, custom scrollbars, and vibrant status badges. |

<details>
<summary>📸 <strong>Click to view UI Screenshots</strong></summary>

<br/>
<img src="https://github.com/user-attachments/assets/eb6176b1-3516-4e11-a313-49de53f809dc" width="800">
<img src="https://github.com/user-attachments/assets/d5e0793e-e12a-40a7-9698-eab8e9fa4ad9" width="800">
</details>

---

## 🛡️ Enterprise DevOps & Kubernetes

Luminary Journal is architected to scale. The entire environment is declaratively defined in the `/k8s` directory, built for high availability and zero-downtime deployments.

<details open>
<summary><strong>📐 Architecture Highlights</strong></summary>

* **Zero-Trust Networking:** All workloads are isolated dynamically into the `mean-app` namespace. The MongoDB and Node.js APIs utilize secure `ClusterIP` networks, sealed tightly from the external internet.
* **Nginx Ingress / Load Balancing:** The entire stack is intelligently marshalled by an Nginx reverse-proxy facing the public via a robust Kubernetes `LoadBalancer` on Port 80.
* **Declarative Config & Secrets:** Hardcoded variables are banished. Non-sensitive routing variables are injected via `ConfigMap`, while MongoDB credentials are base64-encoded through Opaque `Secret` files.
* **Horizontal Pod Autoscaling (HPA):** Powered by Kubernetes Metrics Server. If CPU spikes over 60% or RAM exceeds 70%, the API automatically scales (up to 5 pods) to handle the load.
* **Self-Healing Probes:** Every pod utilizes surgical `livenessProbe` and `readinessProbe` HTTP checks to prevent "CrashLoopBackOff" timeouts during heavy Angular compilation.
* **Stateful AWS Storage:** The Database utilizes a `PersistentVolumeClaim` tied dynamically to the AWS `gp2` StorageClass, guaranteeing journal persistence even during cluster node rotations.
</details>

---

## 🚀 Getting Started

Deploying Luminary Journal is a breeze, whether you want to spin it up locally or push it to a cloud cluster.

### Option 1: Full Kubernetes Deployment (Recommended)
Assuming you have a running cluster (Minikube, EKS, or GKE) and `kubectl` configured:

```bash
# 1. Clone the repository
git clone https://github.com/MoizAnsari-Dev/crud-dd-task-mean-app.git
cd crud-dd-task-mean-app

# 2. Generate the namespace first
kubectl apply -f k8s/namespace.yaml

# 3. Deploy configuration maps and secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 4. Deploy the infrastructure (DB, API, Client, and Proxy)
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/nginx.yaml

# 5. Enable Autoscaling Rules
kubectl apply -f k8s/hpa.yaml
```
*Run `kubectl get all -n mean-app` to verify all resources!*

### Option 2: Docker Compose (Local Testing)
For rapid local validation without a Kubernetes cluster:
```bash
docker-compose up -d --build
```
* **UI Access:** `http://localhost/`  
* **API Access:** `http://localhost/api/tutorials`

---

## 🔄 Automated CI/CD Pipeline

We utilize a robust Jenkins Declarative Pipeline (`Jenkinsfile1`) to push changes seamlessly to Kubernetes.

1. **Checkout:** Pulls the latest code directly from the `main` branch.
2. **Build:** Compiles the raw source code into optimized Angular and Node.js Docker containers.
3. **Registry Push:** Authenticates securely and pushes the `latest` tagged images to Docker Hub.
4. **K8s Rollout:** Applies all manifests (`namespace`, `configs`, `secrets`, `deployments`) and issues a zero-downtime `kubectl rollout restart` across the ecosystem.

<details>
<summary>📸 <strong>Click to view CI/CD Screenshots</strong></summary>

<br/>
<img src="https://github.com/user-attachments/assets/f7a8008d-bf53-4b41-85ca-b1eec97af22f" width="800">
<img src="https://github.com/user-attachments/assets/2af07c26-576f-4872-b184-35399cb414a2" width="800">
</details>

---

<div align="center">
  <b>Built with ❤️ and modern engineering principles.</b><br><br>
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="Built with Love">
  <img src="https://forthebadge.com/images/badges/makes-people-smile.svg" alt="Makes People Smile">
</div>
