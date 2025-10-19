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
        stage('Husky') {
            steps {
                script {
                    checkout scm
                    
                    withEnv(["NODE_VERSION=latest"]) {
                        sh '''
                            npm install
                            npx husky run pre-commit
                        '''
                    }
                }
            }
        }
        
        stage('Lint') {
            steps {
                script {
                    checkout scm
                    
                    withEnv(["NODE_VERSION=latest"]) {
                        sh '''
                            npm install
                            npx prettier --check .
                            npx next lint
                        '''
                    }
                }
            }
        }
        
        stage('Tests') {
            steps {
                script {
                    checkout scm
                    
                    withEnv(["NODE_VERSION=latest"]) {
                        sh '''
                            npm install
                            npm test
                        '''
                    }
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
                    checkout scm
                    
                    withEnv([
                        "NODE_VERSION=latest",
                        "CONTENTFUL_SPACE_ID=${env.CONTENTFUL_SPACE_ID}",
                        "CONTENTFUL_ACCESS_TOKEN=${env.CONTENTFUL_ACCESS_TOKEN}"
                    ]) {
                        sh '''
                            npm install
                            npm run build
                        '''
                    }
                    
                    archiveArtifacts artifacts: '.next/**, public/**, package.json, next.config.js', 
                                    onlyIfSuccessful: true
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
                    checkout scm
                    
                    withEnv([
                        "NODE_VERSION=latest",
                        "CONTENTFUL_SPACE_ID=${env.CONTENTFUL_SPACE_ID}",
                        "CONTENTFUL_ACCESS_TOKEN=${env.CONTENTFUL_ACCESS_TOKEN}",
                        "NETLIFY_SITE_ID=${env.NETLIFY_SITE_ID}",
                        "NETLIFY_AUTH_TOKEN=${env.NETLIFY_AUTH_TOKEN}"
                    ]) {
                        sh '''
                            npm install
                            npm install -g netlify-cli
                            npx netlify deploy --site $NETLIFY_SITE_ID --auth $NETLIFY_AUTH_TOKEN --prod --dir=.next
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
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