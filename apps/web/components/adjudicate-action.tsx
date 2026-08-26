'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useWallet} from './wallet-provider';
import {writeContract} from '../lib/genlayer/contract';
import {getRelation} from '../lib/genlayer/data-source';
export function AdjudicateAction({claimId,status}:{claimId:number|string;status:string}){
 const w=useWallet(); const router=useRouter(); const [state,setState]=useState('');
 if(status!=='RELATION_CLAIMED') return null;
 const run=async()=>{if(!w.account){setState('Connect a wallet first.');return}if(w.wrongNetwork){setState('Switch to StudioNet before adjudicating.');return}setState('Waiting for finalized consensus…');try{const tx=await writeContract(w.account,'adjudicate_relation',[Number(claimId)]);const authoritative=await getRelation(String(claimId));if(!authoritative)throw new Error('Finalized transaction did not produce a readable claim.');setState(authoritative.status==='INSUFFICIENT'?'Consensus returned INSUFFICIENT.':`Authoritative result: ${authoritative.final_relation} · tx ${tx.hash}`);router.refresh()}catch(e){setState(e instanceof Error?e.message:'Adjudication failed.')}};
 return <div className="mt-4"><button onClick={run} className="bg-[#1d5aa5] text-white px-4 py-3">Run adjudication</button>{state&&<p role="status" className="mt-3 text-sm border-l-2 border-[#b44f36] pl-3">{state}</p>}</div>;
}
