/* eslint-disable no-console */
import 'dotenv/config';

import { clearDatabase } from '../tests/test-utils';

(async () => {
    return clearDatabase()
})().then(() => {
        console.log('Clear done')
    }).catch((err) => {
        console.error(err);
})
