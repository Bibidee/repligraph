import {Chrome} from '../components/chrome';
import {GraphExplorer} from '../components/graph-explorer';
import {listAllEdgesGlobalPage,listAllStudiesPage} from '../lib/genlayer/data-source';
import type {Edge,Study} from '../lib/genlayer/schema';

export const dynamic='force-dynamic';

export default async function Home(){
  let studies:Study[]=[],edges:Edge[]=[],notice='',error='';
  try{const [studyPage,edgePage]=await Promise.all([listAllStudiesPage(),listAllEdgesGlobalPage()]);studies=studyPage.records;edges=edgePage.records;if(studyPage.truncated||edgePage.truncated)notice='Showing the first 5,000 records.'}catch(e){error=e instanceof Error?e.message:'The graph is unavailable.'}
  return <main><Chrome/><div className="page-shell"><p className="eyebrow">Live StudioNet provenance</p><h1 className="page-title">Research graph</h1><p className="muted">Immutable study versions and validator-accepted relations. Semantic proximity retrieves context, never truth.</p>{error?<section className="graph-layout mt-8"><aside className="study-ledger"><p className="eyebrow">Studies</p><p className="muted mt-3">Ledger unavailable.</p></aside><div className="graph-canvas graph-paper"><div className="panel status-box"><strong>Live graph unavailable</strong><p>{error}</p></div></div></section>:<><GraphExplorer studies={studies} edges={edges}/>{notice&&<p className="muted mt-4">{notice}</p>}</>}</div></main>
}
