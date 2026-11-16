pipeline {
    agent any
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
    }
}
