import {TransactionStatus} from 'genlayer-js/types';
import {createInjectedClient,createReadClient,requireContract} from './client';
import {inspectExecution} from './execution';
import {STUDIONET_CHAIN_ID_HEX} from './constants';

export const FINALITY_WAIT_INTERVAL_MS=5_000;
export const FINALITY_WAIT_RETRIES=120;

export class TransactionFinalityPendingError extends Error{
 readonly hash:string;
 constructor(hash:string){
  super(`Transaction submitted and may still be finalizing on StudioNet. Do not resubmit. Transaction: ${hash}`);
  this.name='TransactionFinalityPendingError';
  this.hash=hash;
 }
}

type WriteContractOptions={onSubmitted?:(hash:string)=>void};

export async function validateSigningContext(provider:any,account:string){if(!provider)throw new Error('No injected wallet provider found.');const chainId=await provider.request({method:'eth_chainId'});if(String(chainId).toLowerCase()!==STUDIONET_CHAIN_ID_HEX)throw new Error('Wrong network. Switch your wallet to StudioNet (chain 61999) before signing.');const accounts=await provider.request({method:'eth_accounts'});if(!Array.isArray(accounts)||accounts.length===0)throw new Error('Wallet has no currently authorized account. Reconnect before signing.');const expected=String(account).toLowerCase(),current=String(accounts[0]).toLowerCase();if(current!==expected)throw new Error('Wallet account changed. Review the active account before signing.');return current}
export async function readContract<T>(functionName:string,args:unknown[]=[]):Promise<T>{const client=createReadClient();return client.readContract({address:requireContract(),functionName,args:args as any[]}) as Promise<T>}
export async function writeContract(account:string,functionName:string,args:unknown[]=[],options:WriteContractOptions={}){
 const provider=(window as any).ethereum;
 const current=await validateSigningContext(provider,account);
 const client=createInjectedClient(current);
 const hash=await client.writeContract({address:requireContract(),functionName,args:args as any[],value:BigInt(0)});
 options.onSubmitted?.(String(hash));
 let receipt;
 try{
  receipt=await client.waitForTransactionReceipt({hash,status:TransactionStatus.FINALIZED,interval:FINALITY_WAIT_INTERVAL_MS,retries:FINALITY_WAIT_RETRIES});
 }catch(_error){
  throw new TransactionFinalityPendingError(String(hash));
 }
 const execution=inspectExecution(receipt);
 if(!execution.ok)throw new Error(execution.kind==='GENVM_ROLLBACK'?'Finalized transaction rolled back in GenVM.':'Consensus is not complete.');
 return {hash,receipt};
}
