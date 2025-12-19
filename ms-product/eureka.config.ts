import { Eureka } from 'eureka-js-client';

export const eurekaClient = new Eureka({
  instance: {
    app: 'ms-products',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': 5001,
      '@enabled': true,
    },
    vipAddress: 'ms-products',
    statusPageUrl: 'http://localhost:5001/info',
    healthCheckUrl: 'http://localhost:5001/health',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8888, 
    servicePath: '/eureka/apps/',
  },
});
