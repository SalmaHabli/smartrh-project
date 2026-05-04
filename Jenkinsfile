pipeline {
  agent {
    kubernetes {
      yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-sa
  containers:
  - name: kubectl
    image: bitnami/kubectl:1.28
    command:
    - sleep
    args:
    - 99d
    tty: true
    securityContext:
      runAsUser: 0
'''
    }
  }
  stages {
    stage('Test Kubernetes') {
      steps {
        container('kubectl') {
          sh 'kubectl get nodes'
          sh 'kubectl get pods -A'
        }
      }
    }
  }
}
