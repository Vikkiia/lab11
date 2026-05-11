def runCommand(String command) {
  if (isUnix()) {
    sh command
  } else {
    bat command
  }
}

pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        script {
          runCommand('npm ci')
        }
      }
    }

    stage('Test') {
      steps {
        script {
          runCommand('npm test')
        }
      }
    }

    stage('Build') {
      steps {
        script {
          runCommand('npm run build')
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
    }

    success {
      echo 'CI/CD pipeline completed successfully.'
    }

    failure {
      echo 'Pipeline failed. Check console output for details.'
    }
  }
}
