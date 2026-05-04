pipeline {
  agent {
    kubernetes {
      yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-sa
  containers:
  - name: docker
    image: docker:24-dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-storage
      mountPath: /var/lib/docker
  - name: kubectl
    image: alpine/k8s:1.28.15
    command: ["sleep"]
    args: ["99d"]
    tty: true
    securityContext:
      runAsUser: 0
  volumes:
  - name: docker-storage
    emptyDir: {}
'''
    }
  }

  environment {
    REGISTRY       = "salma217"
    BACKEND_IMAGE  = "${REGISTRY}/smartrh-backend"
    FRONTEND_IMAGE = "${REGISTRY}/smartrh-frontend"
    IMAGE_TAG      = "${BUILD_NUMBER}"
    DOCKER_CREDS   = "dockerhub-credentials"
    K8S_NAMESPACE  = "smartrh"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'echo "✅ Commit: $(git rev-parse --short HEAD)"'
      }
    }

    stage('Build Backend') {
      steps {
        container('docker') {
          sh """
            echo "🔨 Build Backend..."
            docker build \
              -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
              -t ${BACKEND_IMAGE}:latest \
              ./backend
            echo "✅ Backend buildé"
          """
        }
      }
    }

    stage('Build Frontend') {
      steps {
        container('docker') {
          sh """
            echo "🔨 Build Frontend..."
            docker build \
              -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
              -t ${FRONTEND_IMAGE}:latest \
              ./frontend
            echo "✅ Frontend buildé"
          """
        }
      }
    }

    stage('Push Images') {
      steps {
        container('docker') {
          withCredentials([usernamePassword(
            credentialsId: "${DOCKER_CREDS}",
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          )]) {
            sh """
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

              docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
              docker push ${BACKEND_IMAGE}:latest

              docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
              docker push ${FRONTEND_IMAGE}:latest

              echo "✅ Images pushées → salma217/ sur Docker Hub"
            """
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        container('kubectl') {
          sh """
            echo "🚀 Déploiement Kubernetes..."

            # nom container = backend (tel que défini dans ton YAML)
            kubectl set image deployment/smartrh-backend \
              backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
              -n ${K8S_NAMESPACE}

            # nom container = frontend (tel que défini dans ton YAML)
            kubectl set image deployment/smartrh-frontend \
              frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
              -n ${K8S_NAMESPACE}

            echo "✅ Images mises à jour dans Kubernetes"
          """
        }
      }
    }

    stage('Rollout Status') {
      steps {
        container('kubectl') {
          sh """
            echo "⏳ Rollout Backend..."
            kubectl rollout status deployment/smartrh-backend \
              -n ${K8S_NAMESPACE} --timeout=120s

            echo "⏳ Rollout Frontend..."
            kubectl rollout status deployment/smartrh-frontend \
              -n ${K8S_NAMESPACE} --timeout=120s

            echo ""
            echo "===== PODS FINAUX ====="
            kubectl get pods -n ${K8S_NAMESPACE}
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ BUILD #${BUILD_NUMBER} DÉPLOYÉ AVEC SUCCÈS !"
    }
    failure {
      echo "❌ ÉCHEC — Rollback en cours..."
      container('kubectl') {
        sh """
          kubectl rollout undo deployment/smartrh-backend -n ${K8S_NAMESPACE}
          kubectl rollout undo deployment/smartrh-frontend -n ${K8S_NAMESPACE}
          echo "⏪ Rollback effectué"
        """
      }
    }
  }
}
