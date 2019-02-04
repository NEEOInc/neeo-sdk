import * as crypto from 'crypto';
import * as os from 'os';

export default function(text: string, uniqueString?: string) {
  return crypto
    .createHash('sha1')
    .update(`${uniqueString || os.hostname()}${text}`, 'utf8')
    .digest('hex');
}
