import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import {
  ExternalLinkIcon,
  InfoIcon,
} from "../Icons.tsx";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { formatNumber, formatPrice, solToLamports } from "../../utils.ts";
import useSolStats from "../../hooks/useSolStats.ts";
import { craftStakeTx, getNonceAccount } from "../../sol.ts";
import Tooltip from "../Tooltip.tsx";
import NumberInput from "../NumberInput.tsx";
import RewardForecast from "../RewardForecast.tsx";
import InfoCard from "../InfoCard.tsx";
import Button from "../Button.tsx";
import LoadingCard from "../LoadingCard.tsx";
import SuccessCardWhite from "../SuccessCardWhite.tsx";
import ErrorCard from "../ErrorCard.tsx";

const INITIAL_STAKE_AMOUNT: string = "100";

type Props = {
  handleConnect: () => void;
};

export type TxState =
  | {
  state: "initial";
}
  | {
  state: "crafting_tx";
}
  | {
  state: "pending_tx_signature";
}
  | {
  state: "processing_tx";
}
  | {
  state: "tx_failed";
  error: string;
  txHash?: string;
}
  | {
  state: "success";
  txHash: string;
};

const SolStakingWidget = ({ handleConnect }: Props) => {
  const [stakeAmount, setStakeAmount] = useState<string>(INITIAL_STAKE_AMOUNT);
  const [stakingState, setStakingState] = useState<TxState>({ state: "initial" });
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet, connected } = useWallet();
  const { networkApy = 0, solPrice = 0 } = useSolStats();

  const formattedApy = networkApy ? formatNumber(networkApy, 2) : 0;

  // Parse stake amount to handle empty string
  const parsedStakeAmount: number = stakeAmount === "" ? 0 : Number(stakeAmount);
  const parsedSolBalance: number = solBalance === undefined ? 0 : solBalance;
  const formattedSolBalance: string = formatNumber(parsedSolBalance, 4);
  const showSolBalance: boolean = parsedSolBalance > 0;

  // Insufficient balance warning
  const showInsufficientBalanceWarning: boolean =
    stakingState.state === "initial" && Boolean(publicKey) && parsedStakeAmount > parsedSolBalance;

  // Stake button disabled state
  const isStakeDisabled: boolean = Boolean(
    stakingState.state === "initial" && (parsedStakeAmount === 0 || showInsufficientBalanceWarning),
  );

  const MIN_GAS_FEES = 0.01;

  // Show gas fees warning if user wants to stake more than his balance minus 0.1 SOL
  const showGasFeesWarning: boolean =
    parsedStakeAmount > parsedSolBalance - MIN_GAS_FEES && !showInsufficientBalanceWarning;

  // Update stake amount handler
  const handleStakeAmountChange = (value: string) => {
    setStakeAmount(value);
  };

  const fetchBalance = useCallback(async () => {
    if (!connection || !publicKey || !wallet) {
      setSolBalance(0);
    } else {
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / 1000000000);
    }
  }, [connection, publicKey, wallet]);

  // Get wallet balance
  useEffect(() => {
    fetchBalance();
  }, [connection, publicKey, wallet, fetchBalance]);

  // Handle stake transaction
  const handleStake = async () => {
    if (!publicKey) {
      return;
    }
    setStakingState({
      state: "crafting_tx",
    });
    try {
      const { unsigned_tx_serialized } = await craftStakeTx({
        account_id: import.meta.env.VITE_KILN_ACCOUNT_ID,
        wallet: publicKey.toString(),
        amount_lamports: solToLamports(parsedStakeAmount).toString(),
        vote_account_address: import.meta.env.VITE_SOL_VALIDATOR_ADDRESS,
      });
      if (!unsigned_tx_serialized) {
        setStakingState({
          state: "tx_failed",
          error: "Could not craft the staking transaction",
        });
        return;
      }
      const tx = Transaction.from(Buffer.from(unsigned_tx_serialized, "hex"));

      const nonceInfo = await getNonceAccount();
      const nonceAccountPubKey = new PublicKey(nonceInfo.nonce_account);
      const nonceAccount = await connection.getNonce(nonceAccountPubKey);
      if (!nonceAccount) {
        setStakingState({
          state: "tx_failed",
          error: "Could not fetch the nonce account",
        });
        return;
      }

      try {
        setStakingState({
          state: "pending_tx_signature",
        });
        const signature = await sendTransaction(tx, connection);
        setStakingState({
          state: "processing_tx",
        });

        try {
          await connection.confirmTransaction(
            {
              signature,
              minContextSlot: 0,
              nonceAccountPubkey: nonceAccount.authorizedPubkey,
              nonceValue: nonceAccount.nonce,
            },
            "processed",
          );
          setStakedAmount(parsedStakeAmount);
          setStakingState({
            state: "success",
            txHash: signature,
          });
        } catch {
          setStakingState({
            state: "tx_failed",
            error: "The transaction could not be processed at this time. Please try again later.",
          });
        }
      } catch (err) {
        if (err instanceof WalletSignTransactionError) {
          // Transaction rejected
          if (err.error.code !== 4001) {
            // 4001 is when user rejects tx, no need to show an error
            // Other errors, eg "blockhash not found" that can happen
            setStakingState({
              state: "tx_failed",
              error: "The transaction could not be processed at this time. Please try again later.",
            });
          }
        } else {
          setStakingState({
            state: "tx_failed",
            error: "The transaction could not be processed at this time. Please try again later.",
          });
        }
      }
    } catch {
      setStakingState({
        state: "tx_failed",
        error: "The transaction could not be processed at this time. Please try again later.",
      });
    }
  };

  const handleStakeMax = () => {
    if (!solBalance) return;
    const maxStakeAmount = Math.max(0, solBalance - MIN_GAS_FEES).toString();
    setStakeAmount(maxStakeAmount);
  };

  // Reset state
  const handleStakeMore = async () => {
    await fetchBalance();
    setStakingState({
      state: "initial",
    });
  };

  // Rewards amount
  const token_yearly_rewards_amount: number = parsedStakeAmount * (networkApy / 100);
  const token_monthly_rewards_amount: number = token_yearly_rewards_amount / 12;
  const token_daily_rewards_amount: number = token_yearly_rewards_amount / 365;
  const fiat_yearly_rewards_amount: number = token_yearly_rewards_amount * solPrice;
  const fiat_monthly_rewards_amount: number = fiat_yearly_rewards_amount / 12;
  const fiat_daily_rewards_amount: number = fiat_yearly_rewards_amount / 365;

  // Rewards formatted
  const token_yearly_rewards: string = formatNumber(token_yearly_rewards_amount, 4);
  const token_monthly_rewards: string = formatNumber(token_monthly_rewards_amount, 4);
  const token_daily_rewards: string = formatNumber(token_daily_rewards_amount, 4);
  const fiat_yearly_rewards: string = formatPrice(fiat_yearly_rewards_amount);
  const fiat_monthly_rewards: string = formatPrice(fiat_monthly_rewards_amount);
  const fiat_daily_rewards: string = formatPrice(fiat_daily_rewards_amount);

  return (
    <div className="rounded border border-gray-200 bg-gray-100 px-3 py-4.5">
      <div className="mb-4 flex items-center justify-between gap-x-4">
        <span className="text-[18px] font-semibold">Stake</span>
      </div>

      <div className="mb-4 grid grid-cols-[1fr_auto] gap-x-5 gap-y-3 rounded border bg-white p-4.5">
        <span className="text-subtitle-3 text-gray-700">SOL stake</span>

        <div className="flex items-center justify-end gap-x-2">
          <span className="text-subtitle-3 text-right text-gray-700">GRR</span>
          <Tooltip>
            <Tooltip.Trigger>
              <button>
                <InfoIcon className="h-[18px] w-[18px] text-gray-700" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content className="max-w-[300px] p-2">
              <span className="flex text-sm text-gray-900">
                The estimated gross reward rate your stake will earn per year based on the network-average performance.
                This value is before the commission applied by Kiln.
              </span>
            </Tooltip.Content>
          </Tooltip>
        </div>

        <NumberInput
          name="stakeAmount"
          onChange={handleStakeAmountChange}
          type="number"
          value={stakeAmount}
          button={
            <button className="text-caption-2 rounded border px-2 text-primary shadow" onClick={handleStakeMax}>
              max
            </button>
          }
        />

        <div className="flex items-center justify-center rounded bg-yellow px-6 py-3">
          <span className="text-subtitle-1">{formattedApy}%</span>
        </div>

        {showSolBalance && (
          <div className="flex gap-x-3">
            <span className="text-subtitle-3 text-gray-700">Available</span>
            <span className="text-subtitle-3 text-gray-deep-dark">{formattedSolBalance}</span>
          </div>
        )}
      </div>

      <RewardForecast
        token_name="SOL"
        token_daily_rewards={token_daily_rewards}
        token_monthly_rewards={token_monthly_rewards}
        token_yearly_rewards={token_yearly_rewards}
        fiat_daily_rewards={fiat_daily_rewards}
        fiat_monthly_rewards={fiat_monthly_rewards}
        fiat_yearly_rewards={fiat_yearly_rewards}
      />

      <div className="px-4">
        {stakingState.state === "initial" && publicKey && (
          <>
            {showInsufficientBalanceWarning && (
              <InfoCard className="mb-4" label={`Insufficient funds to stake ${stakeAmount} SOL`} />
            )}
            {showGasFeesWarning && (
              <InfoCard className="mb-4">
                We recommend that you keep enough SOL in your wallet to pay for gas fees.
              </InfoCard>
            )}
            <Button
              className="w-full"
              size="normal"
              variant="primary"
              onClick={handleStake}
              disabled={isStakeDisabled}
            >
              Stake
            </Button>
          </>
        )}

        {stakingState.state === "crafting_tx" && <LoadingCard>Crafting transaction...</LoadingCard>}
        {stakingState.state === "pending_tx_signature" && <LoadingCard>Waiting for signature...</LoadingCard>}
        {stakingState.state === "processing_tx" && <LoadingCard>Processing transaction...</LoadingCard>}

        {stakingState.state === "success" && (
          <>
            <SuccessCardWhite label="Congrats!" className="mb-6">
              You have successfully staked {stakedAmount} SOL!
              <br />
              <a
                href={`https://solana.fm/tx/${stakingState.txHash}`}
                className="mt-2 inline-block hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                <span className="break-all">
                  View transaction
                  <ExternalLinkIcon
                    className="relative bottom-[1px] ml-1 inline h-4 w-4 text-gray-800"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </SuccessCardWhite>

            <div className="grid grid-cols-1 gap-4">
              <Button variant="secondary" size="normal" onClick={handleStakeMore}>
                Stake more
              </Button>
            </div>
          </>
        )}

        {stakingState.state === "tx_failed" && (
          <ErrorCard className="mb-6">
            {stakingState.error}
            {stakingState.txHash && (
              <>
                <br/>
                <a
                  href={`https://solana.fm/tx/${stakingState.txHash}`}
                  className="mt-2 inline-block hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                <span className="break-all">
                  View transaction
                  <ExternalLinkIcon
                    className="relative bottom-[1px] ml-1 inline h-4 w-4 text-gray-800"
                    aria-hidden="true"
                  />
                </span>
                </a>
              </>
            )}
          </ErrorCard>
        )}

        {!connected && (
          <>
            <InfoCard>Please connect a Solana Mainnet wallet</InfoCard>
            <Button
              variant="primary"
              size="normal"
              onClick={handleConnect}
              className="mt-6 w-full"
            >
              Connect wallet
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SolStakingWidget;
