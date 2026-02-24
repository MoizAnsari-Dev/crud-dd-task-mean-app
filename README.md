# MEAN Stack Application with Nginx Reverse Proxy & CI/CD

This project is a fully containerized Full-Stack CRUD Application built using the **MEAN stack** (MongoDB, Express, Angular 15, Node.js). It includes a complete CI/CD pipeline using Jenkins and is served securely through an Nginx Reverse Proxy on port `80`.

## Architecture & Infrastructure

- **Frontend:** Angular 15 Client
- **Backend:** Node.js & Express REST API
- **Database:** MongoDB 
- **Web Server / Proxy:** Nginx proxying `/api` to the backend and `/` to the frontend.
- **CI/CD:** Jenkins declarative pipeline pushing to Docker Hub and deploying via SSH.

---

## Setup & Deployment Instructions

### Option 1: Using Docker Compose (Recommended)
The easiest way to run the entire application locally or on a Virtual Machine without installing Node or MongoDB directly is by utilizing the provided `docker-compose.yml` file.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MoizAnsari-Dev/crud-dd-task-mean-app.git
   cd crud-dd-task-mean-app
   ```

2. **Run the stack:**
   This command automatically builds the frontend and backend Docker images, starts an official MongoDB container, configures the internal network, and sets up Nginx.
   ```bash
   docker-compose up -d --build
   ```

3. **Access the Application:**
   Open your browser and navigate to:
   - **Frontend UI:** `http://localhost/` (or your VM's public IP)
   - **Backend API:** `http://localhost/api/tutorials` (Routed seamlessly by Nginx)

4. **Shut down:**
   ```bash
   docker-compose down
   ```

---

### Option 2: Running Locally (Development Mode)

#### 1. Start MongoDB
You must have MongoDB running locally on port `27017`. You can easily spin it up using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb-server mongo:latest
```

#### 2. Start the Backend Server
```bash
cd backend
npm install
node server.js
```
*The backend will start on port `8080`.*

#### 3. Start the Angular Client
```bash
cd frontend
npm install
npx ng serve --port 8081
```
*The frontend will start on port `8081`.*

---

## CI/CD Configuration (Jenkins)

This repository includes a `Jenkinsfile` that fully automates the CI/CD lifecycle:
1. **Checkout:** Pulls the latest code from the `main` branch.
2. **Build:** Uses Docker Compose to build the new Frontend and Backend images.
3. **Push:** Logs into Docker Hub using secured credentials and pushes the newly built images.
4. **Deploy:** Connects to the target Virtual Machine via SSH, pulls the latest images from Docker Hub, and safely restarts the containers.

**Note:** To replicate this pipeline, ensure your Jenkins environment has the `dockerHubCredentials` (Username/Password) and `vmSshCredentials` configured globally.

---

## Screenshots & Deliverables

*(Please refer to the repository images/ directory or append the requested screenshots here)*

### 1. CI/CD Configuration and Execution
*Placeholder for Jenkins pipeline success screenshot*

### 2. Docker Image Build & Push Process
*Placeholder for Docker Hub repository / Terminal output*

### 3. Application Deployment and Working UI
*Placeholder for the Angular UI running live in the browser*

### 4. Nginx Setup & Infrastructure
*Placeholder for Nginx config terminal / Network tab routing `/api` correctly*
