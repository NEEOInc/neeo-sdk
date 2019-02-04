import { BrainModel } from '../../models/brainModel';

const DEFAULT_BRAIN_PORT = 3000;
const PROTOCOL = 'http://';

export default function(brain: BrainModel | string, baseUrl = '', brainPort?: number) {
  if (!brain) {
    throw new Error('URLBUILDER_MISSING_PARAMETER_BRAIN');
  }
  if (typeof brain === 'string') {
    return `${PROTOCOL}${brain}:${brainPort || DEFAULT_BRAIN_PORT}${baseUrl}`;
  }
  const { host, port } = brain;
  if (!host || !port) {
    throw new Error('URLBUILDER_INVALID_PARAMETER_BRAIN');
  }
  return `${PROTOCOL}${host}:${port}${baseUrl}`;
}
