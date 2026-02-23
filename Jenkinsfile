pipeline {
    agent any

    environment {
        // --- DOCKER HUB CONFIGURATION ---
        // Change this to your actual Docker Hub username
        DOCKERHUB_USERNAME = 'moizaman'
        
        // This MUST match the ID of the credentials you create in Jenkins (Global scope, Username/Password)
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Clone explicitly from the GitHub repository
                git branch: 'main', url: 'https://github.com/MoizAnsari-Dev/crud-dd-task-mean-app.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building Backend & Frontend Images using Compose..."
                    // Export the username so standard docker-compose parses the image name perfectly
                    sh "DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME} docker-compose build"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Logging into Docker Hub securely..."
                    withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, passwordVariable: 'DOCKERHUB_PASS', usernameVariable: 'DOCKERHUB_USER')]) {
                        sh "echo \$DOCKERHUB_PASS | docker login -u \$DOCKERHUB_USER --password-stdin"
                        
                        echo "Pushing freshly built images to Docker Hub..."
                        sh "DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME} docker-compose push"
                    }
                }
            }
        }

        stage('Deploy Locally (on EC2)') {
            steps {
                script {
                    echo "Deploying directly to this EC2 instance where Jenkins is running..."
                    
                    sh """
                        # Export username so compose parses correctly
                        export DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}
                        
                        # Pull latest images
                        docker-compose pull
                        
                        # Restart containers; orphans removed, only updated images recreated
                        docker-compose up -d --remove-orphans
                    """
                }
            }
        }
    }

    post {
        success {
            echo "CI/CD Pipeline success! Latest changes are now live on the VM."
        }
        failure {
            echo "Pipeline failed. Check Jenkins logs for details."
        }
        always {
            // Logout for security
            sh "docker logout || true"
            // Cleanup the workspace to avoid old cache taking up Jenkins disk
            cleanWs()
        }
    }
}
