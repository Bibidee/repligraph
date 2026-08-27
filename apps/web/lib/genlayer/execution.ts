import {ExecutionResult} from 'genlayer-js/types';

export type ExecutionInspection={ok:true;kind:'SUCCESS'}|{ok:false;kind:'GENVM_ROLLBACK'|'EXECUTION_EVIDENCE_UNAVAILABLE'|'CONSENSUS_PENDING';detail?:string};

const asReceipts=(value:unknown):Record<string,unknown>[]=>{
  if(Array.isArray(value))return value.filter((item):item is Record<string,unknown>=>!!item&&typeof item==='object');
  return value&&typeof value==='object'?[value as Record<string,unknown>]:[];
};

export function inspectExecution(receipt:any):ExecutionInspection{
  const name=receipt?.txExecutionResultName;
  if(name===ExecutionResult.FINISHED_WITH_RETURN)return {ok:true,kind:'SUCCESS'};
  if(name===ExecutionResult.FINISHED_WITH_ERROR)return {ok:false,kind:'GENVM_ROLLBACK'};
  if(typeof name==='string'&&/TIMEOUT|NONDET_DISAGREE|ROLLBACK|FAILED|ERROR/i.test(name))return {ok:false,kind:'GENVM_ROLLBACK',detail:name};
  const evidence=asReceipts(receipt?.consensus_data?.leader_receipt);
  const executionValues=evidence.map(item=>String(item.execution_result??'').toUpperCase()).filter(Boolean);
  if(executionValues.some(value=>value==='SUCCESS'))return {ok:true,kind:'SUCCESS'};
  if(executionValues.some(value=>/ERROR|FAILED|ROLLBACK|TIMEOUT|DISAGREE/i.test(value)))return {ok:false,kind:'GENVM_ROLLBACK',detail:executionValues.join(',')};
  return {ok:false,kind:'EXECUTION_EVIDENCE_UNAVAILABLE'};
}
