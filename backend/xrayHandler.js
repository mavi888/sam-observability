const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
let dynamo = new AWS.DynamoDB.DocumentClient();

const axios = require('axios')

const TABLE_NAME = process.env.TABLE_NAME;
const THIRD_PARTY_URL = process.env.THIRD_PARTY_URL;

exports.sendTo3rdParty = async(event) => {
    console.log('sendTo3rdParty called')

    const segment = AWSXRay.getSegment();

    const name = event.queryStringParameters.name;

    console.log('start subsegment sendTo3rdParty')        
    const subsegment3rdParty = segment.addNewSubsegment('sendTo3rdParty');
    subsegment3rdParty.addAnnotation("name", name);
    let statusCode;
    let responseMessage;
    try {
        console.log('call third party')
        await axios.get(THIRD_PARTY_URL);
        statusCode = 200;
        responseMessage = 'SendSuccesfully'        
    } catch(e) {
        console.log('catch')
        statusCode = 500;
        responseMessage = 'Error'
        subsegment3rdParty.addError('error', 'this is an error')
    } finally {
        console.log('finally')
        subsegment3rdParty.addMetadata("responseStatus", statusCode)
        subsegment3rdParty.close();
        console.log('subsegment closed')
    }

    if (statusCode === 200) {
        console.log('save to DynamoDB')
        console.log('start subsegment saveInDynamoDB')        
        const saveInDynamoDB = segment.addNewSubsegment('saveInDynamoDB');
        saveInDynamoDB.addAnnotation("name", name);

        const item = {
            name: name,
            date: Date.now(),
          };
      
        console.log(item);
        await saveItem(item);

        saveInDynamoDB.addMetadata("itemDetails", item)
        saveInDynamoDB.close();
        console.log('subsegment closed')
    }
 
    return {
        statusCode: statusCode,
        body: responseMessage,
    };
}

async function saveItem(item) {
    const params = {
        TableName: TABLE_NAME,
        Item: item,
    };

    console.log(params);

    return dynamo
        .put(params)
        .promise()
        .then(() => {
            return item;
        });
}