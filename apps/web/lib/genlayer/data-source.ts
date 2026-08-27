import {config} from './config';
import {readContract as readLiveContract} from './contract';
import {DataSourceError,parseEdge,parseEdges,parseNeighbors,parseRelationClaim,parseStudies,parseStudy,type Edge,type Neighbor,type RelationClaim,type Study} from './schema';
import {pageOffsets} from './workflow';
export const unavailable=()=>({kind:'unavailable' as const,reason:config.contractAddress?'The StudioNet contract could not be read.':'Configure NEXT_PUBLIC_REPLIGRAPH_CONTRACT to connect this live surface.'});
async function raw(method:string,args:unknown[]=[]):Promise<unknown>{if(!config.contractAddress)throw new DataSourceError('READ_UNAVAILABLE',unavailable().reason);try{return await readLiveContract<unknown>(method,args)}catch(error){if(error instanceof DataSourceError)throw error;throw new DataSourceError('READ_UNAVAILABLE',error instanceof Error?error.message:'StudioNet read unavailable.')}}
function nullable<T>(value:unknown,label:string,parse:(v:unknown)=>T):T|null{if(value==null)return null;try{return parse(value)}catch(error){if(error instanceof DataSourceError)throw error;throw new DataSourceError('MALFORMED_RESPONSE',`Malformed ${label} response.`)}}
export async function getStudy(id:string):Promise<Study|null>{return nullable(await raw('get_study',[Number(id)]),'study',parseStudy)}
export async function getStudyVersion(id:string,version:number):Promise<Study|null>{return nullable(await raw('get_study_version',[Number(id),Number(version)]),'study',parseStudy)}
export async function listStudies(offset=0,limit=50):Promise<Study[]>{return parseStudies(await raw('list_studies',[offset,limit]))}
export async function listAllStudies():Promise<Study[]>{const counts=await getCounts();const pages=await Promise.all(pageOffsets(counts.study_count).map(offset=>listStudies(offset,50)));return pages.flat()}
export async function getRelation(id:string):Promise<RelationClaim|null>{return nullable(await raw('get_relation',[Number(id)]),'relation',parseRelationClaim)}
export async function getEdge(id:string):Promise<Edge|null>{return nullable(await raw('get_edge',[Number(id)]),'edge',parseEdge)}
export async function getCounts():Promise<{study_count:number;claim_count:number;edge_count:number}>{const value=await raw('get_counts');if(!value||typeof value!=='object'||Array.isArray(value))throw new DataSourceError('MALFORMED_RESPONSE','Malformed count response.');const v=value as Record<string,unknown>;const counts={study_count:Number(v.study_count),claim_count:Number(v.claim_count),edge_count:Number(v.edge_count)};if(Object.values(counts).some(n=>!Number.isInteger(n)||n<0))throw new DataSourceError('MALFORMED_RESPONSE','Malformed count response.');return counts}
export async function listEdges(id:string):Promise<Edge[]>{return parseEdges(await raw('list_edges',[Number(id),0,50]))}
export async function listEdgesGlobal(offset=0,limit=50):Promise<Edge[]>{return parseEdges(await raw('list_edges_global',[offset,limit]))}
export async function listAllEdgesGlobal():Promise<Edge[]>{const counts=await getCounts();const pages=await Promise.all(pageOffsets(counts.edge_count).map(offset=>listEdgesGlobal(offset,50)));return pages.flat()}
export async function searchRelated(id:string,field:string,k=8):Promise<Neighbor[]>{return parseNeighbors(await raw('search_related',[Number(id),field,k]))}
export {DataSourceError};
