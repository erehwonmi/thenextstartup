import 'server-only';

import { Logger } from 'next-axiom';

const logger = new Logger({ source: 'web-app' });
export default logger;
