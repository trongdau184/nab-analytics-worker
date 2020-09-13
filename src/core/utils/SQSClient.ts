import { SQS } from 'aws-sdk';
import * as _ from 'lodash';
const { Consumer } = require('sqs-consumer');
import * as Configs from "../../configurations";

export default class SQSClient {
    public static sendMessage(queueURL: string, message: Object, options?: any) {
        let awsParam = SQSClient.buildAWSParams();
        let sqs = new SQS(awsParam);
        let params = {
            MessageBody: JSON.stringify(message),
            QueueUrl: queueURL
        };
        if (options) {
            params = _.assign(params, options);
        }
        let sendMessagePromise = sqs.sendMessage(params).promise();
        sendMessagePromise.then((response) => {
            console.log(`Send message successfully ${response.MessageId}`);
        }).catch((err) => {
            console.log(`Send Message Failed ${err}`);
        });
    }

    public static pollMessage(queueURL: string, handleMessage, options?: any) {
        let awsParam = SQSClient.buildAWSParams();
        let sqs = new SQS(awsParam);
        let messageConsumer = Consumer.create({
            queueUrl: queueURL,
            handleMessage: handleMessage,
            sqs: sqs
        });

        return messageConsumer;
    }

    private static buildAWSParams() {
        let awsConfigs: Configs.IAWSConfiguration = Configs.getAWSConfigs();
        let awsParam = {
            region: awsConfigs.region,
            accessKeyId: awsConfigs.accessKeyId,
            secretAccessKey: awsConfigs.secretAccessKey
        };
        return awsParam;
    }
}