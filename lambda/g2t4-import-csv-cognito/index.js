const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Cognito = new AWS.CognitoIdentityServiceProvider();

const USER_POOL_ID = 'ap-southeast-1_crimtf1ce';

function formatBirthdate(birthdate) {
    const [day, month, year] = birthdate.split('/');
    let formattedYear;
    if (year.length === 2) {
        if (parseInt(year) <= 21) {
            formattedYear = '20' + year;
        } else {
            formattedYear = '19' + year;
        }
    } else {
        formattedYear = year;
    }
    return `${day}/${month}/${formattedYear}`;
}

function detectDelimiter(line) {
    const commaCount = (line.match(/,/g) || []).length;
    const semicolonCount = (line.match(/;/g) || []).length;

    return commaCount > semicolonCount ? ',' : ';';
}

exports.handler = async (event) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    // Get the uploaded CSV file from S3
    const fileData = await S3.getObject({ Bucket: bucket, Key: key }).promise();

    const lines = fileData.Body.toString().split('\n');
    const delimiter = detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter);
    const users = lines.slice(1).map(line => {
        const values = line.split(delimiter);
        let user = {};
        headers.forEach((header, index) => {
            if (values[index] !== undefined) { // Check if the value is not undefined
                user[header.trim()] = values[index].trim();
            } else {
                user[header.trim()] = ""; // Or handle the missing value appropriately
            }
        });
        return user;
    });


   for (let user of users) {
    // Assuming the CSV headers are correctly mapped to the user object fields
    const { Username, email, first_name, last_name, birthdate } = user;
    try {
        const formattedDate = formatBirthdate(birthdate);
        const response = await Cognito.adminCreateUser({
            UserPoolId: USER_POOL_ID,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'given_name', Value: first_name },
                { Name: 'family_name', Value: last_name },
                { Name: 'birthdate', Value: formattedDate },
                { Name: 'email_verified', Value: 'true'},
                { Name: 'custom:role', Value: 'user'}
            ],
            DesiredDeliveryMediums: ['EMAIL']
        }).promise();

        console.log(`User ${Username} created successfully: ${JSON.stringify(response)}`);
    } catch (error) {
        console.error(`Error registering user ${Username}:`, error.message);
    }
}

    return {
        statusCode: 200,
        body: 'Users processed successfully!'
    };
};
