'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useWallet} from '../../../components/wallet-provider';
import {writeContract} from '../../../lib/genlayer/contract';
import {listAllStudies} from '../../../lib/genlayer/data-source';
import {resolveNewStudy} from '../../../lib/genlayer/workflow';
import {fetchAdvisoryMetadata} from '../../../lib/metadata';
import {Chrome} from '../../../components/chrome';

export default function NewStudy(){
  const w=useWallet(),router=useRouter();
  const [form,setForm]=useState({title:'',question:'',method:'',conclusion:'',url:'',digest:'',publication:''});
  const [identifier,setIdentifier]=useState(''),[state,setState]=useState(''),[busy,setBusy]=useState(false);
  const update=(key:string)=>(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>setForm({...form,[key]:event.target.value});
  const lookup=async()=>{setState('Fetching advisory metadata...');try{const m=await fetchAdvisoryMetadata(identifier);setForm(value=>({...value,title:m.title||value.title,publication:m.publication||value.publication,url:m.manifestUrl||value.url}));setState('Metadata loaded for review. Nothing is submitted automatically.')}catch(error){setState(error instanceof Error?error.message:'Metadata lookup failed.')}};
  const submit=async(event:React.FormEvent)=>{event.preventDefault();if(busy)return;if(!w.account){setState('Connect an injected wallet before registering.');return}setBusy(true);try{
    setState('AWAITING_SIGNATURE');
    const before=await listAllStudies();
    setState('CONSENSUS_PENDING');
    await writeContract(w.account,'register_study',[form.title,form.question,form.method,form.conclusion,form.url,form.digest,form.publication]);
    setState('AUTHORITATIVE_REREAD');
    const created=resolveNewStudy({before,after:await listAllStudies(),registrant:w.account,expected:{title:form.title,question_text:form.question,method_text:form.method,conclusion_text:form.conclusion,manifest_url:form.url,manifest_digest:form.digest,publication_ref:form.publication}});
    if(!created)throw new Error('Finalized registration could not be resolved authoritatively.');
    setState('SUCCESS');router.push('/studies/'+created.study_id);
  }catch(error){setState(error instanceof Error?error.message:'Registration failed.');setBusy(false)}};
  return <main><Chrome/><div className="page-shell"><p className="eyebrow">Study registration sheet</p><h1 className="page-title">Freeze a public experiment</h1>
    <section className="panel p-5 mt-6"><label htmlFor="metadata">Advisory DOI or GitHub metadata</label><div className="flex gap-2 mt-2 flex-wrap"><input id="metadata" value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="10.xxxx/... or https://github.com/owner/repo"/><button type="button" className="button secondary" onClick={lookup}>Fetch metadata</button></div><p className="muted text-sm mt-2">Review every fetched value. External metadata is advisory and never becomes authoritative automatically.</p></section>
    <form onSubmit={submit} className="grid lg:grid-cols-[1fr_300px] gap-6 mt-6"><div className="panel p-6 space-y-5"><label>Title<input required maxLength={240} value={form.title} onChange={update('title')} className="mt-2"/></label>{[['question','Question'],['method','Method'],['conclusion','Conclusion']].map(([key,label])=><label key={key}>{label}<textarea required maxLength={4000} value={(form as any)[key]} onChange={update(key)} rows={5} className="mt-2"/></label>)}<label>Publication reference<input required maxLength={240} value={form.publication} onChange={update('publication')} className="mt-2"/></label></div><aside><div className="panel p-5"><label>Manifest URL<input required value={form.url} onChange={update('url')} className="mt-2"/></label><label className="block mt-4">SHA-256 digest<input required pattern="[A-Fa-f0-9]{64}" value={form.digest} onChange={update('digest')} className="mt-2 hash"/></label><p className="muted text-sm mt-3">The URL and digest are bound to immutable version 1.</p></div><button disabled={busy} className="w-full mt-4">{busy?'Processing':'Register study'}</button>{state&&<p aria-live="polite" className="status-box">{state}</p>}</aside></form>
  </div></main>;
}
