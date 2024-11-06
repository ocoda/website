import type { FC, ReactElement } from 'react';
import {
  AmazonWebServicesIcon,
  ApolloIcon,
  CircleCIIcon,
  CloudwatchIcon,
  DockerIcon,
  DynamoDBIcon,
  GitIcon,
  GithubActionsIcon,
  GraphQLIcon,
  LinuxIcon,
  MongoDBIcon,
  NestJSIcon,
  NextJSIcon,
  NodeJSIcon,
  PostgresIcon,
  PythonIcon,
  ReactJSIcon,
  RemixIcon,
  SentryIcon,
  TailwindIcon,
  TypeScriptIcon,
} from '~/resources/icons';
import type { en } from '~/resources/locales/en';
import Paragraph from '../paragraph/Paragraph';

export const getToolIcon = (tech: string): ReactElement => {
  switch (tech) {
    case 'aws':
      return <AmazonWebServicesIcon className="text-red-600 size-4" />;
    case 'apollo':
      return <ApolloIcon className="text-red-600 size-3.5" />;
    case 'circleci':
      return <CircleCIIcon className="text-red-600 size-3.5" />;
    case 'cloudwatch':
      return <CloudwatchIcon className="text-red-600 size-3.5" />;
    case 'docker':
      return <DockerIcon className="text-red-600 size-3.5" />;
    case 'dynamodb':
      return <DynamoDBIcon className="text-red-600 size-4" />;
    case 'git':
      return <GitIcon className="text-red-600 size-3.5" />;
    case 'github-actions':
      return <GithubActionsIcon className="text-red-600 size-3.5" />;
    case 'graphql':
      return <GraphQLIcon className="text-red-600 size-3.5" />;
    case 'linux':
      return <LinuxIcon className="text-red-600 size-3.5" />;
    case 'mongodb':
      return <MongoDBIcon className="text-red-600 size-3.5" />;
    case 'nestjs':
      return <NestJSIcon className="text-red-600 size-3.5" />;
    case 'nextjs':
      return <NextJSIcon className="text-red-600 size-3.5" />;
    case 'nodejs':
      return <NodeJSIcon className="text-red-600 size-3.5" />;
    case 'postgres':
      return <PostgresIcon className="text-red-600 size-3.5" />;
    case 'python':
      return <PythonIcon className="text-red-600 size-3.5" />;
    case 'reactjs':
      return <ReactJSIcon className="text-red-600 size-3.5" />;
    case 'remix':
      return <RemixIcon className="text-red-600 size-3" />;
    case 'sentry':
      return <SentryIcon className="text-red-600 size-3.5" />;
    case 'tailwind':
      return <TailwindIcon className="text-red-600 size-3.5" />;
    case 'typescript':
      return <TypeScriptIcon className="text-red-600 size-3.5" />;
    default:
      throw Error('');
  }
};

interface Props {
  tool: (typeof en)['dries']['skills']['items'][number]['tools'][number];
}

export const ToolBadge: FC<Props> = ({ tool }) => {
  return (
    <div key={tool.name} className="relative flex flex-nowrap items-center gap-1 px-2 py-0.5 border rounded-lg group">
      {getToolIcon(tool.logo)}
      <Paragraph weight="extralight" size="small" className="whitespace-nowrap">
        {tool.name}
      </Paragraph>
    </div>
  );
};
