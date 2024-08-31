import 'server-only';

import { Logger } from 'next-axiom';

const logger = new Logger({ source: 'admin-web' });
export default logger;
