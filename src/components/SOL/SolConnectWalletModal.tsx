import { type WalletAdapter, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { LedgerIcon, SolIcon } from "../Icons";
import Modal from "../Modal";
import Button from "../Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SolConnectWalletModal = ({ isOpen, onClose }: Props) => {
  const { select, wallets } = useWallet();

  const handleConnectWallet = async (wallet: WalletAdapter) => {
    // Redirect to wallet install page if not detected
    if (wallet.readyState === WalletReadyState.NotDetected) {
      window.open(wallet.url);
    } else {
      // Select wallet
      select(wallet.name);
      await wallet.connect();
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
    >
      <Modal.Content title={
        <div className="flex items-center gap-x-3">
          <SolIcon className="h-8 w-8"/>
          <span>Connect a wallet on Solana</span>
        </div>
      }>
        <div className="flex flex-col gap-y-3">
          {wallets.map((wallet) => (
            <Button
              key={wallet.adapter.name}
              variant="tertiary"
              size="normal"
              onClick={() => handleConnectWallet(wallet.adapter)}
              className="gap-x-2"
            >
              <div className="flex flex-1 items-center justify-between">
                <span>{wallet.adapter.name}</span>
                {wallet.adapter.name === "Ledger" ? (
                  <LedgerIcon className="h-6 w-6"/>
                ) : (
                  <img src={wallet.adapter.icon} alt="metamask logo" width={24} height={24}/>
                )}
              </div>
            </Button>
          ))}
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default SolConnectWalletModal;
