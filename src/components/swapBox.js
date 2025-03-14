import { Container, Card, Form } from "react-bootstrap";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { ConnectWallet, useConnectionStatus, useWalletConnect } from "@thirdweb-dev/react";
import SelectTokenButton from "./selecTokenButton.js";
import mangoMiniLogo from "../imgs/mangoMiniLogo.png";
//import FetchAmountOut from "./fetchAmountOut.js"
import CallTokenList from "./getTokenList.js";
import axios from "axios";
import ConnectWalletButton from "./connectWalletButton";
import dotenv from "dotenv";
import "../App.css";
dotenv.config();

const SwapBox = ({ Client }) => {
  const status = useConnectionStatus();
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [selectedToken1, setSelectedToken1] = useState({ empty: true });
  const [selectedToken2, setSelectedToken2] = useState({ empty: true });
  const [showModal, setShowModal] = useState(false);
  const [outPutAmount, setOutputAmount] = useState("Enter Amount");
  const [isSelectingToken1, setIsSelectingToken1] = useState(true);
  const [isChain, setChain] = useState(null);
  const [chatId, setChatId] = useState(null);
  console.log(amount1);
  console.log(chatId);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const telegram = window.Telegram.WebApp;
      const userId = telegram.initDataUnsafe?.user?.id;

      if (userId) {
        setChatId(userId);
        console.log("Chat ID:", userId);
      }
      telegram.ready();
    } else {
      console.error("Telegram WebApp API not available");
    }
  }, []);

  const handleTokenSelect = useCallback(
    (token) => {
      if (isSelectingToken1) {
        setSelectedToken1(token);
      } else {
        setSelectedToken2(token);
      }
      setShowModal(false);
    },
    [isSelectingToken1]
  );

  const handleAmount1Change = useCallback((e) => {
    setAmount1(e.target.value);
  }, []);

  const handleAmount2Change = useCallback((e) => {
    setAmount2(e.target.value);
  }, []);
  const handleChainSelect = useCallback((chain) => {
    setChain(chain);
  }, []);

  const fetchAmountOut = useCallback(async (params) => {
    try {
      const resp = await axios.get(`https://38654yedpe.execute-api.ca-central-1.amazonaws.com/amountOut`, { params });
      return resp.data;
    } catch (e) {
      console.error("Error fetching amount out:", e);
    }
  }, []);

  const handleBlur = useCallback(async () => {
    if (amount1 && selectedToken1.address && selectedToken2.address) {
      //query params
      //console.log(selectedToken1)
      const params = {
        chainId: 8453,
        sellTokenAddress: selectedToken1.address,
        buyTokenAddress: selectedToken2.address,
        amountToSell: amount1 * 10 ** selectedToken1.decimals,
      };
      try {
        const resp = await fetchAmountOut(params);
        const amountBack = resp.buyAmount / 10 ** selectedToken2.decimals;
        const stringAmount = amountBack.toString();
        const index = stringAmount.indexOf(".");
        console.log(typeof amountBack);
        setOutputAmount(stringAmount.slice(0, index + 3));
      } catch (e) {
        console.error("Error in handleBlur:", e);
      }
    }
  }, [amount1, selectedToken1, selectedToken2, fetchAmountOut]);
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      {/* Logo Positioned Above SwapBox */}
      <div className="logo-container">
        <img src={mangoMiniLogo} width="80" height="80" alt="Mango Logo" />
      </div>
      <Card
        style={{
          width: "27rem",
          padding: "2rem",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
          backgroundColor: "rgba(0,1,0, 0.5)", // Darker grey with transparency
          border: "3px solid green", // Green border
          borderRadius: "15px", // Optional: rounded corners
        }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          {status === "disconnected" ? (
            <ConnectWallet client={Client} />
          ) : (
            <Form style={{ width: "100%" }}>
              {/* Token 1 selection */}
              <Form.Group className="mb-4">
                <div
                  className="token-input-container"
                  style={{ display: "flex", alignItems: "center", position: "relative", width: "100%" }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter amount"
                    value={amount1}
                    onChange={handleAmount1Change}
                    onBlur={handleBlur}
                    style={{ fontSize: "1rem", padding: "1rem", flex: 1, marginRight: "10px" }}
                  />
                  <SelectTokenButton
                    isSelected={!selectedToken1.empty}
                    token={selectedToken1}
                    onClick={() => {
                      setIsSelectingToken1(true);
                      setShowModal(true);
                    }}
                  />
                </div>
              </Form.Group>

              {/* Token 2 selection */}
              <Form.Group className="mb-4">
                <div
                  className="token-input-container"
                  style={{ display: "flex", alignItems: "center", position: "relative", width: "100%" }}
                >
                  <Form.Control
                    type="text"
                    placeholder={`${outPutAmount}`}
                    value={amount2}
                    onChange={handleAmount2Change}
                    style={{ fontSize: "1rem", padding: "1rem", flex: 1, marginRight: "10px" }}
                  />
                  <SelectTokenButton
                    isSelected={!selectedToken2.empty}
                    token={selectedToken2}
                    onClick={() => {
                      setIsSelectingToken1(false);
                      setShowModal(true);
                    }}
                  />
                </div>
              </Form.Group>
              {/* Swap Button */}
              <div className="d-flex justify-content-center">
                <div className="w-100">
                  <ConnectWalletButton
                    token0={selectedToken1}
                    token1={selectedToken2}
                    amount={amount1}
                    chain={isChain}
                    status={status}
                  />
                </div>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
      {/* Token selection modal */}
      <CallTokenList
        show={showModal}
        onHide={() => setShowModal(false)}
        onTokenSelect={handleTokenSelect}
        onChainSelect={handleChainSelect}
      />
    </Container>
  );
};

export default SwapBox;
