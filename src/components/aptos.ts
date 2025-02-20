import { createSurfClient } from "@thalalabs/surf";
import { Aptos, AptosConfig, Network, Account } from "@aptos-labs/ts-sdk";
import { ABI } from "./abi"; // Ensure ABI contains your contract ABI
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Create an Aptos client for the DEVNET
export const aptos = new Aptos(new AptosConfig({ network: Network.DEVNET }));

// Create a SurfClient with the Aptos client and ABI
export const surfClient = createSurfClient(aptos).useABI(ABI);

export const depositAPT = async (amount: number) => {
  try {
    const { account } = useWallet();

    if (!account) {
      console.error("Wallet not connected!");
      return;
    }

    console.log("Connected Account:", account.address);

    // Execute the deposit function using Surf
    const result = await surfClient.entry.deposit({
      functionArguments: [amount], // Pass deposit amount
      typeArguments: [], // Specify APT type
      account: account as unknown as Account, // Connected wallet account
    });

    console.log("Deposit successful:", result);
    return result;
  } catch (error) {
    console.error("Deposit failed:", error);
  }
};
