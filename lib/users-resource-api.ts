import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { RestApi, Deployment, Stage } from '@aws-cdk/aws-apigateway';
import * as ssm from '@aws-cdk/aws-ssm';

interface UsersResourceApiProps extends StackProps {
  deploymentStage: {
    stageName: string;
    variables: {
      [key: string]: string;
    };
  };
}
export default class UsersResourceApi extends Stack {
  constructor(scope: Construct, id: string, props: UsersResourceApiProps) {
    super(scope, id, props);
    const restApiId = ssm.StringParameter.fromStringParameterName(
      this,
      'retrieve-rest-api-id',
      '/infra/apigateway/base-apigateway-id',
    ).stringValue;

    const rootResourceId = ssm.StringParameter.fromStringParameterName(
      this,
      'retrieve-rest-api-root-resource-id',
      '/infra/apigateway/base-apigateway-root-resource-id',
    ).stringValue;

    const baseGateway = RestApi.fromRestApiAttributes(
      this,
      'base-api-gateway-import',
      {
        restApiId,
        rootResourceId,
      },
    );

    const method = baseGateway.root.addResource('users').addMethod('GET');
    const deployment =
      baseGateway.latestDeployment ??
      new Deployment(this, 'api-gateway-deployment', {
        api: baseGateway,
        retainDeployments: false,
      });
    deployment.node.addDependency(method);
    let deploymentStages = [
      { stageName: 'dev', variables: {} },
      { stageName: 'int', variables: {} },
      { stageName: 'qa', variables: {} },
      { stageName: 'prod', variables: {} },
    ];
    deploymentStages = deploymentStages.map(({ stageName, variables }) => {
      if (stageName === props.deploymentStage.stageName) {
        return {
          stageName: props.deploymentStage.stageName,
          variables: props.deploymentStage.variables,
        };
      }
      return {
        stageName,
        variables,
      };
    });
    deploymentStages.forEach(({ stageName, variables }) => {
      new Stage(this, `${stageName}_stage`, {
        deployment,
        stageName,
        variables,
      });
    });
  }
}
