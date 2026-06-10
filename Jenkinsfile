pipeline {
    agent any

    environment {
        REGISTRY = 'resume-screening'
        AWS_REGION = 'us-east-1'
        S3_BUCKET_NAME = 'srs-platform'
        DYNAMODB_TABLE = 'candidates'
        HR_TABLE = 'hr-users'
        FRONTEND_ORIGIN = 'https://main.d2g1dv29g79yh0.amplifyapp.com'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci || npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $REGISTRY/backend:$BUILD_NUMBER backend'
                sh 'docker tag $REGISTRY/backend:$BUILD_NUMBER $REGISTRY/backend:latest'
            }
        }

        stage('Push Docker Image') {
            when {
                expression { return env.DOCKER_REGISTRY_URL?.trim() }
            }
            steps {
                sh '''
                docker tag $REGISTRY/backend:$BUILD_NUMBER $DOCKER_REGISTRY_URL/$REGISTRY/backend:$BUILD_NUMBER
                docker tag $REGISTRY/backend:latest $DOCKER_REGISTRY_URL/$REGISTRY/backend:latest
                docker push $DOCKER_REGISTRY_URL/$REGISTRY/backend:$BUILD_NUMBER
                docker push $DOCKER_REGISTRY_URL/$REGISTRY/backend:latest
                '''
            }
        }

        stage('Deploy Backend Container') {
            steps {
                sh '''
                docker stop resume-backend || true
                docker rm resume-backend || true

                docker run -d \
                --name resume-backend \
                -p 5000:5000 \
                --restart unless-stopped \
                --env-file /home/ubuntu/Smart-Resume-screening-Platform/backend/.env \
                $REGISTRY/backend:$BUILD_NUMBER
                '''
            }
        }
    }

    post {
        success {
            echo 'Backend deployment completed successfully!'
        }
        failure {
            echo 'Backend pipeline failed!'
        }
    }
}
