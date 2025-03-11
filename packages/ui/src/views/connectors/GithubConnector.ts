import { getConnectorBuilder } from './ConnectorPayloadBuilder';
import { GithubConnectorSpec } from './schemas';

// Get the builder for GitHub connector
export const githubBuilder = getConnectorBuilder<GithubConnectorSpec>('Github');
