'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useWallet} from './wallet-provider';
import {writeContract} from '../lib/genlayer/contract';
import {getRelation} from '../lib/genlayer/data-source';
export function AdjudicateAction({claimId,status}:{claimId:number|string;status:string}){
 const w=useWallet(); const router=useRouter(); const [state,setState]=useState('');
 if(status!=='RELATION_CLAIMED' && status!=='REVIEW_RETRYABLE') return null;
 const retry=status==='REVIEW_RETRYABLE';
 const run=async()=>{if(!w.account){setState('Connect a wallet first.');return}if(w.wrongNetwork){setState('Switch to StudioNet before adjudicating.');return}setState('Waiting for finalized consensus...');try{const tx=await writeContract(w.account,'adjudicate_relation',[Number(claimId)]);const authoritative=await getRelation(String(claimId));if(!authoritative)throw new Error('Finalized transaction did not produce a readable claim.');if(authoritative.status==='REVIEW_RETRYABLE')setState('Review could not complete because nondeterministic evaluation was temporarily unavailable. You can retry.');else if(authoritative.status==='EVIDENCE_INVALID')setState('Evidence failed integrity verification and cannot be adjudicated.');else if(authoritative.status==='INSUFFICIENT')setState('Validators completed review but found insufficient basis for a substantive relation.');else setState(`Authoritative result: ${authoritative.final_relation} · tx ${tx.hash}`);router.refresh()}catch(e){setState(e instanceof Error?e.message:'Adjudication failed.')}};
 return <div className="mt-4"><button onClick={run} className="bg-[#1d5aa5] text-white px-4 py-3">{retry?'Retry adjudication':'Run adjudication'}</button>{state&&<p role="status" className="mt-3 text-sm border-l-2 border-[#b44f36] pl-3">{state}</p>}</div>;
}
