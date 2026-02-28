<div align="center">
  <img src="https://github.com/user-attachments/assets/eb6176b1-3516-4e11-a313-49de53f809dc" alt="Luminary Journal Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;">
  
  <h1 align="center">✨ Luminary Journal: Kubernetes Edition ✨</h1>
  <p align="center">
    <strong>A production-ready MEAN stack application demonstrating advanced DevOps principles, Kubernetes orchestration, and CI/CD automation.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Orchestrator-Kubernetes-326CE5.svg?style=for-the-badge&logo=kubernetes" alt="Kubernetes" />
    <img src="https://img.shields.io/badge/Container-Docker-2496ED.svg?style=for-the-badge&logo=docker" alt="Docker" />
    <img src="https://img.shields.io/badge/CI%2FCD-Jenkins-D24939.svg?style=for-the-badge&logo=jenkins" alt="Jenkins" />
    <img src="https://img.shields.io/badge/Proxy-Nginx-009639.svg?style=for-the-badge&logo=nginx" alt="Nginx" />
    <img src="https://img.shields.io/badge/Stack-MEAN-green.svg?style=for-the-badge&logo=mongodb" alt="MEAN Stack" />
  </p>
</div>

---

## 📖 Overview

While on the surface this is a sleek, minimalist personal journaling platform (built with Angular 15, Node.js, and MongoDB), under the hood it has been completely architected to showcase **scalable, production-ready DevOps infrastructure**. 

This repository includes a full suite of declarative Kubernetes manifests, zero-downtime CI/CD deployment pipelines, horizontal autoscalers, and secure configuration maps.

---

## 🏗️ DevOps Architecture & Kubernetes Infrastructure

The application has been explicitly designed to run on a Kubernetes cluster with the following advanced configurations located in the `/k8s` directory:

### 1. Zero-Trust Networking & Resource Isolation
- **Custom Namespace:** All workloads are isolated dynamically into the `mean-app` namespace.
- **ClusterIP Integrity:** The `mongodb` and `backend` services utilize secure internal `ClusterIP` networks. They are completely sealed off from the external internet to prevent unauthorized access.
- **Nginx Ingress / Load Balancing:** The frontend and backend are intelligently marshalled by an Nginx reverse-proxy. Nginx itself is exposed via a robust Kubernetes `LoadBalancer`, unifying external access safely through Port 80.

### 2. Secrets & Configuration Management
- **Declarative ConfigMaps:** Non-sensitive environmental variables (like the application `PORT` and internal `DB_HOST` routing) are abstracted out of the Docker images and injected at runtime via `k8s/configmap.yaml`.
- **Opaque Secrets:** The sensitive MongoDB connection string and credentials are base64-encoded and securely passed directly into the backend pods via Kubernetes Secrets (`k8s/secret.yaml`).

### 3. High Availability & Data Persistence
- **Horizontal Pod Autoscaling (HPA):** Both the frontend and backend deployments are tethered to Kubernetes `HorizontalPodAutoscaler` objects. If CPU utilization exceeds 60% or Memory exceeds 70%, the cluster automatically replicates the backend (up to 5 pods) and the frontend (up to 4 pods) to handle the load dynamically.
- **Self-Healing Probes:** Every pod is configured with sophisticated `livenessProbe` and `readinessProbe` checks. The cluster actively monitors HTTP endpoints to ensure containers are ready for traffic, gracefully preventing "CrashLoopBackOff" timeouts during heavy Angular compilation.
- **Stateful Storage (AWS EBS):** The MongoDB Pod utilizes a `PersistentVolumeClaim` tied to the dynamically provisioned AWS `gp2` StorageClass. This guarantees database persistence even if the node shuts down or the database pod is destroyed.

---

## 🔄 Automated CI/CD Pipelines (Jenkins)

This repository comes equipped with a modern `Jenkinsfile1` dedicated entirely to Kubernetes:

1. **Checkout:** Pulls latest code from the `main` branch.
2. **Build:** Compiles the raw source code into robust frontend/backend Docker images.
3. **Registry Push:** Authenticates securely with Docker Hub credentials and pushes the newly built `latest` images natively.
4. **Deploy to Cluster:** Connects directly into the target Kubernetes cluster and declaratively maps everything into existence:
   - Configures namespaces, secrets, and config maps.
   - Bootstraps the database PVC and provisions AWS storage.
   - Spins up Application pods, LoadBalancers, and Autoscalers.
   - Initiates a zero-downtime `kubectl rollout restart` to force the live pods to seamlessly consume the newly compiled images.

---

## ⚙️ Quick Start Setup Instructions

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

# Verify everything is running natively!
kubectl get all -n mean-app
```

### Option 2: Docker Compose (For Local Testing)
For rapid local validation without a Kubernetes cluster, a `docker-compose.yml` file is provided that perfectly mimics the architecture locally.

```bash
docker-compose up -d --build
```
> **UI Access:** `http://localhost/`  
> **API Access:** `http://localhost/api/tutorials`

---

## 🚀 Application Features (The Frontend)

- **Notion-Style UI Canvas:** Minimalist, edge-to-edge blank page journal environment for distraction-free typing. 
- **AI Auto-Categorization:** System logically scans titles to automatically inject smart categorization tags like "Work" or "Personal" instantly.
- **Live Memory-Dom Tracking:** Dynamically counts and displays real-time word statistics over your entries without network requests.
- **Glassmorphism Design:** Beautiful dark-mode UI styled using Vercel/Shadcn design aesthetic guidelines.

<p align="center">
  <i>Architected with passion.</i>
</p>
