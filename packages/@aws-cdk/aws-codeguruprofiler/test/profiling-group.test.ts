import { expect } from '@aws-cdk/assert';
import { AccountRootPrincipal, Role } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { ProfilingGroup } from '../lib/profiling-group';

// tslint:disable:object-literal-key-quotes

describe('profiling group', () => {

  test('attach read permission to Profiling group via fromProfilingGroupArn', () => {
    const stack = new Stack();
    const profilingGroup = ProfilingGroup.fromProfilingGroupArn(stack, 'MyProfilingGroup', 'arn:aws:codeguru-profiler:us-east-1:1234567890:profilingGroup/MyAwesomeProfilingGroup');
    const readAppRole = new Role(stack, 'ReadAppRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    profilingGroup.grantRead(readAppRole);

    expect(stack).toMatch({
      'Resources': {
        'ReadAppRole52FE6317': {
          'Type': 'AWS::IAM::Role',
          'Properties': {
            'AssumeRolePolicyDocument': {
              'Statement': [
                {
                  'Action': 'sts:AssumeRole',
                  'Effect': 'Allow',
                  'Principal': {
                    'AWS': {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            'Ref': 'AWS::Partition',
                          },
                          ':iam::',
                          {
                            'Ref': 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                },
              ],
              'Version': '2012-10-17',
            },
          },
        },
        'ReadAppRoleDefaultPolicy4BB8955C': {
          'Type': 'AWS::IAM::Policy',
          'Properties': {
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': [
                    'codeguru-profiler:GetProfile',
                    'codeguru-profiler:DescribeProfilingGroup',
                  ],
                  'Effect': 'Allow',
                  'Resource': 'arn:aws:codeguru-profiler:us-east-1:1234567890:profilingGroup/MyAwesomeProfilingGroup',
                },
              ],
              'Version': '2012-10-17',
            },
            'PolicyName': 'ReadAppRoleDefaultPolicy4BB8955C',
            'Roles': [
              {
                'Ref': 'ReadAppRole52FE6317',
              },
            ],
          },
        },
      },
    });
  });

  test('attach publish permission to Profiling group via fromProfilingGroupName', () => {
    const stack = new Stack();
    const profilingGroup = ProfilingGroup.fromProfilingGroupName(stack, 'MyProfilingGroup', 'MyAwesomeProfilingGroup');
    const publishAppRole = new Role(stack, 'PublishAppRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    profilingGroup.grantPublish(publishAppRole);

    expect(stack).toMatch({
      'Resources': {
        'PublishAppRole9FEBD682': {
          'Type': 'AWS::IAM::Role',
          'Properties': {
            'AssumeRolePolicyDocument': {
              'Statement': [
                {
                  'Action': 'sts:AssumeRole',
                  'Effect': 'Allow',
                  'Principal': {
                    'AWS': {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            'Ref': 'AWS::Partition',
                          },
                          ':iam::',
                          {
                            'Ref': 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                },
              ],
              'Version': '2012-10-17',
            },
          },
        },
        'PublishAppRoleDefaultPolicyCA1E15C3': {
          'Type': 'AWS::IAM::Policy',
          'Properties': {
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': [
                    'codeguru-profiler:ConfigureAgent',
                    'codeguru-profiler:PostAgentProfile',
                  ],
                  'Effect': 'Allow',
                  'Resource': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          'Ref': 'AWS::Partition',
                        },
                        ':codeguru-profiler:',
                        {
                          'Ref': 'AWS::Region',
                        },
                        ':',
                        {
                          'Ref': 'AWS::AccountId',
                        },
                        ':profilingGroup/MyAwesomeProfilingGroup',
                      ],
                    ],
                  },
                },
              ],
              'Version': '2012-10-17',
            },
            'PolicyName': 'PublishAppRoleDefaultPolicyCA1E15C3',
            'Roles': [
              {
                'Ref': 'PublishAppRole9FEBD682',
              },
            ],
          },
        },
      },
    });
  });

  test('default profiling group', () => {
    const stack = new Stack();
    new ProfilingGroup(stack, 'MyProfilingGroup', {
      profilingGroupName: 'MyAwesomeProfilingGroup',
    });

    expect(stack).toMatch({
      'Resources': {
        'MyProfilingGroup829F0507': {
          'Type': 'AWS::CodeGuruProfiler::ProfilingGroup',
          'Properties': {
            'ProfilingGroupName': 'MyAwesomeProfilingGroup',
          },
        },
      },
    });
  });

  test('default profiling group without name', () => {
    const stack = new Stack();
    new ProfilingGroup(stack, 'MyProfilingGroup', {
    });

    expect(stack).toMatch({
      'Resources': {
        'MyProfilingGroup829F0507': {
          'Type': 'AWS::CodeGuruProfiler::ProfilingGroup',
          'Properties': {
            'ProfilingGroupName': 'MyProfilingGroup',
          },
        },
      },
    });
  });

  test('grant publish permissions profiling group', () => {
    const stack = new Stack();
    const profilingGroup = new ProfilingGroup(stack, 'MyProfilingGroup', {
      profilingGroupName: 'MyAwesomeProfilingGroup',
    });
    const publishAppRole = new Role(stack, 'PublishAppRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    profilingGroup.grantPublish(publishAppRole);

    expect(stack).toMatch({
      'Resources': {
        'MyProfilingGroup829F0507': {
          'Type': 'AWS::CodeGuruProfiler::ProfilingGroup',
          'Properties': {
            'ProfilingGroupName': 'MyAwesomeProfilingGroup',
          },
        },
        'PublishAppRole9FEBD682': {
          'Type': 'AWS::IAM::Role',
          'Properties': {
            'AssumeRolePolicyDocument': {
              'Statement': [
                {
                  'Action': 'sts:AssumeRole',
                  'Effect': 'Allow',
                  'Principal': {
                    'AWS': {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            'Ref': 'AWS::Partition',
                          },
                          ':iam::',
                          {
                            'Ref': 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                },
              ],
              'Version': '2012-10-17',
            },
          },
        },
        'PublishAppRoleDefaultPolicyCA1E15C3': {
          'Type': 'AWS::IAM::Policy',
          'Properties': {
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': [
                    'codeguru-profiler:ConfigureAgent',
                    'codeguru-profiler:PostAgentProfile',
                  ],
                  'Effect': 'Allow',
                  'Resource': {
                    'Fn::GetAtt': [
                      'MyProfilingGroup829F0507',
                      'Arn',
                    ],
                  },
                },
              ],
              'Version': '2012-10-17',
            },
            'PolicyName': 'PublishAppRoleDefaultPolicyCA1E15C3',
            'Roles': [
              {
                'Ref': 'PublishAppRole9FEBD682',
              },
            ],
          },
        },
      },
    });
  });

  test('grant read permissions profiling group', () => {
    const stack = new Stack();
    const profilingGroup = new ProfilingGroup(stack, 'MyProfilingGroup', {
      profilingGroupName: 'MyAwesomeProfilingGroup',
    });
    const readAppRole = new Role(stack, 'ReadAppRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    profilingGroup.grantRead(readAppRole);

    expect(stack).toMatch({
      'Resources': {
        'MyProfilingGroup829F0507': {
          'Type': 'AWS::CodeGuruProfiler::ProfilingGroup',
          'Properties': {
            'ProfilingGroupName': 'MyAwesomeProfilingGroup',
          },
        },
        'ReadAppRole52FE6317': {
          'Type': 'AWS::IAM::Role',
          'Properties': {
            'AssumeRolePolicyDocument': {
              'Statement': [
                {
                  'Action': 'sts:AssumeRole',
                  'Effect': 'Allow',
                  'Principal': {
                    'AWS': {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            'Ref': 'AWS::Partition',
                          },
                          ':iam::',
                          {
                            'Ref': 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                },
              ],
              'Version': '2012-10-17',
            },
          },
        },
        'ReadAppRoleDefaultPolicy4BB8955C': {
          'Type': 'AWS::IAM::Policy',
          'Properties': {
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': [
                    'codeguru-profiler:GetProfile',
                    'codeguru-profiler:DescribeProfilingGroup',
                  ],
                  'Effect': 'Allow',
                  'Resource': {
                    'Fn::GetAtt': [
                      'MyProfilingGroup829F0507',
                      'Arn',
                    ],
                  },
                },
              ],
              'Version': '2012-10-17',
            },
            'PolicyName': 'ReadAppRoleDefaultPolicy4BB8955C',
            'Roles': [
              {
                'Ref': 'ReadAppRole52FE6317',
              },
            ],
          },
        },
      },
    });
  });

});