import { EthGasPrices } from '@sommelier/shared-types';
import { TelegramCTA } from 'components/social-cta';
import { LiquidityContainer } from 'containers/liquidity-container';
import { useMediaQuery } from 'react-responsive';
import { AppHeader } from 'components/app-header/app-header';
import { Box } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
function LandingContainer({
    gasPrices,
}: {
    gasPrices: EthGasPrices | null;
}): JSX.Eadd-liquidity-v3.tsxlement {
    const isMobile = useMediaQuery({ query: '(max-width: 800px)' });

    const handleAddBasket = (
        data: LiquidityBasketData,
        navigateToBasket: boolean,
    ) => {
        const findIndex = basketData.findIndex(
            (item) =>
                item.poolId === data.poolId &&
                item.actionType === data.actionType,
        );

        if (findIndex < 0) {
            basketData.push(data);
        } else {
            basketData[findIndex] = {
                ...data,
            };
        }

        setBasketData([...basketData]);
        if (navigateToBasket) {
            setTab('cart');
        }
    };

    const handleTransactionSuccess = () => {
        setTab('transactionSuccess');
    };

    const handleChangePendingStatus = (status: boolean) => {
        setPendingTransaction(status);
    };

    useEffect(() => {
        console.log(basketData);
    }, [basketData]);

    return (
        <div>
            <AppHeader />
            <Box
                display='flex'
                flexDirection='row'
                alignItems='flex-start'
                justifyContent='space-between'
            >
                {!isMobile && (
                    <Box
                        style={{
                            background: 'var(--bgPrimary)',
                            padding: '1.5rem 2rem',
                            borderRadius: '8px',
                            maxWidth: '220px',
                            fontSize: '1.15rem',
                            boxShadow: '0 3px 12px var(--bgDeep)',
                        }}
                    >
                        <p>The easiest way to add liquidity on Uniswap v3</p>
                        <br />
                        <Box>
                            <TelegramCTA />
                        </Box>
                    </Box>
                )}
                <LiquidityContainer gasPrices={gasPrices} />
            </Box>
            <Box
                display='flex'
                alignItems='center'
                className='footer-tab-container'
            >
                <a
                    className='support-tab'
                    href='https://discord.gg/VXyUgtnbtv'
                    target='_blank'
                    rel='noreferrer'
                >
                    <img src='../styles/images/cart.png' />
                </div>
            </Box>
        </div>
    );
}

export default LandingContainer;
