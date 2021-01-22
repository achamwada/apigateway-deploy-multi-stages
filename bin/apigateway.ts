#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApigatewayStack } from '../lib/apigateway-stack';

const app = new cdk.App();
new ApigatewayStack(app, 'ApigatewayStack');
