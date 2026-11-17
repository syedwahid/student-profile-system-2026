pipeline {
    agent any
    environment {
        IMAGE_NAME       = 'student-profile-system-2026'
        NAMESPACE        = 'student-profile-system-2026'
        MINIKUBE_PROFILE = 'scs4004'
        KUBECONFIG       = '/var/jenkins_home/.kube-ci/config'
    }
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Build Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }
        stage('Load Image into Minikube') {
            steps {
                sh """
                    docker save ${IMAGE_NAME}:${BUILD_NUMBER} -o /tmp/${IMAGE_NAME}-${BUILD_NUMBER}.tar
                    docker exec -i ${MINIKUBE_PROFILE} ctr -n k8s.io images import - < /tmp/${IMAGE_NAME}-${BUILD_NUMBER}.tar
                    docker exec -i ${MINIKUBE_PROFILE}-m02 ctr -n k8s.io images import - < /tmp/${IMAGE_NAME}-${BUILD_NUMBER}.tar
                    rm /tmp/${IMAGE_NAME}-${BUILD_NUMBER}.tar
                """
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/secrets.yaml
                    kubectl apply -f k8s/postgres.yaml
                    sed 's/__BUILD_TAG__/${BUILD_NUMBER}/' k8s/student-app.yaml | kubectl apply -f -
                    kubectl apply -f k8s/student-app-service.yaml
                    kubectl rollout status deployment/${IMAGE_NAME} -n ${NAMESPACE} --timeout=90s
                """
            }
        }
        stage('Verify') {
            steps {
                sh "kubectl get pods -n ${NAMESPACE} -o wide"
            }
        }
    }
}