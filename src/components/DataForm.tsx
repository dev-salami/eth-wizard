"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "@/components/ui/use-toast";
import { useFetch } from "@/lib/useFetch";
import { fetchDetails } from "@/lib/utils";

// Define the schema using zod
const FormSchema = z.object({
  network: z.string({
    required_error: "Required",
  }),
  address: z.string().min(42, {
    message: "Invalid addresss",
  }),
});

export function DataForm() {
  // Initialize the form with useForm and zodResolver
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      network: "",
      address: "",
    },
  });

  // Handle form submission
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    fetchDetails(data);
  }

  return (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button type="submit">Fetch</Button>
      </form>
    </Form>
  );
}
