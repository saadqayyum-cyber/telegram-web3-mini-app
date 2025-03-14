import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThirdwebProvider, walletConnect, metamaskWallet } from "@thirdweb-dev/react";
import { defineChain } from "thirdweb";

const clientId = "67f33a7eb74f521dc14626f8f2b8ea5b";
const secretKey = "5pU__0OU8Ftcp7NJmALSSe8naAtBztgyHfSPtJ6Izh2_tDpRr04NQpaf5mwwcSqKoxPsRuDBWEJqih-GDT6z8A";

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <ThirdwebProvider
      clientId={clientId}
      supportedWallets={[
        metamaskWallet(),
        walletConnect({
          projectId: "864eb069031c6a2e6b20f5f8707c0258",
        }),
      ]}
      secretKey={secretKey}
    >
      <App />
    </ThirdwebProvider>
  </QueryClientProvider>
);
