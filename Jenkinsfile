pipeline {
  agent {
    kubernetes {
      yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - sleep
    args:
    - "999999"
    tty: true
'''
    }
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Deploy Test') {
      steps {
        container('kubectl') {
          sh 'kubectl get pods -A'
        }
      }
    }

  }
}
