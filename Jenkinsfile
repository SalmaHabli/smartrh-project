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
    - name: DOCKER_HOST
      value: "tcp://localhost:2375"
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
    DOCKER_CREDS   = "dockerhub-credentials1"
    K8S_NAMESPACE  = "smartrh"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'echo "✅ Commit: $(git rev-parse --short HEAD)"'
      }
    }

    // ⚠️ NOUVELLE ÉTAPE : Initialisation du démon Docker
    stage('Initialisation Docker') {
      steps {
        container('docker') {
          script {
            sh '''
              echo "🐳 Attente du démarrage du démon Docker..."
              
              # Attendre que Docker soit prêt (max 60 secondes)
              for i in $(seq 1 30); do
                if docker info > /dev/null 2>&1; then
                  echo "✅ Démon Docker prêt !"
                  docker version
                  break
                fi
                echo "⏳ Démon Docker pas encore prêt... (tentative $i/30)"
                sleep 2
              done
              
              # Vérification finale
              if ! docker info > /dev/null 2>&1; then
                echo "❌ Le démon Docker n'a pas démarré"
                exit 1
              fi
            '''
          }
        }
      }
    }

    stage('Build Backend') {
      steps {
        container('docker') {
          sh """
            echo "🔨 Build du Backend..."
            docker build \
              -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
              -t ${BACKEND_IMAGE}:latest \
              ./backend
            echo "✅ Backend construit"
          """
        }
      }
    }

    stage('Build Frontend') {
      steps {
        container('docker') {
          sh """
            echo "🔨 Build du Frontend..."
            docker build \
              -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
              -t ${FRONTEND_IMAGE}:latest \
              ./frontend
            echo "✅ Frontend construit"
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
            sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
            sh """
              docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
              docker push ${BACKEND_IMAGE}:latest
              docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
              docker push ${FRONTEND_IMAGE}:latest
              echo "✅ Images poussées vers Docker Hub (salma217/)"
            """
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        container('kubectl') {
          script {
            sh """
              echo "🚀 Déploiement Kubernetes..."
              
              # Vérifier et créer les déploiements si inexistants
              if ! kubectl get deployment smartrh-backend -n ${K8S_NAMESPACE} > /dev/null 2>&1; then
                echo "Création du déploiement backend..."
                kubectl apply -f k8s/backend-deployment.yaml -n ${K8S_NAMESPACE} || true
              fi
              
              if ! kubectl get deployment smartrh-frontend -n ${K8S_NAMESPACE} > /dev/null 2>&1; then
                echo "Création du déploiement frontend..."
                kubectl apply -f k8s/frontend-deployment.yaml -n ${K8S_NAMESPACE} || true
              fi
              
              # Mise à jour des images
              kubectl set image deployment/smartrh-backend \
                backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                -n ${K8S_NAMESPACE} --record
                
              kubectl set image deployment/smartrh-frontend \
                frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                -n ${K8S_NAMESPACE} --record
                
              echo "✅ Images mises à jour dans Kubernetes"
            """
          }
        }
      }
    }

    stage('Statut du Rollout') {
      steps {
        container('kubectl') {
          sh """
            echo "⏳ Rollout du Backend..."
            kubectl rollout status deployment/smartrh-backend \
              -n ${K8S_NAMESPACE} --timeout=120s

            echo "⏳ Rollout du Frontend..."
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
          for dep in smartrh-backend smartrh-frontend; do
            if kubectl rollout history deployment/\$dep -n ${K8S_NAMESPACE} > /dev/null 2>&1; then
              kubectl rollout undo deployment/\$dep -n ${K8S_NAMESPACE}
              echo "⏪ Rollback effectué pour: \$dep"
            else
              echo "⚠️  Pas d'historique pour \$dep — rollback ignoré"
            fi
          done
        """
      }
    }
  }
}
