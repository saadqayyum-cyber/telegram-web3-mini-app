import { useState } from "react";
import { ethers } from "ethers";
import { abi } from "./abis/abi";
import { useWallet } from "@thirdweb-dev/react";

function MintBox() {
  const auth = useWallet();
  const contractAddress = "0xE075c408F7D697f086Ec7d5b515Ead64AdfbB438";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, isError = false) => {
    setLogs((prevLogs) => [...prevLogs, { message, isError }]);
  };

  const validateSigner = async (signer) => {
    try {
      // Check if signer is defined
      if (!signer) {
        addLog("Signer is undefined", true);
        return false;
      }

      // Check if signer has getAddress method
      if (typeof signer.getAddress !== "function") {
        addLog("Signer doesn't have getAddress method", true);
        return false;
      }

      // Try to get the address
      const address = await signer.getAddress();
      addLog(`Got address: ${address}`);

      // Check if the address is valid
      if (!ethers.utils.isAddress(address)) {
        addLog("Invalid Ethereum address", true);
        return false;
      }

      // Check if the signer has signMessage method
      if (typeof signer.signMessage !== "function") {
        addLog("Signer doesn't have signMessage method", true);
        return false;
      }

      // Check if the signer has connect method (required for ethers Signer)
      if (typeof signer.connect !== "function") {
        addLog("Signer doesn't have connect method", true);
        return false;
      }

      addLog("All validation checks passed!");
      return true;
    } catch (error) {
      console.error("Signer validation error:", error);
      addLog(`Validation error: ${error.message}`, true);
      return false;
    }
  };

  const mint = async () => {
    try {
      setLoading(true);
      setLogs([]);
      addLog("Starting Mint process...");

      // Get signer from ThirdWeb
      addLog("Getting signer from ThirdWeb...");
      const signer = await auth.getSigner();

      // Log signer properties (non-recursive)
      addLog("Checking signer properties...");
      const signerKeys = Object.getOwnPropertyNames(signer).filter(
        (key) => typeof signer[key] !== "object" || signer[key] === null
      );
      addLog(`Signer has the following properties: ${signerKeys.join(", ")}`);

      // Validate the signer
      addLog("Validating signer...");
      const isValid = await validateSigner(signer);

      if (!isValid) {
        addLog("Invalid signer. Please check your wallet connection.", true);
        setLoading(false);
        return;
      }

      const signerAddress = await signer.getAddress();
      addLog(`Using signer with address: ${signerAddress}`);

      // Create contract with the ThirdWeb signer
      addLog("Creating contract instance...");
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Execute the mint function
      const amount = ethers.utils.parseUnits("1", 18);
      addLog(`Minting to address: ${signerAddress}...`);
      const tx = await contract.mint(signerAddress, amount);

      addLog(`Transaction submitted: ${tx.hash}`);

      // Wait for confirmation
      addLog("Waiting for transaction confirmation...");
      await tx.wait();
      addLog("Mint successful!");
    } catch (error) {
      console.error("Mint error:", error);
      addLog(`Mint failed: ${error.message}`, true);
    } finally {
      setLoading(false);
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
        {loading && (
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
        )}
        <h4>Logs:</h4>
        {logs.map((log, index) => (
          <div key={index} style={{ color: log.isError ? "red" : "black", marginBottom: "5px", textAlign: "left" }}>
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MintBox;
