import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {config} from './config';
export function createReadClient(){return createClient({chain:studionet});}
export function createInjectedClient(account:string){if(typeof window==='undefined'||!(window as any).ethereum)throw new Error('No injected wallet provider found.');return createClient({chain:studionet,account:account as `0x${string}`,provider:(window as any).ethereum});}
export function requireContract(){if(!config.contractAddress)throw new Error('NEXT_PUBLIC_REPLIGRAPH_CONTRACT is not configured.');return config.contractAddress as `0x${string}`;}
