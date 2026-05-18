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

    stage('Initialisation Docker') {
      steps {
        container('docker') {
          script {
            sh '''
              echo "🐳 Attente du démarrage du démon Docker..."
              for i in $(seq 1 30); do
                if docker info > /dev/null 2>&1; then
                  echo "✅ Démon Docker prêt !"
                  docker version
                  break
                fi
                echo "⏳ Démon Docker pas encore prêt... (tentative $i/30)"
                sleep 2
              done
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
              echo "✅ Images poussées vers Docker Hub"
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
              
              if ! kubectl get deployment smartrh-backend -n ${K8S_NAMESPACE} > /dev/null 2>&1; then
                echo "Création du déploiement backend..."
                kubectl apply -f k8s/backend-deployment.yaml -n ${K8S_NAMESPACE} || true
              fi
              
              if ! kubectl get deployment smartrh-frontend -n ${K8S_NAMESPACE} > /dev/null 2>&1; then
                echo "Création du déploiement frontend..."
                kubectl apply -f k8s/frontend-deployment.yaml -n ${K8S_NAMESPACE} || true
              fi
              
              kubectl set image deployment/smartrh-backend \
                backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                -n ${K8S_NAMESPACE}
                
              kubectl set image deployment/smartrh-frontend \
                frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                -n ${K8S_NAMESPACE}
                
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
              -n ${K8S_NAMESPACE} --timeout=300s || true

            echo "⏳ Rollout du Frontend..."
            kubectl rollout status deployment/smartrh-frontend \
              -n ${K8S_NAMESPACE} --timeout=300s || true

            echo ""
            echo "===== PODS FINAUX ====="
            kubectl get pods -n ${K8S_NAMESPACE}
            
            # Vérification finale que les pods sont bien Running
            BACKEND_RUNNING=\$(kubectl get pods -n ${K8S_NAMESPACE} -l app=smartrh-backend --field-selector=status.phase=Running --no-headers | wc -l)
            FRONTEND_RUNNING=\$(kubectl get pods -n ${K8S_NAMESPACE} -l app=smartrh-frontend --field-selector=status.phase=Running --no-headers | wc -l)
            
            if [ \$BACKEND_RUNNING -eq 2 ] && [ \$FRONTEND_RUNNING -eq 2 ]; then
              echo "✅ Tous les pods sont en état Running"
            else
              echo "⚠️ Certains pods ne sont pas encore prêts, mais le déploiement continue"
            fi
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
      echo "❌ ÉCHEC — Vérification des pods avant rollback..."
      container('kubectl') {
        sh """
          # Vérifier si les pods actuels sont sains avant de faire rollback
          BACKEND_RUNNING=\$(kubectl get pods -n ${K8S_NAMESPACE} -l app=smartrh-backend --field-selector=status.phase=Running --no-headers | wc -l)
          
          if [ \$BACKEND_RUNNING -eq 0 ]; then
            echo "⚠️ Aucun pod backend en état Running - Rollback nécessaire"
            for dep in smartrh-backend smartrh-frontend; do
              if kubectl rollout history deployment/\$dep -n ${K8S_NAMESPACE} > /dev/null 2>&1; then
                kubectl rollout undo deployment/\$dep -n ${K8S_NAMESPACE}
                echo "⏪ Rollback effectué pour: \$dep"
              fi
            done
          else
            echo "✅ Des pods sont en état Running - Pas de rollback nécessaire"
            echo "📊 État actuel des déploiements:"
            kubectl get pods -n ${K8S_NAMESPACE}
          fi
        """
      }
    }
  }
}
