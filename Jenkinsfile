pipeline {
    agent any

    environment {
        SONAR_HOME = tool 'Sonar'
    }

    stages {

        stage('Clone Repository') {
            steps {

                git branch: 'develop',
                    url: 'git@github.com:bharathhonakatti26/OpsPilot.git'

            }
        }

        stage('SonarQube Analysis') {
            steps {

                withSonarQubeEnv('Sonar') {

                    sh '''
                    $SONAR_HOME/bin/sonar-scanner \
                    -Dsonar.projectName=OpsPilot \
                    -Dsonar.projectKey=OpsPilot \
                    -Dsonar.sources=.
                    '''

                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {

                dependencyCheck(
                    additionalArguments: '''
                        --scan ./ 
                        --format XML
                        --out .
                    ''',
                    odcInstallation: 'OWASP'
                )

                dependencyCheckPublisher(
                    pattern: 'dependency-check-report.xml'
                )
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {

                sh '''
                trivy fs . > trivy-report.txt
                '''

            }
        }

        stage('Docker Compose Deployment') {
            steps {

                sh '''
                docker compose down
                docker compose up --build -d
                '''

            }
        }
    }

    post {

        success {
            echo 'Pipeline executed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}