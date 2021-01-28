import { Link } from 'react-router-dom';
import { Card, CardDeck } from 'react-bootstrap';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';

import { UniswapPair, MarketStats } from '@sommelier/shared-types';

import { Pair, DailyData, LPStats } from 'constants/prop-types';
import { resolveLogo } from 'components/token-with-logo';

function PercentChangeStat({ value }: { value?: number }): JSX.Element {
    if (!value) throw new Error('Passed falsy value to PercentChangeStat');

    const valueBn = new BigNumber(value);
    const className = valueBn.isPositive() ? 'pct-change-up' : 'pct-change-down';

    return (
        <span className={className}>
            {valueBn.times(100).toFixed(2)}%
        </span>
    );
}

const formatPair = ({ id, token0, token1 }: UniswapPair) => {
    return (
        <span>
            {resolveLogo(token0.id)}{' '}
            <span className='market-data-pair-span'>
                <Link to={`/pair?id=${id}`}>
                    {token0.symbol}/{token1.symbol}
                </Link>
            </span>
            {' '}{resolveLogo(token1.id)}
        </span>
    );
};

PercentChangeStat.propTypes = { value: PropTypes.instanceOf(BigNumber) };

function TopPairsWidget({ topPairs }: {
    topPairs: MarketStats[],
}): JSX.Element {
    return (
        <div className='pool-stats-container'>
            <CardDeck>
                {topPairs.slice(0, 4).map((pairStats, index) =>
                    <Card key={index} style={{ width: '25em' }} body>
                        <Card.Title>{formatPair(pairStats)}</Card.Title>
                        <Card.Text className='annualized-apy-card-text'>
                            <strong>
                                <PercentChangeStat value={pairStats.pctReturn * 365} />{' '}
                                Annualized APY
                            </strong>
                        </Card.Text>
                        <Card.Text>
                            <PercentChangeStat value={pairStats.pctReturn} />{' '}
                            24h return
                        </Card.Text>
                    </Card>
                )}
            </CardDeck>
        </div>
    );
}

TopPairsWidget.propTypes = {
    allPairs: PropTypes.shape({
        lookups: PropTypes.object.isRequired,
    }),
    lpInfo: PropTypes.shape({
        pairData: Pair.isRequired,
        historicalData: PropTypes.arrayOf(DailyData),
    }),
    lpStats: LPStats,
};

export default TopPairsWidget;
