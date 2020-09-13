import "reflect-metadata";
import { injectable, inject } from "inversify";
import TYPES from "../common/Types";
import IAnalyticsService from "./IAnalyticsService";
import { MESSAGE_TYPES } from "../common/Constants";
import IMessageHandler from "./IMessageHandler";

@injectable()
export default class MessageHandler implements IMessageHandler {

    private service: IAnalyticsService;

    constructor(@inject(TYPES.IAnalyticsService) service: IAnalyticsService) {
        this.service = service;
    }

    public async handleMessage(message: any) {
        console.log(`Handle message ${JSON.stringify(message)}`);
        let messageBody = JSON.parse(message.Body);
        let messageType = messageBody.type;
        let result = null;
        switch(messageType) {
            case MESSAGE_TYPES.TOP_SEARCH_PRODUCTS:
                result = await this.getTopSearchProducts(messageBody);
                break;
            case MESSAGE_TYPES.TOP_SEARCH_BRANDS:
                result = await this.getTopSearchBrands(messageBody);
                break;
            case MESSAGE_TYPES.TOP_VIEW_PRODUCTS:
                result = await this.getTopViewProducts(messageBody);
                break;
            default:
                console.log("Invalid Message Type");
                break;
        }
        console.log(`Handle message result: ${JSON.stringify(result)}`);
        return result;
    }

    private getTopSearchProducts(message) {
        let from = new Date(message.from.toString());
        let to = new Date(message.to.toString());
        let top = parseInt(message.top.toString());
        return this.service.getTopSearchProducts(from, to, top);
    }

    private getTopSearchBrands(message) {
        let from = new Date(message.from.toString());
        let to = new Date(message.to.toString());
        let top = parseInt(message.top.toString());
        return this.service.getTopSearchBrands(from, to, top);
    }

    private getTopViewProducts(message) {
        let from = new Date(message.from.toString());
        let to = new Date(message.to.toString());
        let top = parseInt(message.top.toString());
        return this.service.getTopViewProducts(from, to, top);
    }
}