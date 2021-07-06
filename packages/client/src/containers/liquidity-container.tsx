import {
    useState,
    useEffect,
    useContext,
    createContext,
    Dispatch,
    SetStateAction,
} from 'react';
import { PoolSearch } from 'components/pool-search';
import { Box } from '@material-ui/core';
import { AddLiquidityV3 } from 'components/add-liquidity/add-liquidity-v3';
import { Helmet } from 'react-helmet';
import { useLocation, useParams } from 'react-router-dom';
import { useBalance } from 'hooks/use-balance';
import {
    usePoolOverview,
    useTopPools,
    useRandomPool,
} from 'hooks/data-fetchers';
import { useWallet } from 'hooks/use-wallet';
import { debug } from 'util/debug';
import { PoolOverview } from 'hooks/data-fetchers';
import { EthGasPrices } from '@sommelier/shared-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import './liquidity-container.scss';
import { Circles } from 'react-loading-icons';
import { ethers } from 'ethers';
import { SettingsPopover } from 'components/add-liquidity/settings-popover';
export enum GasPriceSelection {
    Standard = 'standard',
    Fast = 'fast',
    Fastest = 'fastest',
}

type LiquidityContext = {
    poolId: string | null;
    selectedGasPrice: GasPriceSelection;
    slippageTolerance: number;
    setPoolId: Dispatch<SetStateAction<string | null>>;
    setSelectedGasPrice: Dispatch<SetStateAction<GasPriceSelection>>;
    setSlippageTolerance: Dispatch<SetStateAction<number>>;
};

const initialContext = {
    poolId: null,
    selectedGasPrice: GasPriceSelection.Standard,
    slippageTolerance: 3.0,
};
export const LiquidityContext = createContext<Partial<LiquidityContext>>(
    initialContext,
);

export const LiquidityContainer = ({
    gasPrices,
    poolId,
    onRefreshPool,
    handleWalletConnect,
    onAddBasket,
    onAddSuccess,
    onStatus,
}: {
    gasPrices: EthGasPrices | null;
    poolId: string;
    onRefreshPool: () => void;
    handleWalletConnect: () => void;
    onAddBasket: (data: LiquidityBasketData) => void;
    onAddSuccess: () => void;
    onStatus: (status: boolean) => void;
}): JSX.Element => {
    const location = useLocation();

    // const { poolId }: { poolId: string } = useParams();
    const [poolId, setPoolId] = useState<string | null>(null);
    const [shortUrl, setShortUrl] = useState(null);
    const { wallet } = useWallet();
    const { data: pool, isLoading, isError } = usePoolOverview(
        wallet.network,
        poolId,
    );

    useEffect(() => {
        const query = new URLSearchParams(location?.search);
        const poolId = query.get('id');

        poolId && setPoolId(poolId);
    }, [location]);

    useEffect(() => {
        if (!poolId) return;
        const getShortUrl = async () => {
            const data = await (
                await fetch(`/api/v1/mainnet/pools/${poolId}/shorts`)
            ).json();
            setShortUrl(data);
        };

        void getShortUrl();
    }, [poolId]);

    const [slippageTolerance, setSlippageTolerance] = useState(3.0);
    const [selectedGasPrice, setSelectedGasPrice] = useState<GasPriceSelection>(
        GasPriceSelection.Fast,
    );
    const balances = useBalance({
        pool,
    });
    debug.poolId = poolId;
    debug.balances = balances;
    const renderErrorBox = () => {
        if (wallet?.network !== '1') {
            const msg = 'Switch to Ethereum Mainnet network in metamask.';

            return <ErrorBox msg={msg} />;
        }
        if (poolId && !ethers.utils.isAddress(poolId)) {
            return <ErrorBox msg='Invalid Ethereum pool address.' />;
        }
        return <ErrorBox msg='Pool not found. Search another Pool.' />;
    };
    return (
        <LiquidityContext.Provider
            value={{
                poolId,
                selectedGasPrice,
                setSelectedGasPrice,
                slippageTolerance,
                setSlippageTolerance,
            }}
        >
            <Box className='liquidity-container'>
                <WidgetSelector />
                <SearchWithHelmet pool={pool} />
                {isLoading && <LoadingPoolBox msg=' fetching pool' />}
                {isError && renderErrorBox()}
                {poolId && pool && <SettingsBar gasPrices={gasPrices} />}
                {poolId && pool && (
                    <AddLiquidityV3
                        pool={pool}
                        shortUrl={shortUrl}
                        balances={balances}
                        gasPrices={gasPrices}
                    />
                )}
                {/* {poolId && <TransactionSettings gasPrices={gasPrices} />} */}
            </Box>
        </LiquidityContext.Provider>
    );
};

const WidgetSelector = (): JSX.Element => (
    <Box display='flex'>
        <Box display='flex'>
            <div className='nav-item-border-wrapper'>
                <div className='nav-item'>Liquidity</div>
            </div>
        </Box>
    </Box>
);

const SearchWithHelmet = ({ pool }: { pool: PoolOverview }) => {
    return (
        <>
            {pool && (
                <Helmet>
                    <meta
                        name='description'
                        content={`Simplest way to provide liquidity to ${pool?.token0?.symbol} / ${pool?.token1?.symbol} uniswap pool`}
                    />
                    <title>{`Sommelier Finance ${pool?.token0?.symbol} / ${pool?.token1?.symbol} Uniswap Pool`}</title>
                </Helmet>
            )}
            <PoolSearch pool={pool} />
        </>
    );
};

const ErrorBox = ({ msg }: { msg: string }) => (
    <Box style={{ textAlign: 'center' }} className='alert-well'>
        {msg}
    </Box>
);

const LoadingPoolBox = ({ msg }: { msg: string }) => (
    <Box style={{ textAlign: 'center' }}>
        <Circles width='24px' height='24px' />
        {msg}
    </Box>
);

const SettingsBar = ({ gasPrices }: { gasPrices: EthGasPrices | null }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <Box
            display='flex'
            justifyContent='space-between'
            className='search-header'
            alignItems='center'
        >
            <div style={{ fontSize: '1rem', color: 'var(--faceDeep)' }}>
                {'Add Liquidity'}
            </div>
            <div
                className='transaction-settings'
                onClick={() => setShowModal(true)}
            >
                <FontAwesomeIcon icon={faCog} />
                {showModal ? (
                    <SettingsPopover
                        show={showModal}
                        gasPrices={gasPrices}
                        onClose={(e) => {
                            e.stopPropagation();
                            setShowModal(false);
                        }}
                    />
                ) : null}
            </div>
        </Box>
    );
};
