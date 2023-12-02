const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = async (event) => {
    console.log(event)
    const bucketName = 'users-data-csv';
    let responseMessage = 'File uploaded successfully';
    let responseCode = 200;
    
    const body = JSON.parse(event.body);

    
    const accessTokenJWT = body.accessToken;
        const params = {
        AccessToken: accessTokenJWT,
    }
    
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
    	region: "ap-southeast-1",
    });
    
    const cognitoResponse = await cognitoIdentityServiceProvider.getUser(params).promise();

    
    const attribute = cognitoResponse.UserAttributes.find(
        (attribute) => attribute.Name === "custom: role");

    const initiatorRole = attribute ? attribute.Value : undefined;
    
        
    if (body.role !== "super_admin" && initiatorRole !=="super_admin") {
        return {
            statusCode: 403,
            body: "Forbidden"
        }
    }

    try {
        console.log("Received file:", body.filename);
        const fileContent = Buffer.from(body.file, 'base64');

        const s3Params = {
            Bucket: bucketName,
            Key: body.filename,
            Body: fileContent
        };

        await S3.putObject(s3Params).promise();

    } catch (err) {
        responseMessage = err.message;
        responseCode = 500;
    }

    const response = {
        statusCode: responseCode,
        body: JSON.stringify({ message: responseMessage }),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        }
    };
    return response;
};
