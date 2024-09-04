import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { CheckIcon, DisconnectIcon, CopyIcon } from "../Icons.tsx";
import { formatAddress } from "../../utils.ts";
import NetworkBadge from "../NetworkBadge.tsx";
import Tooltip from "../Tooltip.tsx";

const SolWalletStatus = () => {
  const { publicKey, disconnect } = useWallet();
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const handleCopyAddress = async () => {
    if (!base58) return;
    await navigator.clipboard.writeText(base58);
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 1000);
  };

  const formattedAddress = base58 ? formatAddress(base58) : "";

  return (
    <>
      <div className="flex items-center rounded border border-gray-200 bg-gray-50 px-7.5 py-6">
        {!base58 ? (
          <div className="flex items-center gap-x-3">
            <NetworkBadge>Mainnet</NetworkBadge>
            <span className="text-body-3 text-gray-700">Connect your Mainnet wallet</span>
          </div>
        ) : (
          <div className="flex flex-grow items-center justify-between gap-x-10">
            {base58 && (
              <>
                <div className="flex items-center gap-x-3">
                  <NetworkBadge>Mainnet</NetworkBadge>
                  <span className="text-body-3 text-gray-700">{formattedAddress}</span>
                </div>
                <div className="flex items-center gap-x-5">
                  <Tooltip>
                    <Tooltip.Trigger>
                      <button onClick={handleCopyAddress}>
                        {isAddressCopied ? (
                          <CheckIcon className="h-5 w-5 text-black" />
                        ) : (
                          <CopyIcon className="h-5 w-5 text-black" />
                        )}
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content className="max-w-xl p-2">
                      <span className="col-span-2 flex text-sm text-gray-900">Copy wallet address</span>
                    </Tooltip.Content>
                  </Tooltip>
                  <span className="block h-[24px] w-[1px] bg-gray-200" />
                  <Tooltip>
                    <Tooltip.Trigger>
                      <button onClick={() => disconnect()}>
                        <DisconnectIcon className="h-5 w-5 text-black" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content className="max-w-xl p-2">
                      <span className="col-span-2 flex text-sm text-gray-900">Disconnect wallet</span>
                    </Tooltip.Content>
                  </Tooltip>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SolWalletStatus;
