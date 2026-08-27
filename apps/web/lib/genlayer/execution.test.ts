import {describe,expect,it} from 'vitest';
import {ExecutionResult} from 'genlayer-js/types';
import {inspectExecution} from './execution';

describe('GenVM execution normalization',()=>{
  it('accepts top-level finalized execution return',()=>expect(inspectExecution({txExecutionResultName:ExecutionResult.FINISHED_WITH_RETURN})).toMatchObject({ok:true,kind:'SUCCESS'}));
  it('rejects top-level rollback',()=>expect(inspectExecution({txExecutionResultName:ExecutionResult.FINISHED_WITH_ERROR})).toMatchObject({ok:false,kind:'GENVM_ROLLBACK'}));
  it('accepts a Studio leader receipt array',()=>expect(inspectExecution({consensus_data:{leader_receipt:[{execution_result:'SUCCESS'}]}})).toMatchObject({ok:true,kind:'SUCCESS'}));
  it('accepts a single Studio leader receipt object',()=>expect(inspectExecution({consensus_data:{leader_receipt:{execution_result:'SUCCESS'}}})).toMatchObject({ok:true,kind:'SUCCESS'}));
  it('classifies explicit Studio execution errors',()=>expect(inspectExecution({consensus_data:{leader_receipt:[{execution_result:'ERROR'}]}})).toMatchObject({ok:false,kind:'GENVM_ROLLBACK'}));
  it('does not call missing execution evidence consensus incomplete',()=>expect(inspectExecution({})).toMatchObject({ok:false,kind:'EXECUTION_EVIDENCE_UNAVAILABLE'}));
  it('classifies explicit timeout and nondeterministic disagreement safely',()=>{expect(inspectExecution({txExecutionResultName:'TIMEOUT'}).kind).toBe('GENVM_ROLLBACK');expect(inspectExecution({txExecutionResultName:'NONDET_DISAGREE'}).kind).toBe('GENVM_ROLLBACK')});
});
