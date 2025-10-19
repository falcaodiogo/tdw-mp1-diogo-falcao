pipeline {
    agent any
    
    triggers {
        cron('H 0 * * *')
        githubPush()
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
                    // Copy the .env.local secret file to workspace
                    withCredentials([file(credentialsId: 'adfb10f9-7976-45b2-a754-25a9ac84adab', variable: 'ENV_FILE')]) {
                        sh '''
                            cp $ENV_FILE .env.local
                            echo "✅ .env.local file copied successfully"
                            # Optional: Verify the file was created (don't print sensitive content)
                            if [ -f .env.local ]; then
                                echo "📄 .env.local exists with $(wc -l < .env.local) lines"
                            else
                                echo "❌ .env.local was not created"
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
                expression { params.TRIGGERED_BY == 'contentful' }
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
            // Clean up sensitive file
            sh '''
                if [ -f .env.local ]; then
                    rm .env.local
                    echo "🧹 .env.local cleaned up"
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