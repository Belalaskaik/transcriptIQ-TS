const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async function (event, context) {
  console.log(JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    console.log(`Event ID: ${record.eventID}`);
    console.log(`Event Name: ${record.eventName}`);
    console.log('DynamoDB Record:', JSON.stringify(record.dynamodb, null, 2));

    if (record.eventName === 'INSERT') {
      await handleInsert(record.dynamodb.NewImage);
    } else if (record.eventName === 'MODIFY') {
      await handleModify(record.dynamodb.NewImage, record.dynamodb.OldImage);
    } else if (record.eventName === 'REMOVE') {
      await handleRemove(record.dynamodb.OldImage);
    }
  }

  context.done(null, 'Successfully processed DynamoDB record');
};

async function handleInsert(newImage) {
  const message = `New comment added: ${JSON.stringify(newImage)}`;
  await sendNotification(message);
}

async function handleModify(newImage, oldImage) {
  const message = `Comment modified from ${JSON.stringify(oldImage)} to ${JSON.stringify(newImage)}`;
  await sendNotification(message);
}

async function handleRemove(oldImage) {
  const message = `Comment removed: ${JSON.stringify(oldImage)}`;
  await sendNotification(message);
}

async function sendNotification(message) {
  const params = {
    Message: message,
    TopicArn: process.env.SNS_TOPIC_ARN,
  };

  try {
    await sns.publish(params).promise();
    console.log('Notification sent:', message);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}