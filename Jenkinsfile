pipeline {
    agent any

    environment {
        // Define environment variables for your project
        GITHUB_REPO = 'https://github.com/yourusername/yourrepository.git'
        BRANCH = 'main'
        DOCKER_IMAGE = 'travel-story-frontend'
        DOCKER_REGISTRY = 'yourdockerregistry'
        DOCKER_TAG = "latest"
    }

    options {
        // Keep the last 10 successful builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from GitHub
                git branch: "${BRANCH}", url: "${GITHUB_REPO}"
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests (assume you have test scripts set up)
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image for frontend
                    sh 'docker build -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG} .'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Login to Docker registry (use Jenkins credentials for security)
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY'

                    // Push the Docker image to the registry
                    sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    // Assuming you're using Docker Compose or any other deployment tool
                    // Pull and deploy the Docker image
                    sh 'docker pull ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}'
                    sh 'docker run -d -p 80:80 --name ${DOCKER_IMAGE} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}'
                }
            }
        }
    }

    post {
        always {
            // Clean up, remove Docker containers/images if necessary
            sh 'docker container prune -f'
            sh 'docker image prune -f'
        }
        success {
            // Success actions, like notifications
            echo 'Pipeline completed successfully!'
        }
        failure {
            // Failure actions, like notifying the team
            echo 'Pipeline failed.'
        }
    }
}
