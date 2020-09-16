import * as Server from "./server";
import * as Configs from "./configurations";
import DataAccess = require("./core/repositories/DataAccess");
import SQSClient from "./core/utils/SQSClient";
import iocContainer from "./app/config/IocConfig";
import IMessageHandler from "./app/analytics/IMessageHandler";
import TYPES from "./app/common/Types";
import {QUEUE_URLS} from "./app/common/Constants"

console.log(`Running environment ${process.env.NODE_ENV || "dev"}`);

// Catch unhandling unexpected exceptions
process.on("uncaughtException", (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on("unhandledRejection", (reason: any) => {
  console.error(`unhandledRejection ${reason}`);
});

// Define async start function
const start = async () => {
  try {
    // Init Database
    const dbConfigs = Configs.getDatabaseConfig();
    await DataAccess.connect(dbConfigs);

    // Starting Application Server
    const serverConfigs = Configs.getServerConfigs();

    const queueConfigs = Configs.getQueueConfigs();

    // Start polling message from SQS
    let handleMessage = async (message) => {
      console.log(`Message ${JSON.stringify(message)}`);
    }

    const messageHandler = iocContainer.get<IMessageHandler>(TYPES.IMessageHandler);
    let analyticsQueueUrl = queueConfigs[QUEUE_URLS.ANALYTICS_QUEUE];
    let messageConsumer = SQSClient.pollMessage(analyticsQueueUrl, messageHandler.handleMessage.bind(messageHandler));
    messageConsumer.on('error', (err) => {
      console.error(err.message);
    });
     
    messageConsumer.on('processing_error', (err) => {
      console.error(err.message);
    });
     
    messageConsumer.on('timeout_error', (err) => {
     console.error(err.message);
    });

    messageConsumer.start();

    console.log(`Analytics Worker started successfully`);
  } catch (err) {
    console.error("Error starting server: ", err.message);
    throw err;
  }
};

// Start the server
start();
