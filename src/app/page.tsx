"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  GET_API_KEY,
  GET_BASE_URL,
  fetchDetails,
  fetchPrice,
} from "@/lib/utils";

// Define the schema using zod
const FormSchema = z.object({
  network: z.string({
    required_error: "Required",
  }),
  address: z.string().min(42, {
    message: "Invalid addresss",
  }),
});

import { useState } from "react";
import { DataInterface } from "../lib/utils";
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
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      network: "",
      address: "",
    },
  });

  const [data, setData] = useState<DataInterface | null>(null);
  // Handle form submission
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    const ethWizardResponse = await fetchDetails(data);
    console.log(ethWizardResponse);
  };

  const ethToUsd = data?.res.price ? data.res.price : 3010.20625;

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

  const fetchDetails = async ({
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
      const price = await fetchPrice(network);
      console.log(price.data.USD);
      const ethWizardResponse = {
        req: { network, address },
        res: {
          balanceResponse,
          transactionsResponse,
          price: price.data.USD ? price.data.USD : 2900,
        },
      };

      setData(ethWizardResponse);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-gray-800 text-white min-h-screen py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 mx-auto space-y-6"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Network</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-transparent text-white">
                      <SelectValue placeholder="Select a network" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mainnet">Ethereum Mainnet</SelectItem>
                    <SelectItem value="polygonMatic">Polygon Matic</SelectItem>
                    <SelectItem value="sepolia">Sepolia Testnet</SelectItem>
                    <SelectItem value="goerli">Goerli Testnet</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username Field */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Address</FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent text-white"
                    placeholder="0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full text-center" type="submit">
            Fetch
          </Button>
        </form>
      </Form>
      <>
        {data && (
          <Table className="text-xs sm:text-sm lg:text-base mt-20">
            <TableCaption>
              Gas fees might vary based on currency conversion
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Block Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Gas Fee</TableHead>
                <TableHead className="text-right">Txn Details</TableHead>
              </TableRow>
            </TableHeader>
            {data ? (
              <TableBody>
                {data.res.transactionsResponse.result.map(
                  (transaction, index) => (
                    <TableRow key={transaction.hash}>
                      <TableCell className="font-medium">
                        {transaction.blockNumber}
                      </TableCell>
                      <TableCell>
                        {timeStampToDate(transaction.timeStamp)}
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {(
                          (+transaction.gasPrice *
                            +transaction.gasUsed *
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
                  )
                )}
              </TableBody>
            ) : (
              <></>
            )}
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </>
      {/* <DataComponent /> */}
    </section>
  );
}
