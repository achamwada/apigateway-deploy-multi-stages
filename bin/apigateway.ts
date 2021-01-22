#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import BaseApigatewayStack from '../lib/base-apigateway-stack';
import UsersResourceApi from '../lib/users-resource-api';

const app = new cdk.App();
// this is deployed separately possibly a longtime before the user resource was ready
new BaseApigatewayStack(app, 'ApigatewayStack');

// here only change the stage name to deploy to a new stage
new UsersResourceApi(app, 'UsersResourceApiStack', {
  deploymentStage: {
    stageName: 'dev',
    variables: {
      enablePayment: 'true',
      debug: 'false',
      alexEnabled: 'true',
    },
  },
});
