export type ChainScalar = string | number;
export type Study={study_id:ChainScalar;registrant:string;title:string;question_text:string;method_text:string;conclusion_text:string;manifest_url:string;manifest_digest:string;publication_ref:string;version:ChainScalar;created_at:ChainScalar};
export type RelationClaim={claim_id:ChainScalar;source_id:ChainScalar;target_id:ChainScalar;source_version:ChainScalar;target_version:ChainScalar;claimant:string;claimed_relation:string;evidence_url:string;evidence_digest:string;status:string;final_relation:string;outcome_class:string;rationale:string;reviewed_at:ChainScalar};
export type Edge={edge_id:ChainScalar;claim_id:ChainScalar;source_id:ChainScalar;target_id:ChainScalar;source_version:ChainScalar;target_version:ChainScalar;relation_code:string;rationale:string;accepted_at:ChainScalar};
export type Neighbor={study_id:ChainScalar;field_kind:string;version:ChainScalar;distance:number;title:string};

export class DataSourceError extends Error {
  constructor(public readonly kind:'NOT_FOUND'|'READ_UNAVAILABLE'|'MALFORMED_RESPONSE',message:string){super(message);this.name='DataSourceError'}
}
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const scalar=(value:unknown):value is ChainScalar=>typeof value==='string'||typeof value==='number';
const stringValue=(value:unknown):value is string=>typeof value==='string';
function requireRecord(value:unknown,label:string){if(!record(value))throw new DataSourceError('MALFORMED_RESPONSE',`Malformed ${label} response.`);return value}
function requireFields(value:Record<string,unknown>,label:string,fields:Record<string,(v:unknown)=>boolean>){for(const [key,check] of Object.entries(fields))if(!check(value[key]))throw new DataSourceError('MALFORMED_RESPONSE',`Malformed ${label} response: invalid ${key}.`)}
const studyFields={study_id:scalar,registrant:stringValue,title:stringValue,question_text:stringValue,method_text:stringValue,conclusion_text:stringValue,manifest_url:stringValue,manifest_digest:stringValue,publication_ref:stringValue,version:scalar,created_at:scalar};
const claimFields={claim_id:scalar,source_id:scalar,target_id:scalar,source_version:scalar,target_version:scalar,claimant:stringValue,claimed_relation:stringValue,evidence_url:stringValue,evidence_digest:stringValue,status:stringValue,final_relation:stringValue,outcome_class:stringValue,rationale:stringValue,reviewed_at:scalar};
const edgeFields={edge_id:scalar,claim_id:scalar,source_id:scalar,target_id:scalar,source_version:scalar,target_version:scalar,relation_code:stringValue,rationale:stringValue,accepted_at:scalar};
export function parseStudy(value:unknown):Study{const v=requireRecord(value,'study');requireFields(v,'study',studyFields);return v as Study}
export function parseRelationClaim(value:unknown):RelationClaim{const v=requireRecord(value,'relation');requireFields(v,'relation',claimFields);return v as RelationClaim}
export function parseEdge(value:unknown):Edge{const v=requireRecord(value,'edge');requireFields(v,'edge',edgeFields);return v as Edge}
export function parseNeighbor(value:unknown):Neighbor{const v=requireRecord(value,'neighbor');requireFields(v,'neighbor',{study_id:scalar,field_kind:stringValue,version:scalar,title:stringValue});const distance=Number(v.distance);if(!Number.isFinite(distance)||distance<0)throw new DataSourceError('MALFORMED_RESPONSE','Malformed neighbor response: invalid distance.');return {...v,distance} as Neighbor}
function arrayOf<T>(value:unknown,label:string,parse:(item:unknown)=>T):T[]{if(!Array.isArray(value))throw new DataSourceError('MALFORMED_RESPONSE',`Malformed ${label} list response.`);return value.map(parse)}
export const parseStudies=(value:unknown)=>arrayOf(value,'study',parseStudy);
export const parseEdges=(value:unknown)=>arrayOf(value,'edge',parseEdge);
export const parseNeighbors=(value:unknown)=>arrayOf(value,'neighbor',parseNeighbor);
