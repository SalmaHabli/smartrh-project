pipeline {
    agent any

    stages {

        stage('Use Local Project') {
            steps {
                sh 'ls -la /root/devops-project-PFE'
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                sh '''
                ansible-playbook -i /root/ansible-k8s/inventory /root/ansible-k8s/playbooks/deploy-k8s.yml
                '''
            }
        }

        stage('Done') {
            steps {
                echo 'Deployment Success'
            }
        }
    }
}
