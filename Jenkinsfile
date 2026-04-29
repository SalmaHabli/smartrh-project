pipeline {
    agent any

    environment {
        APP_NAME = "smartrh"
        NAMESPACE = "smartrh"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/SalmaHabli/smartrh-project.git'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'docker build -t smartrh-backend ./backend'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t smartrh-frontend ./frontend'
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }

        stage('Verify') {
            steps {
                sh 'kubectl get pods -n smartrh'
            }
        }
    }
}
