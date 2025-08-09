const express = require('express');
const proxy = require('express-http-proxy');
const config = require('../config/config.json');
const proxyOptions  = require('../utils/proxyOptions'); 

const Roueter = express.Router();

Roueter.use("/v1/user", proxy(config.services.identity,{
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from Identity service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },

}));