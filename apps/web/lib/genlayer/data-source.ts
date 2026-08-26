import {config} from './config'; import type {Study,Edge,RelationClaim,Neighbor} from './schema'; import {readContract as readLiveContract} from './contract';
export const unavailable=()=>({kind:'unavailable' as const,reason:config.contractAddress?'The StudioNet contract could not be read.':'Configure NEXT_PUBLIC_REPLIGRAPH_CONTRACT to connect this live surface.'});
export async function readContract<T>(method:string,args:unknown[]=[]):Promise<T>{if(!config.contractAddress)throw new Error(unavailable().reason);return readLiveContract<T>(method,args)}
export async function getStudy(id:string):Promise<Study>{return readContract('get_study',[Number(id)])}
export async function getStudyVersion(id:string,version:number):Promise<Study>{return readContract('get_study_version',[Number(id),Number(version)])}
export async function listStudies(offset=0,limit=50):Promise<Study[]>{return readContract('list_studies',[offset,limit])}
export async function getRelation(id:string):Promise<RelationClaim>{return readContract('get_relation',[Number(id)])}
export async function listEdges(id:string):Promise<Edge[]>{return readContract('list_edges',[Number(id),0,50])}
export async function listEdgesGlobal(offset=0,limit=50):Promise<Edge[]>{return readContract('list_edges_global',[offset,limit])}
export async function searchRelated(id:string,field:string):Promise<Neighbor[]>{return readContract('search_related',[Number(id),field,8])}
