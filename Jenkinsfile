pipeline {
    agent any

    environment {
        // You can change these image names depending on your Docker Hub / Registry setup
        BACKEND_IMAGE = 'mean-task-backend'
        FRONTEND_IMAGE = 'mean-task-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                // Check out the code from the Git repository
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    dir('backend') {
                        echo "Building Backend Image..."
                        sh "docker build -t ${BACKEND_IMAGE}:latest -t ${BACKEND_IMAGE}:${env.BUILD_ID} ."
                    }
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    dir('frontend') {
                        echo "Building Frontend Image..."
                        sh "docker build -t ${FRONTEND_IMAGE}:latest -t ${FRONTEND_IMAGE}:${env.BUILD_ID} ."
                    }
                }
            }
        }

        stage('Deploy via Docker Compose') {
            steps {
                script {
                    echo "Deploying the full MEAN stack using Docker Compose..."
                    // Start the containers using the docker-compose file in the repository root
                    sh "docker-compose down"
                    sh "docker-compose up -d --build"
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully! MEAN Stack is up and running."
        }
        failure {
            echo "Pipeline failed. Please check the logs."
        }
        always {
            // Optional: clean up the workspace to free up Jenkins disk space
            cleanWs()
        }
    }
}
