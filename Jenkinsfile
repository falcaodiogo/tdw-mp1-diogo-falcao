pipeline {
    agent any
    
    triggers {
        cron('H 0 * * *')
    }
    
    parameters {
        choice(
            name: 'TRIGGERED_BY',
            choices: ['manual', 'scheduled', 'push', 'pull_request'],
            description: 'Triggered by'
        )
    }
    
    stages {
        stage('Load Environment Variables') {
            steps {
                script {
                    checkout scm
                    withCredentials([file(credentialsId: 'f4512677-b6f6-449c-9083-1003dbf1cd39', variable: 'ENV_FILE')]) {
                        sh '''
                            cp $ENV_FILE .env.local
                            if [ ! -f .env.local ]; then
                                exit 1
                            fi
                        '''
                    }
                }
            }
        }
        
        stage('Husky') {
            steps {
                script {
                    sh '''
                        npm install
                        npx husky run pre-commit
                    '''
                }
            }
        }
        
        stage('Lint') {
            steps {
                script {
                    sh '''
                        npm install
                        npx prettier --check .
                        npx next lint
                    '''
                }
            }
        }
        
        stage('Tests') {
            steps {
                script {
                    sh '''
                        npm install
                        npm test
                    '''
                }
            }
        }
        
        stage('Build') {
            when {
                expression { 
                    return currentBuild.result == null || currentBuild.result == 'SUCCESS' 
                }
            }
            steps {
                script {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }
        
        stage('Deploy') {
        when {
            anyOf {
                branch 'main'
                expression { params.TRIGGERED_BY == 'scheduled' }
                expression { params.TRIGGERED_BY == 'manual' }
            }
        }
        steps {
            script {
                withCredentials([
                    string(credentialsId: 'NETLIFY_SITE_ID', variable: 'NETLIFY_SITE_ID'),
                    string(credentialsId: 'NETLIFY_AUTH_TOKEN', variable: 'NETLIFY_AUTH_TOKEN')
                ]) {
                    sh '''
                        npm install
                        npm install netlify-cli --save-dev
                        npx netlify deploy --site $NETLIFY_SITE_ID --auth $NETLIFY_AUTH_TOKEN --prod --dir=.next
                    '''
                }
            }
        }
}
    }
    
    post {
        always {
            sh '''
                if [ -f .env.local ]; then
                    rm .env.local
                fi
            '''
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}