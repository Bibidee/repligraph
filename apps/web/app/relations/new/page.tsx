'use client';
import {Suspense,useEffect,useMemo,useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {Chrome} from '../../../components/chrome';
import {useWallet} from '../../../components/wallet-provider';
import {TransactionFinalityPendingError,writeContract} from '../../../lib/genlayer/contract';
import {config} from '../../../lib/genlayer/config';
import {getCounts,getRelation,listAllStudies} from '../../../lib/genlayer/data-source';
import {chunks,postWriteClaimIds,resolveNewClaim} from '../../../lib/genlayer/workflow';
import type {Study,RelationClaim} from '../../../lib/genlayer/schema';

function Form(){
  const q=useSearchParams(),w=useWallet(),router=useRouter();
  const [studies,setStudies]=useState<Study[]>([]),[source,setSource]=useState(q.get('source')||''),[target,setTarget]=useState(q.get('target')||''),[relation,setRelation]=useState('DIRECT_REPLICATION'),[evidence,setEvidence]=useState(''),[digest,setDigest]=useState(''),[state,setState]=useState(''),[busy,setBusy]=useState(false),[submittedHash,setSubmittedHash]=useState('');
  useEffect(()=>{listAllStudies().then(setStudies).catch(error=>setState(error instanceof Error?error.message:'Studies unavailable.'))},[]);
  const sourceStudy=useMemo(()=>studies.find(s=>String(s.study_id)===source),[studies,source]),targetStudy=useMemo(()=>studies.find(s=>String(s.study_id)===target),[studies,target]);
  const submit=async(event:React.FormEvent)=>{event.preventDefault();if(busy)return;if(!sourceStudy||!targetStudy||source===target){setState('Select two distinct live studies.');return}if(!w.account){setState('Connect an injected wallet first.');return}setBusy(true);setSubmittedHash('');try{
    const before=(await getCounts()).claim_count;
    setState('AWAITING_SIGNATURE');
    const tx=await writeContract(w.account,'claim_relation',[Number(source),Number(target),relation,evidence,digest],{onSubmitted:(hash)=>{setSubmittedHash(hash);setState('TRANSACTION_SUBMITTED · Waiting for StudioNet finality. Do not resubmit.')}});
    setSubmittedHash(String(tx.hash));
    setState('AUTHORITATIVE_REREAD');
    const after=(await getCounts()).claim_count;
    const ids=postWriteClaimIds(before,after);
    const candidates=(await Promise.all(chunks(ids).map(async batch=>(await Promise.all(batch.map(id=>getRelation(String(id))))).filter((claim):claim is RelationClaim=>claim!==null)))).flat();
    const claim=resolveNewClaim({candidates,claimant:w.account,expected:{source_id:Number(source),target_id:Number(target),claimed_relation:relation,evidence_url:evidence,evidence_digest:digest}});
    if(!claim)throw new Error('Finalized claim could not be resolved authoritatively.');
    setState('SUCCESS');router.push('/relations/'+claim.claim_id);
  }catch(error){
    if(error instanceof TransactionFinalityPendingError){setSubmittedHash(error.hash);setState('StudioNet is still finalizing this submitted relation claim. Do not submit it again. Check the transaction in the explorer and continue after it finalizes.');return}
    setState(error instanceof Error?error.message:'Claim failed.');setBusy(false)
  }};
  return <main><Chrome/><div className="page-shell"><p className="eyebrow">Relation comparison</p><h1 className="page-title">Compare immutable study versions</h1><form onSubmit={submit} className="mt-6"><div className="grid md:grid-cols-2 gap-4"><label className="panel p-5">Source study<select required value={source} onChange={e=>setSource(e.target.value)} className="mt-2"><option value="">Select source</option>{studies.map(s=><option key={String(s.study_id)} value={String(s.study_id)}>#{s.study_id} v{s.version}: {s.title}</option>)}</select></label><label className="panel p-5">Target study<select required value={target} onChange={e=>setTarget(e.target.value)} className="mt-2"><option value="">Select target</option>{studies.map(s=><option key={String(s.study_id)} value={String(s.study_id)}>#{s.study_id} v{s.version}: {s.title}</option>)}</select></label></div>{sourceStudy&&targetStudy&&<div className="matrix mt-5"><strong>Field</strong><strong>Source · v{sourceStudy.version}</strong><strong>Target · v{targetStudy.version}</strong>{[['Question','question_text'],['Method','method_text'],['Conclusion','conclusion_text']].flatMap(([label,key])=>[<strong key={key+'-l'}>{label}</strong>,<span key={key+'-s'}>{sourceStudy[key as keyof Study]}</span>,<span key={key+'-t'}>{targetStudy[key as keyof Study]}</span>])}</div>}<section className="panel p-5 mt-5"><label>Claimed relation<select value={relation} onChange={e=>setRelation(e.target.value)} className="mt-2">{['DIRECT_REPLICATION','MATERIAL_VARIANT','EXTENSION','CONTRADICTORY_RESULT','INCOMPARABLE'].map(value=><option key={value}>{value}</option>)}</select></label><label className="block mt-4">Evidence URL<input required type="url" value={evidence} onChange={e=>setEvidence(e.target.value)} className="mt-2"/></label><p className="muted text-sm mt-2">Use a publicly retrievable HTTPS evidence URL. Raw ipfs:// retrieval may depend on runtime support.</p><label className="block mt-4">Evidence SHA-256<input required pattern="[A-Fa-f0-9]{64}" value={digest} onChange={e=>setDigest(e.target.value)} className="mt-2 hash"/></label></section><button type="submit" disabled={busy} className="button mt-4">{busy?'Processing':'Submit relation claim'}</button>{state&&<p aria-live="polite" className="status-box">{state}</p>}{submittedHash&&<a className="button secondary inline-block mt-3" target="_blank" rel="noreferrer" href={`${config.explorer}/tx/${submittedHash}`}>Open submitted transaction</a>}</form></div></main>
}
export default function NewRelation(){return <Suspense fallback={<p>Loading live studies...</p>}><Form/></Suspense>}
