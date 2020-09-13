export default interface IAnalyticsService {
    getTopSearchProducts(from: Date, to: Date, top: number);
    getTopSearchBrands(from: Date, to: Date, top: number);
    getTopViewProducts(from: Date, to: Date, top: number);
}