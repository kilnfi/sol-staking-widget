import { useState } from "react";
import SolWalletStatus from "./SolWalletStatus";
import SolStakingWidget from "./SolStakingWidget";
import SolConnectWalletModal from "./SolConnectWalletModal";

const SolStakingWidgetWrapper = () => {
  const [isSelectWalletModalOpened, setIsSelectWalletModalOpened] = useState(false);

  const handleConnect = () => {
    setIsSelectWalletModalOpened(true);
  };

  return (
    <div className="flex flex-col gap-y-3">
      <SolWalletStatus />

      <SolStakingWidget handleConnect={handleConnect} />

      <SolConnectWalletModal isOpen={isSelectWalletModalOpened} onClose={() => setIsSelectWalletModalOpened(false)} />
    </div>
  );
};

export default SolStakingWidgetWrapper;
