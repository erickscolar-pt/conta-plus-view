// Pipeline de deploy Conta+ Web (Next.js)
pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timestamps()
    timeout(time: 25, unit: 'MINUTES')
  }

  stages {
    stage('Deploy') {
      steps {
        sh 'sudo -n /opt/fontes/scripts/deploy-contaplus.sh conta-plus-view'
      }
    }
  }

  post {
    success { echo 'Deploy conta-plus-view concluido.' }
    failure { echo 'Falha no deploy conta-plus-view. Verifique Console Output e pm2 logs.' }
  }
}
