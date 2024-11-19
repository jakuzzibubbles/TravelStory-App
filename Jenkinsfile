pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "backend-image"
        FRONTEND_IMAGE = "frontend-image"
        MONGO_IMAGE = "mongo:latest"
        DOCKER_REGISTRY = "jakuzzibubbles"
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Preparation') {
            steps {
                script {
                    echo 'Checking Docker version...'
                    sh 'docker --version'
                    sh 'docker-compose --version'
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    echo 'Logging in to Docker Registry...'
                    sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                }
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            echo 'Building backend image...'
                            sh "docker-compose -f ${DOCKER_COMPOSE_FILE} build backend"
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        script {
                            echo 'Building frontend image...'
                            sh "docker-compose -f ${DOCKER_COMPOSE_FILE} build frontend"
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Run Backend Tests') {
                    steps {
                        script {
                            echo 'Running tests for backend...'
                            sh "docker-compose exec backend npm run test || exit 1"
                        }
                    }
                }
                stage('Run Frontend Tests') {
                    steps {
                        script {
                            echo 'Running tests for frontend...'
                            sh "docker-compose exec frontend npm run test || exit 1"
                        }
                    }
                }
            }
        }

        stage('Start MongoDB and Services') {
            steps {
                script {
                    echo 'Starting MongoDB and other services...'
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d mongodb"

                    // Wait for MongoDB to be ready
                    sh '''
                    while ! docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T mongodb mongo --eval "print(\\"waited for connection\\")"; do
                        echo "Waiting for MongoDB to be ready..."
                        sleep 5
                    done
                    '''
                    
                    echo 'Starting backend and frontend services...'
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d backend frontend"
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                script {
                    echo 'Pushing backend image to registry...'
                    sh "docker tag backend ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest"
                    sh "docker push ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:latest"
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                script {
                    echo 'Pushing frontend image to registry...'
                    sh "docker tag frontend ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest"
                    sh "docker push ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:latest"
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up...'
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} down"  // Clean up all running containers and resources
            }
        }
        success {
            script {
                echo 'Pipeline completed successfully!'
            }
        }
        failure {
            script {
                echo 'Pipeline failed!'
        }
    }
}
