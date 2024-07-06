"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sampleTransactions } from "@/lib/constants";
import { DataInterface } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export const DataComponent = () => {
  const [data, setData] = useState<DataInterface | null>(null);

  const ethToUsd = data?.res.price ? data.res.price : 3010.20625;

  useEffect(() => {
    if (window) {
      const Response = window.localStorage.getItem("ethWizardResponse");

      if (Response) {
        const ethWizardResponse = JSON.parse(Response);
        setData(ethWizardResponse);
        console.log(ethWizardResponse);
      }
    }
  }, []);
  const timeStampToDate = (timeStamp: string) => {
    const date = new Date(+timeStamp * 1000);
    return date.toDateString();
  };
  const generateTransactionDetailLink = (hash: string, network: string) => {
    if (network === "mainnet") {
      return `https://etherscan.io/tx/${hash}`;
    } else if (network === "sepolia") {
      return `https://sepolia.etherscan.io/tx/${hash}`;
    } else if (network === "goerli") {
      return `https://goerli.etherscan.io/tx/${hash}`;
    } else if (network === "polygonMatic") {
      return `https://polygonscan.com//tx/${hash}`;
    } else if (network === "polygonMumbai") {
      return `https://mumbai.polygonscan.com//tx/${hash}`;
    }
  };

  return (
    <Table>
      <TableCaption>A list of your recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Block Number</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Gas Fee</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      {data ? (
        <TableBody>
          {data.res.transactionsResponse.result.map((transaction, index) => (
            <TableRow key={transaction.hash}>
              <TableCell className="font-medium">
                {transaction.blockNumber}
              </TableCell>
              <TableCell>{timeStampToDate(transaction.timeStamp)}</TableCell>
              <TableCell>
                ${" "}
                {(
                  (+transaction.gasPrice *
                    +transaction.cumulativeGasUsed *
                    ethToUsd) /
                  1e18
                ).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`${generateTransactionDetailLink(
                    data.res.transactionsResponse.result[index].hash,
                    data.req.network
                  )}`}
                >
                  View Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <p>No Data</p>
      )}
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
