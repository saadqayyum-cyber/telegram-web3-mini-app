import { useState } from "react";
import { ethers } from "ethers";
import { abi } from "./abis/abi";
import { useWallet } from "@thirdweb-dev/react";
import { stringify } from "flatted";

function MintBox() {
  const auth = useWallet();
  const contractAddress = "0xE075c408F7D697f086Ec7d5b515Ead64AdfbB438";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, isError = false) => {
    setLogs((prevLogs) => [...prevLogs, { message, isError }]);
  };

  const mint = async () => {
    try {
      setLoading(true); // Start loading
      setLogs([]); // Clear previous logs
      addLog("Starting Mint process...");

      const thirdwebSigner = await auth.getSigner();

      addLog(`ThirdWeb signer obtained with address: ${await thirdwebSigner.getAddress()}`);

      addLog("Getting provider from ThirdWeb signer...");
      const provider = thirdwebSigner.provider;

      addLog("Creating ethers signer from provider...");
      const ethersSigner = provider.getSigner();

      addLog(`Ethers signer created with address: ${await ethersSigner.getAddress()}`);

      const address = await ethersSigner.getAddress();
      addLog(`Signer Address: ${address}`);

      addLog(`Using address: ${address}`);

      const contract = new ethers.Contract(contractAddress, abi, ethersSigner);
      const amount = ethers.utils.parseUnits("1", 18);
      const tx = await contract.mint(address, amount);

      addLog(`Mint transaction submitted: ${tx.hash}`);

      // Wait for confirmation
      await tx.wait();
      addLog("Mint successful!");
    } catch (error) {
      addLog(`Mint failed: ${error.message}`, true);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      style={{
        marginTop: "125px",
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <button onClick={mint} style={{ padding: "10px 20px", marginBottom: "20px", cursor: "pointer" }}>
        Mint
      </button>

      <div
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          background: "#f9f9f9",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#000000",
              padding: "10px",
              borderRadius: "5px",
              color: "#ffffff",
            }}
          >
            <span>Loading...</span>
          </div>
        )} */}
        <h4>Logs:</h4>
        {logs.map((log, index) => (
          <div key={index} style={{ color: log.isError ? "red" : "black", marginBottom: "5px" }}>
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MintBox;
