'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useWallet} from './wallet-provider';
import {TransactionFinalityPendingError,writeContract} from '../lib/genlayer/contract';
import {config} from '../lib/genlayer/config';
import {getRelation} from '../lib/genlayer/data-source';
export function AdjudicateAction({claimId,status}:{claimId:number|string;status:string}){
 const w=useWallet(); const router=useRouter(); const [state,setState]=useState(''),[busy,setBusy]=useState(false),[submittedHash,setSubmittedHash]=useState('');
 if(status!=='RELATION_CLAIMED' && status!=='REVIEW_RETRYABLE') return null;
 const retry=status==='REVIEW_RETRYABLE';
 const run=async()=>{if(busy)return;if(!w.account){setState('Connect a wallet first.');return}if(w.wrongNetwork){setState('Switch to StudioNet before adjudicating.');return}setBusy(true);setSubmittedHash('');setState('Waiting for wallet signature...');try{const tx=await writeContract(w.account,'adjudicate_relation',[Number(claimId)],{onSubmitted:(hash)=>{setSubmittedHash(hash);setState('Transaction submitted. Waiting for finalized consensus. Do not resubmit.')}});setSubmittedHash(String(tx.hash));const authoritative=await getRelation(String(claimId));if(!authoritative)throw new Error('Finalized transaction did not produce a readable claim.');if(authoritative.status==='REVIEW_RETRYABLE'){setState('Review could not complete because nondeterministic evaluation was temporarily unavailable. You can retry.');setBusy(false)}else if(authoritative.status==='EVIDENCE_INVALID')setState('Evidence failed integrity verification and cannot be adjudicated.');else if(authoritative.status==='INSUFFICIENT')setState('Validators completed review but found insufficient basis for a substantive relation.');else setState(`Authoritative result: ${authoritative.final_relation} · tx ${tx.hash}`);router.refresh()}catch(e){if(e instanceof TransactionFinalityPendingError){setSubmittedHash(e.hash);setState('StudioNet is still finalizing this adjudication. Do not run adjudication again. Check the submitted transaction in the explorer, then refresh this relation after it finalizes.');return}setState(e instanceof Error?e.message:'Adjudication failed.');setBusy(false)}};
 return <div className="mt-4"><button disabled={busy} onClick={run} className="bg-[#1d5aa5] text-white px-4 py-3 disabled:opacity-60">{busy?'Finalizing…':retry?'Retry adjudication':'Run adjudication'}</button>{state&&<p role="status" className="mt-3 text-sm border-l-2 border-[#b44f36] pl-3">{state}</p>}{submittedHash&&<a className="button secondary inline-block mt-3" target="_blank" rel="noreferrer" href={`${config.explorer}/tx/${submittedHash}`}>Open submitted transaction</a>}</div>;
}
