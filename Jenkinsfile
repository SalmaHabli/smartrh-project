pipeline {
    agent any

    stages {

        stage('Check Project') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                sh '''
                kubectl apply -f postgres-pv.yaml
                kubectl apply -f postgres-pvc.yaml -n smartrh
                kubectl apply -f postgres-deployment.yaml -n smartrh
                kubectl apply -f postgres-service.yaml -n smartrh

                kubectl apply -f backend-deployment.yaml -n smartrh
                kubectl apply -f backend-service.yaml -n smartrh

                kubectl apply -f frontend-deployment.yaml -n smartrh
                kubectl apply -f frontend-service.yaml -n smartrh
                '''
            }
        }

        stage('Done') {
            steps {
                echo 'SmartRH deployed successfully'
            }
        }
    }
}
