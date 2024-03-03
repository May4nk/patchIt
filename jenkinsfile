pipeline {
  agent any
  stages {
    stage("build"){
      steps {
        sh "sudo docker-compose up"
      }
    }
    stage("test"){
      steps {
        echo "test"
      }
    }
    stage("deploy"){
      steps {
        echo "deploy"
      }
    }
  }
}
