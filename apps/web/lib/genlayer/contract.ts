import {TransactionStatus} from 'genlayer-js/types'; import {createInjectedClient,createReadClient,requireContract} from './client'; import {inspectExecution} from './execution';
export async function readContract<T>(functionName:string,args:unknown[]=[]):Promise<T>{const client=createReadClient();return client.readContract({address:requireContract(),functionName,args:args as any[]}) as Promise<T>}
export async function writeContract(account:string,functionName:string,args:unknown[]=[]){
 const provider=(window as any).ethereum;
 if(!provider) throw new Error('No injected wallet provider found.');
 const chainId=await provider.request({method:'eth_chainId'});
 if(String(chainId).toLowerCase()!=='0xf21f') throw new Error('Wrong network. Switch your wallet to StudioNet (chain 61999) before signing.');
 const client=createInjectedClient(account);const hash=await client.writeContract({address:requireContract(),functionName,args:args as any[],value:BigInt(0)});const receipt=await client.waitForTransactionReceipt({hash,status:TransactionStatus.FINALIZED});const execution=inspectExecution(receipt);if(!execution.ok)throw new Error(execution.kind==='GENVM_ROLLBACK'?'Finalized transaction rolled back in GenVM.':'Consensus is not complete.');return {hash,receipt};}
