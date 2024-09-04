import { LedgerWalletAdapter, WalletConnectWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { useMemo, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const SolContextProvider = ({ children }: Props) => {
  const wallets = useMemo(() => {
    return [
      new WalletConnectWalletAdapter({
        network: WalletAdapterNetwork.Mainnet,
        options: {
          relayUrl: "wss://relay.walletconnect.com",
          projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
          metadata: {
            name: "SOL staking widget",
            description: "SOL staking widget",
            url: window.location.host,
          },
        },
      }),
      new LedgerWalletAdapter(),
    ];
  }, []);

  return (
    <ConnectionProvider
      endpoint={import.meta.env.VITE_SOL_RPC}
      config={{
        confirmTransactionInitialTimeout: 120 * 1000, // wait 120 seconds for transaction confirmation
      }}
    >
      <WalletProvider wallets={wallets} autoConnect={false}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolContextProvider;
