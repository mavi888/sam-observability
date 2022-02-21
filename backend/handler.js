"use strict";

const AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();

const { metricScope } = require("aws-embedded-metrics");

const TABLE_NAME = process.env.TABLE_NAME;

exports.saveHello = async (event) => {

  const random = Math.random();
  console.log(random)

  if (random > 0.5) {
    const err = new Error('Im an error!')
    throw err
  }

    const name = event.queryStringParameters.name;

    const item = {
      name: name,
      date: Date.now(),
    };

    console.log(item);
    const savedItem = await saveItem(item);

    return getResponse(savedItem);
};

exports.getHello = metricScope(metrics =>
  async (event) => {
    metrics.setNamespace('gretter')

    const name = event.queryStringParameters.name;

    try {
        const item = await getItem(name);
    
        if (item.date) {
            const d = new Date(item.date);

            const message = `Was greeted on ${d.getDate()}/${
                d.getMonth() + 1
            }/${d.getFullYear()}`;

            metrics.putDimensions({Service: "GetName"});
            metrics.putMetric("GetName", 1, "put");
            metrics.setProperty("Name", name);
            metrics.setProperty("Result", item);

            return getResponse(message);
        }
    } catch (e) {
        console.log(e);

        const message = "Nobody was greeted with that name";
        
        metrics.putDimensions({Service: "GetName"});
        metrics.putMetric("NotFound", 1, "notFound");
        metrics.setProperty("Name", name);

        return getResponse(message);
    }
  }
);

async function getItem(name) {
  console.log("getItem");

  const params = {
    Key: {
      name: name,
    },
    TableName: TABLE_NAME,
  };

  console.log(params);

  return dynamo
    .get(params)
    .promise()
    .then((result) => {
      console.log(result);
      return result.Item;
    });
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

function getResponse(message) {
  return {
      statusCode: 200,
      body: JSON.stringify(message),
    };
}