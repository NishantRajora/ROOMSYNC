import { ethers } from 'ethers';

export const AGREEMENT_REGISTRY_ABI = [
  "function register(bytes32 hash) external",
  "function get(bytes32 hash) external view returns (tuple(address registrant, uint256 timestamp))",
  "event Registered(bytes32 indexed hash, address indexed registrant, uint256 timestamp)"
];

// Fallback to localhost if not specified in env
export const DEFAULT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

export interface Record {
  registrant: string;
  timestamp: number;
}

/**
 * Request connection to MetaMask / injected provider.
 * Returns the signer instance.
 */
export async function connectWallet(): Promise<ethers.Signer> {
  if (!(window as any).ethereum) {
    throw new Error("No Ethereum provider found. Please install MetaMask or a compatible wallet.");
  }
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner();
}

/**
 * Creates and returns the AgreementRegistry contract instance.
 */
export function getContract(
  signerOrProvider: ethers.Signer | ethers.Provider,
  address: string = DEFAULT_CONTRACT_ADDRESS
): ethers.Contract {
  return new ethers.Contract(address, AGREEMENT_REGISTRY_ABI, signerOrProvider);
}

/**
 * Helper to ensure hash string is a valid bytes32 format.
 * If the string does not have a 0x prefix, it adds it.
 */
export function hashToBytes32(hexHash: string): string {
  const hash = hexHash.startsWith('0x') ? hexHash : `0x${hexHash}`;
  if (hash.length !== 66) {
    throw new Error("Invalid hash length. Must be a 32-byte hex string (66 characters including 0x).");
  }
  return hash;
}

/**
 * Registers an agreement hash on-chain.
 */
export async function registerHash(hash: string, contractAddress?: string): Promise<ethers.ContractTransactionReceipt | null> {
  const signer = await connectWallet();
  const contract = getContract(signer, contractAddress);
  const bytes32Hash = hashToBytes32(hash);
  
  const tx = await contract.register(bytes32Hash);
  return await tx.wait();
}

/**
 * Verifies if an agreement hash is registered on-chain.
 */
export async function verifyHash(hash: string, contractAddress?: string): Promise<Record | null> {
  let provider;
  if ((window as any).ethereum) {
    provider = new ethers.BrowserProvider((window as any).ethereum);
  } else {
    // Fallback to localhost HTTP provider for read-only if no wallet
    provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  }
  
  const contract = getContract(provider, contractAddress);
  const bytes32Hash = hashToBytes32(hash);
  
  const record = await contract.get(bytes32Hash);
  
  // If timestamp is 0, it means it's not registered
  if (Number(record.timestamp) === 0) {
    return null;
  }
  
  return {
    registrant: record.registrant,
    timestamp: Number(record.timestamp)
  };
}
