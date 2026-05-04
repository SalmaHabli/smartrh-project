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
    image: registry.k8s.io/kubectl:v1.28.0
    command:
    - cat
    tty: true
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
