'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
type Wallet={account:string|null;chainId:string|null;connect:()=>Promise<void>;switchNetwork:()=>Promise<void>;wrongNetwork:boolean};
const C=createContext<Wallet>({account:null,chainId:null,connect:async()=>{},switchNetwork:async()=>{},wrongNetwork:false});
export function WalletProvider({children}:{children:React.ReactNode}){const [account,setAccount]=useState<string|null>(null);const [chainId,setChainId]=useState<string|null>(null);const target='0xf22f';
const connect=async()=>{const e=(window as any).ethereum;if(!e) return;const a=await e.request({method:'eth_requestAccounts'});setAccount(a?.[0]??null);setChainId(await e.request({method:'eth_chainId'}));};
const switchNetwork=async()=>{const e=(window as any).ethereum;if(e) await e.request({method:'wallet_switchEthereumChain',params:[{chainId:target}]});};
useEffect(()=>{const e=(window as any).ethereum;if(!e)return;const ac=(a:string[])=>setAccount(a?.[0]??null);const ch=(c:string)=>setChainId(c);e.on?.('accountsChanged',ac);e.on?.('chainChanged',ch);e.on?.('disconnect',()=>{setAccount(null);setChainId(null)});return()=>{e.removeListener?.('accountsChanged',ac);e.removeListener?.('chainChanged',ch)}},[]);
return <C.Provider value={useMemo(()=>({account,chainId,connect,switchNetwork,wrongNetwork:!!chainId&&chainId.toLowerCase()!==target}),[account,chainId])}>{children}</C.Provider>}
export const useWallet=()=>useContext(C);
