import { Eureka } from 'eureka-js-client';

export const eurekaClient = new Eureka({
  instance: {
    app: 'ms-command',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': 5002,
      '@enabled': true,
    },
    vipAddress: 'ms-command',
    statusPageUrl: 'http://localhost:5002/info',
    healthCheckUrl: 'http://localhost:5002/health',
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
