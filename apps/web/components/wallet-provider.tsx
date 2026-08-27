'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {STUDIONET_CHAIN_ID_HEX} from '../lib/genlayer/constants';

type Wallet={account:string|null;chainId:string|null;connect:()=>Promise<void>;disconnect:()=>Promise<void>;switchNetwork:()=>Promise<void>;wrongNetwork:boolean;connecting:boolean;error:string|null};
const C=createContext<Wallet>({account:null,chainId:null,connect:async()=>{},disconnect:async()=>{},switchNetwork:async()=>{},wrongNetwork:false,connecting:false,error:null});
const target=STUDIONET_CHAIN_ID_HEX;

export async function hydrateWallet(provider:any):Promise<{account:string|null;chainId:string|null}>{
  let account:string|null=null,chainId:string|null=null;
  try{const accounts=await provider.request({method:'eth_accounts'});if(Array.isArray(accounts))account=accounts[0]??null}catch(_error){}
  try{const value=await provider.request({method:'eth_chainId'});if(typeof value==='string')chainId=value}catch(_error){}
  return {account,chainId};
}

function readable(error:unknown){const message=error instanceof Error?error.message:String(error);if(/user rejected|denied|rejected/i.test(message))return 'Connection request declined.';return message.length>90?message.slice(0,87)+'...':message}

export function WalletProvider({children}:{children:React.ReactNode}){
  const [account,setAccount]=useState<string|null>(null),[chainId,setChainId]=useState<string|null>(null),[connecting,setConnecting]=useState(false),[error,setError]=useState<string|null>(null);
  const connect=async()=>{const e=(window as any).ethereum;if(!e){setError('No injected wallet detected.');return}setConnecting(true);setError(null);try{const accounts=await e.request({method:'eth_requestAccounts'});if(!Array.isArray(accounts))throw new Error('Wallet returned an invalid account response.');setAccount(accounts[0]??null);setChainId(await e.request({method:'eth_chainId'}))}catch(err){setError(readable(err))}finally{setConnecting(false)}};
  const disconnect=async()=>{const e=(window as any).ethereum;setError(null);if(e){try{await e.request({method:'wallet_revokePermissions',params:[{eth_accounts:{}}]})}catch(_error){}}setAccount(null);setChainId(null)};
  const switchNetwork=async()=>{const e=(window as any).ethereum;if(!e){setError('No injected wallet detected.');return}try{await e.request({method:'wallet_switchEthereumChain',params:[{chainId:target}]});setChainId(await e.request({method:'eth_chainId'}));setError(null)}catch(err){setError(readable(err))}};
  useEffect(()=>{const e=(window as any).ethereum;if(!e)return;let active=true;void hydrateWallet(e).then(session=>{if(active){setAccount(session.account);setChainId(session.chainId)}});const ac=(accounts:string[])=>setAccount(accounts?.[0]??null),ch=(value:string)=>setChainId(value),dc=()=>{setAccount(null);setChainId(null)};e.on?.('accountsChanged',ac);e.on?.('chainChanged',ch);e.on?.('disconnect',dc);return()=>{active=false;e.removeListener?.('accountsChanged',ac);e.removeListener?.('chainChanged',ch);e.removeListener?.('disconnect',dc)}},[]);
  return <C.Provider value={useMemo(()=>({account,chainId,connect,disconnect,switchNetwork,wrongNetwork:!!chainId&&chainId.toLowerCase()!==target,connecting,error}),[account,chainId,connecting,error])}>{children}</C.Provider>
}
export const useWallet=()=>useContext(C);
