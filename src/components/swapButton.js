//import { useEffect,useState } from 'react';
import { useWallet } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import React from "react";
import dotenv from 'dotenv';
dotenv.config();

const SwapButton = ({token0,token1,amount})=>{
    {   
        // Validation to ensure required props are provided
        const auth = useWallet();
        const spender = process.env.REACT_APP_MANGO_ROUTER001;
        console.log(token1)
        //const [ status,setTxStatus] = useState('');

        if ( !token0 || !token1 || !amount) {
            //console.error("swap: Missing required props.");
            return null;
        }
    
        /**
         * NOTE: SEND TX HACH AND SWAP INFO ON THE TELEGRAM CHAT
         */
        const handleTxStatus = (txObj)=>{
    
        }
    
        // Function to handle the approval process
        const handleSwap = async (e) => {
            try {
              
                e.preventDefault();
                console.log("Starting Swap process...");
    
                // Ensure the client provides a signer
                const signer = await auth.getSigner();
                if (!signer) throw new Error("No signer available.");
                // mangoRouterABI for the approve function
                const mangoRouterAbi = [
                    "function tokensToTokensV2(address token0, address token1, uint256 _amountIn) external returns(uint256[] memory amounts)",
                    "function ethToTokensV2(address token) payable public returns(uint[] memory amounts)",
                    "function tokensToEthV2(address token, uint256 amountIn) payable external returns(uint256 amountToPay)"
                ];
                const contract = new ethers.Contract(spender, mangoRouterAbi, signer);   
                if(token0.symbol === 'ETH'){
                    console.log('es eth')
                    console.log('spender',spender,'token1 address',token1.address,'signer'); 
                    const ethValue = ethers.utils.parseUnits(amount);
                    console.log('intances initiated')
                     
                    // Call swap Tokens to token uniswapv2
                    const tx = await contract.ethToTokensV2(token1.address,{value:ethValue,gasLimit:3000000});
                    console.log("Swap transaction submitted:", tx);
        
                    // Wait for the transaction to be mined
                    await tx.wait();
                    console.log("swap successful!");
                    //confirming tx status, calls swap component
                    handleTxStatus(tx);
        
                    alert("swap successfully!");

                }else if (token1.symbol === 'ETH'){
                    // Parse the amount to correct decimals
                    const formattedAmount = ethers.utils.parseUnits(amount, token0.decimals);
        
                    // Call swap Tokens to token uniswapv2
                    console.log(token0.address)
                    const tx = await contract.tokensToEthV2(token0.address,formattedAmount,{gasLimit:4000000});
                    console.log("Swap transaction submitted:", tx);
        
                    // Wait for the transaction to be mined
                    await tx.wait();
                    console.log("swap successful!");
                    //confirming tx status, calls swap component
                    handleTxStatus(tx);
        
                    alert("swap successfully!");
                }else{
                    console.log('en el es')
                    // Parse the amount to correct decimals
                    const formattedAmount = ethers.utils.parseUnits(amount, token0.decimals);
        
                    // Call swap Tokens to token uniswapv2
                    const tx = await contract.tokensToTokensV2(token0.address,token1.address,formattedAmount,{gasLimit:3000000});
                    console.log("Swap transaction submitted:", tx);
        
                    // Wait for the transaction to be mined
                    await tx.wait();
                    console.log("swap successful!");
                    //confirming tx status, calls swap component
                    handleTxStatus(tx);
        
                    alert("swap successfully!");
                }
            } catch (error) {
                console.error("Error during swap process:", error);
                alert("swap failed! Please check the console for details.",error);
            }
        };
    
        return (
            <button
                // contractAddress={tokenAddress}
                onClick={handleSwap }
                type="submit"
                className="w-100"
                style={{
                    padding: "1rem",
                    fontSize: "1.5rem",
                    backgroundColor: "#F26E01", // Mango orange
                    borderColor: "#FFA500", // Match the border color
                    color: "#FFFFFF", // White text for contrast
                }}
            >
                Swap
            </button>
    
        );
    };
}
export default SwapButton ;