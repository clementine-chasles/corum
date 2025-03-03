/* eslint-disable no-console */
import 'dotenv/config';

import { clearDatabase } from '../tests/test-utils';

(async () => clearDatabase())().then(() => {
        console.log('Clear done')
    }).catch((err) => {
        console.error(err);
})
