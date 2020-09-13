import "reflect-metadata";
import { injectable, inject } from "inversify";
import TYPES from "../common/Types";
import ISearchProductRepository from "./ISearchProductRepository";
import IViewProductRepository from "./IViewProductRepository";
import IAnalyticsService from "./IAnalyticsService";
import DateTimeHelper from "../../core/utils/DateTimeHelper";
import SQSClient from "../../core/utils/SQSClient";

@injectable()
export default class AnalyticsService implements IAnalyticsService {

    private searchProductRepository: ISearchProductRepository;
    private viewProductRepository: IViewProductRepository;

    constructor(@inject(TYPES.ISearchProductRepository) searchProductRepository: ISearchProductRepository,
        @inject(TYPES.IViewProductRepository) viewProductRepository: IViewProductRepository,) {
        this.searchProductRepository = searchProductRepository;
        this.viewProductRepository = viewProductRepository;
    }
    
    public async getTopSearchProducts(from: Date, to: Date, top: number) {
        from = DateTimeHelper.getStartOfDay(from);
        to = DateTimeHelper.getEndOfDay(to);
        let result = await this.searchProductRepository.getTopSearchProducts(from, to, top);
        return {items: result};
    }

    public async getTopSearchBrands(from: Date, to: Date, top: number) {
        from = DateTimeHelper.getStartOfDay(from);
        to = DateTimeHelper.getEndOfDay(to);
        let result = await this.searchProductRepository.getTopSearchBrands(from, to, top);
        return {items: result};
    }

    public async getTopViewProducts(from: Date, to: Date, top: number) {
        from = DateTimeHelper.getStartOfDay(from);
        to = DateTimeHelper.getEndOfDay(to);
        let result = await this.viewProductRepository.getTopViewProducts(from, to, top);
        return {item: result};
    }
}