import {describe,expect,it,vi} from 'vitest';
import {hydrateWallet} from '../../components/wallet-provider';
import {validateSigningContext} from './contract';

const provider=(chain='0xf22f',accounts:any=['0xAbC'])=>({request:vi.fn(async({method}:{method:string})=>method==='eth_chainId'?chain:accounts)});

describe('signing preflight',()=>{
  it('accepts the expected account on StudioNet',async()=>expect(await validateSigningContext(provider(),'0xabc')).toBe('0xabc'));
  it('rejects a missing provider',async()=>await expect(validateSigningContext(null,'0xabc')).rejects.toThrow(/No injected/));
  it('rejects the wrong chain',async()=>await expect(validateSigningContext(provider('0x1'),'0xabc')).rejects.toThrow(/Wrong network/));
  it('rejects no accounts',async()=>await expect(validateSigningContext(provider('0xf22f',[]),'0xabc')).rejects.toThrow(/no currently authorized/));
  it('rejects malformed accounts',async()=>await expect(validateSigningContext(provider('0xf22f',null),'0xabc')).rejects.toThrow(/no currently authorized/));
  it('rejects account mismatch',async()=>await expect(validateSigningContext(provider('0xf22f',['0xdef']),'0xabc')).rejects.toThrow(/account changed/));
  it('checks chain before accounts',async()=>{const p=provider();await validateSigningContext(p,'0xabc');expect(p.request.mock.calls.map(c=>c[0].method)).toEqual(['eth_chainId','eth_accounts'])});
});

describe('silent wallet hydration',()=>{
  it('restores an authorized StudioNet wallet without requesting accounts',async()=>{
    const p=provider();const session=await hydrateWallet(p);
    expect(session).toEqual({account:'0xAbC',chainId:'0xf22f'});
    expect(p.request.mock.calls.map(c=>c[0].method)).toEqual(['eth_accounts','eth_chainId']);
    expect(p.request).not.toHaveBeenCalledWith(expect.objectContaining({method:'eth_requestAccounts'}));
  });
  it('keeps account empty while restoring chain',async()=>expect(await hydrateWallet(provider('0xf22f',[]))).toEqual({account:null,chainId:'0xf22f'}));
  it('restores wrong network truthfully',async()=>{const session=await hydrateWallet(provider('0x1'));expect(session).toEqual({account:'0xAbC',chainId:'0x1'});});
  it('survives account lookup errors and still reads chain',async()=>{
    const p={request:vi.fn(async({method}:{method:string})=>{if(method==='eth_accounts')throw new Error('unavailable');return '0xf22f'})};
    await expect(hydrateWallet(p)).resolves.toEqual({account:null,chainId:'0xf22f'});
  });
  it('survives chain lookup errors',async()=>{
    const p={request:vi.fn(async({method}:{method:string})=>{if(method==='eth_chainId')throw new Error('unavailable');return ['0xabc']})};
    await expect(hydrateWallet(p)).resolves.toEqual({account:'0xabc',chainId:null});
  });
});
