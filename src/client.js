import { createThirdwebClient } from "thirdweb";
import dotenv from 'dotenv';
dotenv.config();
//client
const Client = new createThirdwebClient({
    //secretKey: process.env.SECRETE_KEY,
    clientId: `${process.env.REACT_APP_CLIENT_ID}`
  });
export default Client;