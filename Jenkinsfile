pipeline {
    agent {  label  'master' }
   
    environment {
        def BULID_DATE =new Date().format("dd-MMM")
        def ARTIFACT_VERSION = "${BULID_DATE}-${BUILD_NUMBER}"
      }
    
    stages {
        
        stage('Defining environemnt speific variables') {
            steps{
                script{
                    APP_NAME = 'farms'

                    if (params.ENV_TYPE == 'dev') {
                        NG_COMMAND = "node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=dev"
                        RM_SLACK_CHANNEL = "rm-svc-dev-deployments"
                        RM_SLACK_TOKEN = "08db7e7a-e27d-4760-8295-06fb022bfe05"

                        AWS_CREDENTIALS = 'svc_ui_deploy_staging'
                        REGION = 'ap-south-1'
                        S3_BUCKET_DIST = 'dist/components/farms/'
                        S3_BUCKET_ARTIFACT_DIST = 'artifacts/farms/'
                        WORKING_DIR = 'farms'
                    } 


                    if (params.ENV_TYPE == 'staging') {
                        NG_COMMAND = "node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build"
                        RM_SLACK_CHANNEL = "rm-svc-staging-deployments"
                        RM_SLACK_TOKEN = "08db7e7a-e27d-4760-8295-06fb022bfe05"

                        AWS_CREDENTIALS = 'svc_ui_deploy_staging'
                        REGION = 'ap-south-1'
                        S3_BUCKET = 'occ-staging'
                        S3_BUCKET_DIST = 'dist/components/farms/'
                        S3_BUCKET_ARTIFACT_DIST = 'artifacts/farms/'
                        WORKING_DIR = 'farms'
                        CDN_DIST = 'E37R80ADENNX4X'
                    } 
                        if (params.ENV_TYPE == 'staging') {
                        NG_COMMAND = "node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build"
                        RM_SLACK_CHANNEL = "rm-svc-staging-deployments"
                        RM_SLACK_TOKEN = "08db7e7a-e27d-4760-8295-06fb022bfe05"

                        AWS_CREDENTIALS = 'svc_ui_deploy_staging'
                        REGION = 'ap-south-1'
                        S3_BUCKET = 'occ-staging'
                        S3_BUCKET_DIST = 'dist/components/farms/'
                        S3_BUCKET_ARTIFACT_DIST = 'artifacts/farms/'
                        WORKING_DIR = 'farms'
                        CDN_DIST = 'E37R80ADENNX4X'
                    } 
                    if (params.ENV_TYPE == 'production') {
                        NG_COMMAND = "node --max_old_space_size=10240 ./node_modules/@angular/cli/bin/ng build --configuration=production --output-hashing=all"
                        RM_SLACK_CHANNEL = "rm-svc-prod-deployments"
                        RM_SLACK_TOKEN = "6e752b96-5439-4206-8939-eb34b26f38dc"

                        AWS_CREDENTIALS = 'svc_ui_deploy'
                        REGION = 'ap-south-1'
                        S3_BUCKET = 'occ-prod-ui'
                        S3_BUCKET_DIST = 'dist/components/farms/'
                        S3_BUCKET_ARTIFACT_DIST = 'artifacts/farms/'
                        WORKING_DIR = 'farms'
                        CDN_DIST = 'E1NDOQZIIRHTXH'
                    } 
                    commitId = sh(script: "git rev-parse --short HEAD",returnStdout: true)
                    commitMsg = sh(script: """git rev-list --format=%B --max-count=1 ${commitId}""",returnStdout: true)
                }
            }
        }

        stage('Validate Branch Name') {
                when { expression { params.BRANCH_NAME != "master" } }
                steps {
                    script {
                        errorMessage = ""
                        branchName = params.BRANCH_NAME
                        print("Branch Name: ${BRANCH_NAME}")
                        if (!(branchName =~ '^(feature|release|hotfix|bugfix)/(RMO|RMFARMS|RMMUDRA|RM|ECOSYSTEM)-[0-9]+')) {
                            errorMessage = """\
                                ***********************************************************************************

                                Branch Name ${BRANCH_NAME} doesn't follow the naming convention.

                                If you are unsure what the error means, please check the User Guide
                                https://reshamandi.atlassian.net/wiki/spaces/NINJAS/pages/989757441/Git+Branch+and+Commit+Message+Naming+Convention

                                ***********************************************************************************
                            """.stripIndent()
                            currentBuild.result = 'FAILURE'
                            error(errorMessage)
                        }
                    }
                }
        }

        stage('Checkout') {
            steps {
                echo "Checking out $BRANCH_NAME"
                checkout([$class: 'GitSCM', branches: [[name: '${BRANCH_NAME}']], extensions: [], userRemoteConfigs: [[credentialsId: 'svc_acct_github', url: 'https://github.com/reshamandi/reshafarms-ui.git']]])
                echo "Checkout is completed" 
            }
        }
        
        stage('ng Build UI Artifact') {    
            steps{
                script{
                    if(params.BUILD_FLAG){ 
                        echo "Building ${BRANCH_NAME} branch"
                        echo "Installing node_modules"
                        sh "npm install --verbose"
                        echo "Successfully installed node_modules"

                        echo "Strating ng build"
                        sh "${NG_COMMAND}"
                        sh "zip -r farms-${ARTIFACT_VERSION}.zip farms/"
                        echo "ng build is completed"
                    }
                }
            }
        }

    
        
        stage('Deploy UI service') {
            steps{
                script{
                    if(params.DEPLOY_FLAG){ 
                        echo "Deploying ${APP_NAME} service"

                        if (params.ENV_TYPE == 'dev'){
                            withAWS(credentials: AWS_CREDENTIALS, region: REGION) {
                                s3Delete(bucket: 'occ-ui-dev', path: S3_BUCKET_DIST)
                                s3Upload(bucket: 'occ-ui-dev', path:S3_BUCKET_DIST, workingDir:WORKING_DIR, includePathPattern:'**/*')
                                s3Upload(bucket:'occ-ui-dev', path: S3_BUCKET_ARTIFACT_DIST, file:"farms-${ARTIFACT_VERSION}.zip")
                                cfInvalidate(distribution: 'E3LNKZKGJFB40K', paths:['/*'], waitForCompletion: true)



                            }
                        }

                        if (params.ENV_TYPE == 'staging' || params.ENV_TYPE == 'production'){
                            withAWS(credentials: AWS_CREDENTIALS, region: REGION) {
                                s3Delete(bucket: S3_BUCKET, path: S3_BUCKET_DIST)
                                s3Upload(bucket:S3_BUCKET, path:S3_BUCKET_DIST, workingDir:WORKING_DIR, includePathPattern:'**/*')
                                s3Upload(bucket:S3_BUCKET, path:S3_BUCKET_ARTIFACT_DIST, file:"farms-${ARTIFACT_VERSION}.zip")
                                cfInvalidate(distribution: CDN_DIST, paths:['/*'], waitForCompletion: true)
                            }
                        }    
                    
                        echo "${APP_NAME} Service is successfully deployed"


                        }
                }
            }
        }    
    }
    post { 
           always { 
               emailext body: '''$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS:
               Check console output at $BUILD_URL to view the results.''', subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', to: '${BUILD_USER_EMAIL}'
            }

            post { 
           always { 
               emailext body: '''$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS:
               Check console output at $BUILD_URL to view the results.''', subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', to: '${BUILD_USER_EMAIL}'
            }
            post { 
           always { 
               emailext body: '''$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS:
               Check console output at $BUILD_URL to view the results.''', subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', to: '${BUILD_USER_EMAIL}'
            }
 
            success {
               slackSend channel: "${RM_SLACK_CHANNEL}", color: 'good', message: """
               *Service Name*: ${env.JOB_NAME}\n*Branch Name*: ${env.BRANCH_NAME}\n*Started by*: ${env.BUILD_USER_EMAIL}\n*Status*: "Success"\n*commit Id and Message*: ${commitMsg}\n*Build Job*: ${env.BUILD_URL}""", 
               tokenCredentialId: "${RM_SLACK_TOKEN}"
            }
     
            failure {
               slackSend channel: "${RM_SLACK_CHANNEL}", color: 'danger', message:"""
               *Service Name*: ${env.JOB_NAME}\n*Branch Name*: ${env.BRANCH_NAME}\n*Started by*: ${env.BUILD_USER_EMAIL}\n*Status*: "Failed"\n*Commit Id and Message*: ${commitMsg}\n*Build Job*: ${env.BUILD_URL}""",
               tokenCredentialId: "${RM_SLACK_TOKEN}"
            }
   }   
}    
