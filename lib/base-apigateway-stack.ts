import * as cdk from '@aws-cdk/core';
import { RestApi, EndpointType } from '@aws-cdk/aws-apigateway';
import { StringParameter } from '@aws-cdk/aws-ssm';
export default class BaseApigatewayStack extends cdk.Stack {
  api: RestApi;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.api = new RestApi(this, 'apigateway-stack', {
      deploy: false,
      endpointTypes: [EndpointType.REGIONAL],
    });

    this.api.root.addMethod('POST');
    new StringParameter(this, 'ssm-path-for-api-gateway-id', {
      parameterName: '/infra/apigateway/base-apigateway-id',
      stringValue: this.api.restApiId,
    });

    new StringParameter(this, 'ssm-path-for-api-gateway-root-resource-id', {
      parameterName: '/infra/apigateway/base-apigateway-root-resource-id',
      stringValue: this.api.restApiRootResourceId,
    });
  }
}
