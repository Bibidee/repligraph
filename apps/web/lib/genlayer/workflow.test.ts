import {describe,expect,it} from 'vitest';
import {pageOffsets,resolveNewClaim,resolveNewStudy,WorkflowAmbiguityError} from './workflow';
import type {RelationClaim,Study} from './schema';

const study=(id:number,registrant='0xabc',overrides:Partial<Study>={}):Study=>({study_id:id,registrant,title:'T',question_text:'Q',method_text:'M',conclusion_text:'C',manifest_url:'https://x',manifest_digest:'a'.repeat(64),publication_ref:'p',version:1,created_at:0,...overrides});
const claim=(id:number,claimant='0xabc',overrides:Partial<RelationClaim>={}):RelationClaim=>({claim_id:id,source_id:1,target_id:2,source_version:1,target_version:1,claimant,claimed_relation:'EXTENSION',evidence_url:'https://x',evidence_digest:'b'.repeat(64),status:'RELATION_CLAIMED',final_relation:'',outcome_class:'',rationale:'',reviewed_at:0,...overrides});

describe('authoritative workflow resolution',()=>{
  it('resolves the matching study after another wallet writes first',()=>expect(resolveNewStudy({before:[study(1)],after:[study(1),study(2,'0xdef'),study(3,'0xabc')],registrant:'0xABC',expected:{title:'T'}})?.study_id).toBe(3));
  it('matches submitted study fields, not only account',()=>expect(resolveNewStudy({before:[],after:[study(1,'0xabc',{title:'other'}),study(2,'0xabc',{title:'submitted'})],registrant:'0xabc',expected:{title:'submitted'}})?.study_id).toBe(2));
  it('rejects ambiguous matching studies',()=>expect(()=>resolveNewStudy({before:[],after:[study(1),study(2)],registrant:'0xabc',expected:{title:'T'}})).toThrow(WorkflowAmbiguityError));
  it('returns null when no new study matches',()=>expect(resolveNewStudy({before:[study(1)],after:[study(1),study(2,'0xdef')],registrant:'0xabc'})).toBeNull());
  it('resolves a claim after an intervening claim',()=>expect(resolveNewClaim({candidates:[claim(11,'0xdef'),claim(12,'0xabc',{source_id:3})],claimant:'0xabc',expected:{source_id:3,target_id:2}})?.claim_id).toBe(12));
  it('matches all submitted claim fields',()=>expect(resolveNewClaim({candidates:[claim(1,'0xabc',{evidence_url:'https://other'}),claim(2,'0xabc')],claimant:'0xabc',expected:{evidence_url:'https://x',evidence_digest:'B'.repeat(64)}})?.claim_id).toBe(2));
  it('rejects ambiguous matching claims and returns null for none',()=>{expect(()=>resolveNewClaim({candidates:[claim(1),claim(2)],claimant:'0xabc',expected:{source_id:1}})).toThrow(WorkflowAmbiguityError);expect(resolveNewClaim({candidates:[claim(1,'0xdef')],claimant:'0xabc'})).toBeNull()});
  it.each<[number,number[]]>([[0,[]],[50,[0]],[51,[0,50]],[101,[0,50,100]]])('creates bounded pagination offsets for %i records', (total,expected)=>expect(pageOffsets(total)).toEqual(expected));
});
