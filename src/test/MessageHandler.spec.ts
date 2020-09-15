import IMessageHandler from "../app/analytics/IMessageHandler";
import SearchProductRepository from "../app/analytics/SearchProductRepository";
import ViewProductRepository from "../app/analytics/ViewProductRepository";

import iocContainer from "../app/config/IocConfig";
import TYPES from "../app/common/Types";

describe("Message Handler", () => {
  beforeEach(() => {
    
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Get top search products", async () => {
  
    const mockFunc = jest.fn();
    SearchProductRepository.prototype.getTopSearchProducts = mockFunc;
    mockFunc.mockReturnValue({
        items: [
            {
                searchText: "A10",
                searchTimes: 10
            },
            {
                searchText: "A20",
                searchTimes: 8
            }
        ]
    });

    let messageHandler: IMessageHandler = iocContainer.get<IMessageHandler>(TYPES.IMessageHandler);
    let message = {
        Body: JSON.stringify({
            type: "topSearchProducts",
            from: "2020-09-01T00:00:00.000Z",
            to: "2020-09-15T23:59:59.999Z",
            top: 10
        })
    }
    let result = await messageHandler.handleMessage(message);
    
    expect(mockFunc).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  test("Get top search brands", async () => {
  
    const mockFunc = jest.fn();
    SearchProductRepository.prototype.getTopSearchBrands = mockFunc;
    mockFunc.mockReturnValue({
        items: [
            {
                brand: "Samsung",
                searchTimes: 10
            },
            {
                brand: "Apple",
                searchTimes: 8
            }
        ]
    });

    let messageHandler: IMessageHandler = iocContainer.get<IMessageHandler>(TYPES.IMessageHandler);
    let message = {
        Body: JSON.stringify({
            type: "topSearchBrands",
            from: "2020-09-01T00:00:00.000Z",
            to: "2020-09-15T23:59:59.999Z",
            top: 10
        })
    }
    let result = await messageHandler.handleMessage(message);
    
    expect(mockFunc).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  test("Get top view products", async () => {
  
    const mockFunc = jest.fn();
    ViewProductRepository.prototype.getTopViewProducts = mockFunc;
    mockFunc.mockReturnValue({
        items: [
            {
                name: "A10",
                viewTimes: 100
            },
            {
                name: "20",
                viewTimes: 80
            }
        ]
    });

    let messageHandler: IMessageHandler = iocContainer.get<IMessageHandler>(TYPES.IMessageHandler);
    let message = {
        Body: JSON.stringify({
            type: "topViewProducts",
            from: "2020-09-01T00:00:00.000Z",
            to: "2020-09-15T23:59:59.999Z",
            top: 10
        })
    }
    let result = await messageHandler.handleMessage(message);
    
    expect(mockFunc).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });
});