from diagrams import Diagram, Cluster
from diagrams.aws.compute import Lambda
from diagrams.aws.network import APIGateway
from diagrams.aws.security import Cognito
from diagrams.aws.storage import S3

with Diagram("G2T4 AWS Lambda View with Gateway", show=False, direction="TB", outformat="png", filename="api_diagram"):
    api_gateway = APIGateway("API Gateway")

    with Cluster("G2T4 AWS Lambda View"):
        updatePhoneNo = Lambda("updatePhoneNo")
        confirmPhoneCode = Lambda("confirmPhoneCode")
        retrieveUsers = Lambda("retrieveUsers")
        validateMfa = Lambda("validate-mfa")
        deleteUser = Lambda("delete-user")
        getQrCode = Lambda("get-qr-code")
        updateRole = Lambda("update-Role")
        searchEmailDob = Lambda("search-email-dob")
        createApiKey = Lambda("create-api-key")
        verifyToken = Lambda("verifytoken") #exclude from connecting to cognito
        importCsvCognito = Lambda("import-csv-cognito")
        store = Lambda("store-csv")
        validateAdmin = Lambda("validateAdmin")
        authUserProfile = Lambda("auth_userprofile") #exclude from connecting to cognito
        authToken = Lambda("auth_token") #exclude from connecting to cognito
        userCsvBucket = S3("user-csv-bucket")

        cognito = Cognito("g2t4-bank-userpool")    

    functions = [
        updatePhoneNo, confirmPhoneCode, retrieveUsers, validateMfa, deleteUser,
        getQrCode, updateRole, searchEmailDob, createApiKey, validateAdmin
    ]

    for function in functions:
        api_gateway >> function >> cognito
        
    
    api_gateway >> verifyToken
    api_gateway >> authUserProfile
    api_gateway >> authToken
    api_gateway >> store >> userCsvBucket >> importCsvCognito >> cognito