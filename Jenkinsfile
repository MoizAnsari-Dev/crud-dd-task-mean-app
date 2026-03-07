pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'moizaman'

        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/MoizAnsari-Dev/crud-dd-task-mean-app.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building Backend Image from Dockerfile..."
                    sh "docker build -t ${DOCKERHUB_USERNAME}/mean-task-backend:1.0.$BUILD_NUMBER ./backend"

                    echo "Building Frontend Image from Dockerfile..."
                    sh "docker build -t ${DOCKERHUB_USERNAME}/mean-task-frontend:1.0.$BUILD_NUMBER ./frontend"

                    echo "Building Auth Backend Image from Dockerfile..."
                    sh "docker build -t ${DOCKERHUB_USERNAME}/mean-task-auth-backend:1.0.$BUILD_NUMBER ./auth-backend"
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.DOCKERHUB_CREDENTIALS_ID,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Pushing freshly built images to Docker Hub..."
                    sh "docker push ${DOCKERHUB_USERNAME}/mean-task-backend:1.0.$BUILD_NUMBER"
                    sh "docker push ${DOCKERHUB_USERNAME}/mean-task-frontend:1.0.$BUILD_NUMBER"
                    sh "docker push ${DOCKERHUB_USERNAME}/mean-task-auth-backend:1.0.$BUILD_NUMBER"
                }
            }
        }

        stage('Deploy on EC2)') {
            steps {
                script {
                    echo "Deploying directly to this EC2 instance..."
                    
                    sh """
                        export DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}
                        
                        docker-compose pull
                        
                        # Fix for older docker-compose v1 instances failing due to ContainerConfig bug from new Images
                        docker-compose down
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
            sh "docker logout || true"
            cleanWs()
        }
    }
}
