import { inAppWallet, useChain } from "@thirdweb-dev/react";
import ApproveButton from "./approveButton";
import ConnectedButton from "./connectedButton";
import SwitchChain from "./switchChain";
import { ConnectButton } from "thirdweb/react";

const ConnectWalletButton = ({ token0, token1, amount, chain, status }) => {
  const currentChain = useChain(); //thirweb hook to get the current chainof the wallet in session

  const pickButton = () => {
    if (!chain) {
      console.log("chain not selected");
      if (status === "disconnected") {
        return <ConnectButton />;
      }
     
      if (status === "connected") {
        return <ConnectedButton />;
      }
    } else {
      //user has selected a chain
      if (status === "connected" && chain.chainId !== currentChain.chainId + "") {
        return <SwitchChain chain={chain} />;
      }
     
      if (status === "connected" && chain.chainId === currentChain.chainId + "") {
        return <ConnectedButton />;
      }
    }
  };
  return <div>{pickButton()}</div>;
};
export default ConnectWalletButton;
