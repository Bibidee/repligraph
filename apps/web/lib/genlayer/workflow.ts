import type {RelationClaim,Study} from './schema';

export type StudyExpected=Partial<Pick<Study,'title'|'question_text'|'method_text'|'conclusion_text'|'manifest_url'|'manifest_digest'|'publication_ref'>>;
export type ClaimExpected=Partial<Pick<RelationClaim,'source_id'|'target_id'|'claimed_relation'|'evidence_url'|'evidence_digest'>>;

const matchesExpected=(record:Record<string,unknown>,expected:Record<string,unknown>)=>Object.entries(expected).every(([key,value])=>{
  if(value===undefined)return true;
  const actual=record[key];
  if(key.endsWith('digest'))return typeof actual==='string'&&typeof value==='string'&&actual.toLowerCase()===value.toLowerCase();
  if(typeof actual==='number'||typeof value==='number')return String(actual)===String(value);
  return typeof actual==='string'&&typeof value==='string'&&actual===value;
});

export class WorkflowAmbiguityError extends Error{
  constructor(kind:'study'|'claim',count:number){super('Finalized '+kind+' could not be resolved unambiguously: '+count+' matching new records.');this.name='WorkflowAmbiguityError'}
}

export function resolveNewStudy({before,after,registrant,expected={}}:{before:Study[];after:Study[];registrant:string;expected?:StudyExpected}):Study|null{
  const known=new Set(before.map(s=>String(s.study_id)));
  const matches=after.filter(s=>!known.has(String(s.study_id))&&s.registrant.toLowerCase()===registrant.toLowerCase()&&matchesExpected(s as unknown as Record<string,unknown>,expected as Record<string,unknown>));
  if(matches.length>1)throw new WorkflowAmbiguityError('study',matches.length);
  return matches[0]??null;
}

export function resolveNewClaim({candidates,claimant,expected={}}:{candidates:RelationClaim[];claimant:string;expected?:ClaimExpected}):RelationClaim|null{
  const matches=candidates.filter(c=>c.claimant.toLowerCase()===claimant.toLowerCase()&&matchesExpected(c as unknown as Record<string,unknown>,expected as Record<string,unknown>));
  if(matches.length>1)throw new WorkflowAmbiguityError('claim',matches.length);
  return matches[0]??null;
}

export function newestStudy(before:Study[],after:Study[],registrant:string){return resolveNewStudy({before,after,registrant})}
export function newestClaim(before:RelationClaim[],after:RelationClaim[],claimant:string){
  const known=new Set(before.map(x=>String(x.claim_id)));
  return resolveNewClaim({candidates:after.filter(c=>!known.has(String(c.claim_id))),claimant});
}

export function pageOffsets(total:number,pageSize=50,maxPages=100):number[]{
  if(!Number.isInteger(total)||total<=0)return [];
  const pages=Math.min(Math.ceil(total/pageSize),maxPages);
  return Array.from({length:pages},(_,index)=>index*pageSize);
}

export const MAX_POST_WRITE_CLAIM_SCAN=100;
export const CLAIM_SCAN_BATCH_SIZE=10;
export function postWriteClaimIds(beforeCount:number,afterCount:number,max=MAX_POST_WRITE_CLAIM_SCAN):number[]{
  const range=afterCount-beforeCount;
  if(range<0||range>max)throw new Error('Your transaction finalized, but too many concurrent claims were created to resolve this claim safely. Open the finalized transaction or retry the lookup.');
  return Array.from({length:range},(_,index)=>beforeCount+index+1);
}
export function chunks<T>(items:T[],size=CLAIM_SCAN_BATCH_SIZE):T[][]{return Array.from({length:Math.ceil(items.length/size)},(_,index)=>items.slice(index*size,index*size+size))}
export async function paginateUntilShort<T>(fetchPage:(offset:number,limit:number)=>Promise<T[]>,pageSize=50,maxPages=100):Promise<{records:T[];truncated:boolean;total:number}>{
  const records:T[]=[];
  for(let page=0;page<maxPages;page++){const batch=await fetchPage(page*pageSize,pageSize);records.push(...batch);if(batch.length<pageSize)return {records,truncated:false,total:records.length}}
  return {records,truncated:true,total:records.length};
}

export type WriteStage='AWAITING_SIGNATURE'|'SUBMITTED'|'CONSENSUS_PENDING'|'FINALIZED'|'GENVM_INSPECTION'|'AUTHORITATIVE_REREAD'|'SUCCESS';
