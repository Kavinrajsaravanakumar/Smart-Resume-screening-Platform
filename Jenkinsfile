pipeline {
    agent any

    environment {
        REGISTRY = 'resume-screening'
        AWS_REGION = 'us-east-1'
        S3_BUCKET_NAME = 'srs-platform'
        DYNAMODB_TABLE = 'candidates'
        HR_TABLE = 'hr-users'
        FRONTEND_ORIGIN = 'https://main.d1234567890.amplifyapp.com'
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
                  -e NODE_ENV=production \
                  -e AWS_REGION=$AWS_REGION \
                  -e S3_BUCKET_NAME=$S3_BUCKET_NAME \
                  -e DYNAMODB_TABLE=$DYNAMODB_TABLE \
                  -e HR_TABLE=$HR_TABLE \
                  -e FRONTEND_ORIGIN=$FRONTEND_ORIGIN \
                  -e JWT_SECRET=$JWT_SECRET \
                  -e SNS_TOPIC_ARN=$SNS_TOPIC_ARN \
                  -e S3_PRESIGNED_URL_EXPIRY_SECONDS=900 \
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
