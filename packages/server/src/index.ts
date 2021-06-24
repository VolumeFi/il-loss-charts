import memoizer from 'util/memoizer-redis';

import * as apolloClients from 'services/util/apollo-client';
import { calculateMarketStats } from 'util/calculate-stats';
import { UniswapV3Fetcher } from 'services/uniswap-v3/fetcher';
import UniswapFetcher from 'services/uniswap';
import BitqueryFetcher from 'services/bitquery/fetcher';
<<<<<<< HEAD
import { _getBitqueryPeriodIndicators as _getPeriodIndicators } from 'api/controllers/market-data';
=======
// import { _getPeriodIndicators } from 'api/controllers/market-data';
import _getPeriodIndicators from 'api/controllers/market-data';
>>>>>>> 3a9461e (create app.yaml, .gcloudignore)

export {
    _getPeriodIndicators,
    apolloClients,
    BitqueryFetcher,
    calculateMarketStats,
    memoizer,
    UniswapFetcher,
    UniswapV3Fetcher,
};
