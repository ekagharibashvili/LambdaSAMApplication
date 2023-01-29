// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
var AWS = require("aws-sdk");
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  try {
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "hello world",
        // location: ret.data.trim()
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
  console.log(event);
  var s3ObjectKey = event.Records[0].s3.object.key;
  var s3TimeStamp = event.Records[0].eventTime;

  var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

  var params = {
    TableName: "LambdaTestDeploy-HelloWorldFunctionTable-JJIWJWTN4F6I",
    Item: {
      id: { S: s3ObjectKey },
      timestamp: { S: s3TimeStamp },
    },
  };

  // Call dynamodb to add the item to the table

  await ddb
    .putItem(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    })
    .promise();

  return response;
};
