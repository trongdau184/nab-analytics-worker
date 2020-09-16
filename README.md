# Analytics Worker with NodeJS

Analytics Service execute marketing reports which might take a long time due to the given long date ranges.

**High Level Architecture**

![High Level Architecture diagram](https://github.com/trongdau184/nab-analytics-service/blob/master/High-level-architect-diagram.png?raw=true)

The micro-services architecture will be applied for E-Commerce system, in this architecture, each features/module are divided into small and independent services which will handle a piece of business module or perform specific tasks. Since each service is independent, they communicate together via the HTTP Request (REST API) or Message Queue (Send/Receive or Public/Subscribe). 
The most benefit of micro-services architecture is ease of scaling, since the services are divided into micro, we easily scale up a particular service based on the number of incoming requests to it.
* Internal Services:
    * Product Service: provide the CRUD APIs for product
    * Identity Service: login/authenticate user and issue a token (to keep it simple for demonstrating purpose, the current implementation of login/authenticate is currently put in Product Service)
    * Analytics Service: record filters on the products, view on the products then aggregate the data to provide marketing reports such as Top Searching Products, Top Searching Brands, Top Viewed Products in the specific date ranges.
    * Analytics Worker: execute marketing reports which might take a long time due to the given long date ranges. For ex: the user would to see top searching products in 1 month Report which might take long time to calculate due to the numbers of searching records in 1 month.
* Third parties:
    * Amazon SQS:  Message Queue service
    * Amazon S3: Storage service to store the product images
    * MongoDB cluster: Database cluster.
* Deployment tool:
    * Docker: packaging the container to image
    * Kubernetes: Container Management. The services is deployed to Worker Nodes in the Kubernetes cluster
    * Amazon Elastic Kubernetes Service (Amazon EKS): Deploy Kubernetes cluster to Amazon Web Service.

**Sequence diagrams**
* Generate Normal Reports sequence diagram (top searching products, top searching brands, top viewed products report)

![Generate Normal Reports](https://github.com/trongdau184/nab-analytics-service/blob/master/Normal-reports-diagram.png?raw=true)
    * If the query date range is not over 30 days (it might not take long to time to generate), the Analytic Service will aggregate and issue report data by itself.

* Generate Long Time Reports (which query date range is over 30 days) sequence diagram

![Generate Normal Reports](https://github.com/trongdau184/nab-analytics-service/blob/master/Long-time-report-diagram.png?raw=true)
    * If the query date range is over 30 days (it might take long to time to generate), the Analytic Service doesn't issue report data immediately, instead of that, it sends a generating report message to the Amazon SQS. The message contains the type of report (top searching products, top searching brands, top viewed product) and query date range.
    * The Analytics Worker receives the message, then based on the report type, it aggregates the data from MongoDB and returns the report data to Client (can be done via WebSocket which is not described in the diagram)

**Features**
* Generate top searching products in a given date range Report
* Generate top searching brands in a given date range Report
* Generate top viewed products in a given date range Report

**Code folder structure**
```
├── app
│   ├── common
│   ├── config
│   ├── analytics
├── configurations
│   ├── config.dev.json
│   ├── config.test.json
│   └── index.ts
├── core
│   ├── common
│   │   ├── Constants.ts
│   │   └── Validators.ts
│   ├── controller
│   │   └── IBaseController.ts
│   ├── repositories
│   │   ├── BaseRepository.ts
│   │   ├── DataAccess.ts
│   │   ├── IBaseDocument.ts
│   │   ├── IBaseRepository.ts
│   │   └── SearchQueryConverter.ts
│   ├── services
│   │   ├── BaseService.ts
│   │   └── IBaseService.ts
│   └── utils
├── index.ts
├── plugins
└── test
```
* Project structure followed "Folder by feature" structure which organizing projects into several folders with each folder representing a single feature.
* Core folder can be separated as a npm module which is used by the services.

**Software development principles, pattern & practices**
* 3 Layers Pattern: Controller - Service - Repository
* Inversion of control: make components loose coupling
* Generic Method
* SOLID, KISS

**Frameworks & Libraries**
* inversify: Inversion of control (IOC) container.
* mongoose: ODM for MongoDB 
* aws-sdk: Amazon SDK
* sqs-consumer: polling message from Amazon SQS
* lodash: JavaScript utility library
* moment: JavaScript Date Time library
* nconf: define configuration file for each environment
* jest: unit test framework

**Message Model**
* Report Message

| Field     | Data Type | Description | 
| ----------| ----------| ------------|
| type      | string    | report type (top searching products or top searching brands or top viewed products |
| from      | date      | from date |
| to        | date      | to date   |
| top       | date      | Numbers of items to return |

**Installation**
```bash
npm install
```
**Run**

* Start the service:
```bash
npm start
```

* Test:
```bash
npm test
```
