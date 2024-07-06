import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  API_KEY_ETH,
  API_KEY_POLYGON,
  ETH_GOERLI,
  ETH_MAINNET,
  ETH_SEPOLIA,
  POLYGON_MATIC,
  POLYGON_MUMBAI,
} from "./constants";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GET_BASE_URL = (network: string) => {
  if (network === "mainnet") {
    return ETH_MAINNET;
  } else if (network === "sepolia") {
    return ETH_SEPOLIA;
  } else if (network === "goerli") {
    return ETH_GOERLI;
  } else if (network === "polygonMatic") {
    return POLYGON_MATIC;
  } else if (network === "polygonMumbai") {
    return POLYGON_MUMBAI;
  }
};
export const GET_API_KEY = (network: string) => {
  if (network === "polygonMatic" || network === "polygonMumbai") {
    return API_KEY_POLYGON;
  } else return API_KEY_ETH;
};

export const fetchPrice = async (network :string ) => {
  const priceUrl = network ==="polygonMatic" || network === "polygonMumbai" ? `https://api.coinconvert.net/convert/matic/usd?amount=1` : `https://api.coinconvert.net/convert/eth/usd?amount=1`

  const price = await axios.get(priceUrl);
  return price
}



export const fetchDetails = async ({
  network,
  address,
}: {
  network: string;
  address: string;
}) => {
  const BASE_URL = GET_BASE_URL(network);
  const KEY = GET_API_KEY(network);
  const etherBalance_URL = `${BASE_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${KEY}`;
  const transactions_URL = `${BASE_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${KEY}`;

  try {
    const { data: balanceResponse } = await axios.get(etherBalance_URL);
    const { data: transactionsResponse } = await axios.get(transactions_URL);
const price = await fetchPrice(network)
    console.log(price.data.USD);
    const ethWizardResponse = JSON.stringify({
      req: { network, address },
      res: { balanceResponse, transactionsResponse ,price :price.data.USD ? price.data.USD : 2900 },
    });
        


return ethWizardResponse  } catch (error) {
    console.log(error);
  }
};

interface Request {
    network: string;
    address: string;
}

interface BalanceResponse {
    status: string;
    message: string;
    result: string;
}

interface Transaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
    methodId: string;
    functionName: string;
}

interface TransactionsResponse {
    status: string;
    message: string;
    result: Transaction[];
}

interface Response {
    balanceResponse: BalanceResponse;
    transactionsResponse: TransactionsResponse;
    price : number;
}

export interface DataInterface {
    req: Request;
    res: Response;
}

