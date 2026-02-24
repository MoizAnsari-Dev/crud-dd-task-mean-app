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
                    sh "docker build -t ${DOCKERHUB_USERNAME}/mean-task-backend:latest ./backend"

                    echo "Building Frontend Image from Dockerfile..."
                    sh "docker build -t ${DOCKERHUB_USERNAME}/mean-task-frontend:latest ./frontend"
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
                    sh "docker push ${DOCKERHUB_USERNAME}/mean-task-backend:latest"
                    sh "docker push ${DOCKERHUB_USERNAME}/mean-task-frontend:latest"
                }
            }
        }

        stage('Deploy on EC2)') {
            steps {
                script {
                    echo "Deploying directly to this EC2 instance..."
                    
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
            sh "docker logout || true"
            cleanWs()
        }
    }
}
