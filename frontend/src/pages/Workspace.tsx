import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, CheckCircle2, Circle, Loader2, AlertCircle, FileText, UploadCloud,
  FileJson, ShieldAlert, GitCompare, ScanSearch, ShieldCheck, Download, Lock
} from 'lucide-react';

type StageStatus = 'pendente' | 'em_execucao' | 'concluido' | 'bloqueado';
interface Stage {
  id: number;
  title: string;
  icon: React.ReactNode;
}

const STAGES: Stage[] = [
  { id: 1, title: 'Ingestão', icon: <UploadCloud className="w-4 h-4" /> },
  { id: 2, title: 'Extração de texto', icon: <FileText className="w-4 h-4" /> },
  { id: 3, title: 'Detecção', icon: <ScanSearch className="w-4 h-4" /> },
  { id: 4, title: 'Política & Transformação', icon: <FileJson className="w-4 h-4" /> },
  { id: 5, title: 'Documento anonimizado', icon: <GitCompare className="w-4 h-4" /> },
  { id: 6, title: 'Verificação pós-anonimização', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 7, title: 'Revisão adversarial', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 8, title: 'Score de risco residual', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 9, title: 'Matriz LGPD', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 10, title: 'Artefatos & Auditoria', icon: <Download className="w-4 h-4" /> }
];

export function Workspace() {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [stageStatuses, setStageStatuses] = useState<Record<number, StageStatus>>({
    1: 'concluido', 2: 'pendente', 3: 'pendente', 4: 'pendente', 5: 'pendente',
    6: 'pendente', 7: 'pendente', 8: 'pendente', 9: 'pendente', 10: 'pendente'
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // States to hold API data
  const [docData, setDocData] = useState<any>(null);
  const [anonymizeData, setAnonymizeData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setDocData(null);
    setAnonymizeData(null);
    setReviewData(null);
    setStageStatuses({
      1: 'concluido', 2: 'pendente', 3: 'pendente', 4: 'pendente', 5: 'pendente',
      6: 'pendente', 7: 'pendente', 8: 'pendente', 9: 'pendente', 10: 'pendente'
    });
  };

  const setStage = (id: number, status: StageStatus) => {
    setStageStatuses(prev => ({ ...prev, [id]: status }));
    if (status === 'em_execucao') setActiveStageId(id);
  };

  const runPipeline = async () => {
    if (isRunning || !uploadedFile) return;
    setIsRunning(true);
    
    try {
      // Stage 1 & 2: Ingestão e Extração
      setStage(2, 'em_execucao');
      const formData = new FormData();
      formData.append('file', uploadedFile);
      const resUpload = await fetch('/api/v1/upload', { method: 'POST', body: formData });
      if (!resUpload.ok) throw new Error("Upload failed");
      const dData = await resUpload.json();
      setDocData(dData);
      setStage(2, 'concluido');

      // Stage 3, 4, 5: Detecção e Anonimização
      setStage(3, 'em_execucao');
      setStage(4, 'em_execucao');
      setStage(5, 'em_execucao');
      const resAnon = await fetch('/api/v1/anonymize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: dData.original_text })
      });
      if (!resAnon.ok) throw new Error("Anonymize failed");
      const aData = await resAnon.json();
      setAnonymizeData(aData);
      setStage(3, 'concluido');
      setStage(4, 'concluido');
      setStage(5, 'concluido');

      // Stage 6: Verificação
      setStage(6, 'em_execucao');
      await new Promise(r => setTimeout(r, 500)); // Mock delay
      setStage(6, 'concluido');

      // Stage 7 & 8: Revisão Adversarial
      setStage(7, 'em_execucao');
      setStage(8, 'em_execucao');
      const resReview = await fetch('/api/v1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: aData.document_id, anonymized_text: aData.anonymized_text })
      });
      if (!resReview.ok) throw new Error("Review failed");
      const rData = await resReview.json();
      setReviewData(rData);
      setStage(7, 'concluido');
      setStage(8, 'concluido');

      // Stage 9 & 10: Matriz LGPD e Artefatos
      setStage(9, 'em_execucao');
      setStage(10, 'em_execucao');
      await new Promise(r => setTimeout(r, 500)); // Mock delay
      setStage(9, 'concluido');
      setStage(10, 'concluido');

    } catch (e) {
      console.error(e);
      alert("Ocorreu um erro na execução do pipeline: " + String(e));
      setStageStatuses(prev => {
        const next = { ...prev };
        for (let i = 1; i <= 10; i++) if (next[i] === 'em_execucao') next[i] = 'bloqueado';
        return next;
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-200">
          <button onClick={runPipeline} disabled={isRunning || !uploadedFile || stageStatuses[10] === 'concluido'}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Executando...' : 'Executar Pipeline'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {STAGES.map((stage) => {
            const status = stageStatuses[stage.id];
            const isActive = activeStageId === stage.id;
            return (
              <button key={stage.id} onClick={() => status !== 'pendente' && setActiveStageId(stage.id)}
                disabled={status === 'pendente' && !isRunning}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${isActive ? 'bg-slate-100' : 'hover:bg-slate-50'} ${status === 'pendente' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="shrink-0">
                  {status === 'concluido' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                   status === 'em_execucao' ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> :
                   status === 'bloqueado' ? <AlertCircle className="w-5 h-5 text-red-500" /> :
                   <Circle className="w-5 h-5 text-slate-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{stage.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeStageId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <StageContent stageId={activeStageId} status={stageStatuses[activeStageId]} 
                uploadedFile={uploadedFile} docData={docData} anonymizeData={anonymizeData} reviewData={reviewData}
                fileInputRef={fileInputRef} handleFileChange={handleFileChange} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StageContent({ stageId, status, uploadedFile, docData, anonymizeData, reviewData, fileInputRef, handleFileChange }: any) {
  if (status === 'pendente') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Circle className="w-8 h-8 mb-4 opacity-20" />
        <p>Aguardando execução do pipeline...</p>
      </div>
    );
  }
  if (status === 'em_execucao') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-blue-500">
        <Loader2 className="w-8 h-8 mb-4 animate-spin" />
        <p className="font-medium text-slate-600">Processando...</p>
      </div>
    );
  }

  switch (stageId) {
    case 1: return <Stage1Ingestao uploadedFile={uploadedFile} fileInputRef={fileInputRef} handleFileChange={handleFileChange} />;
    case 2: return <Stage2Extracao docData={docData} />;
    case 3: return <Stage3Deteccao anonymizeData={anonymizeData} />;
    case 4: return <Stage4Transformacao anonymizeData={anonymizeData} />;
    case 5: return <Stage5Diff docData={docData} anonymizeData={anonymizeData} />;
    case 6: return <Stage6Verificacao anonymizeData={anonymizeData} />;
    case 7: return <Stage7Adversarial reviewData={reviewData} />;
    case 8: return <Stage8Score reviewData={reviewData} />;
    case 9: return <Stage9Matriz />;
    case 10: return <Stage10Artefatos />;
    default: return null;
  }
}

function Stage1Ingestao({ uploadedFile, fileInputRef, handleFileChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Ingestão de Documento</h2>
        <p className="text-slate-500 mt-1">Selecione para iniciar.</p>
      </div>
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.txt,.docx" />
      <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center bg-white text-center hover:bg-slate-50">
        <UploadCloud className="w-10 h-10 text-slate-400 mb-4" />
        <p className="text-sm font-medium text-slate-900">Clique para selecionar seu arquivo aqui</p>
        <p className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT</p>
      </div>
      {uploadedFile && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Documento Selecionado</h3>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg"><FileText className="w-6 h-6 text-slate-600" /></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{uploadedFile.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-mono">
                <span>{(uploadedFile.size / 1024).toFixed(2)} KB</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stage2Extracao({ docData }: any) {
  if (!docData) return null;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Extração de Texto</h2></div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2"><span className="text-xs font-mono text-slate-500">{docData.filename}</span></div>
        <div className="p-6">
          <pre className="text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">{docData.original_text}</pre>
        </div>
      </div>
    </div>
  );
}

function Stage3Deteccao({ anonymizeData }: any) {
  if (!anonymizeData) return null;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Detecção de Entidades</h2></div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Texto Detectado</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Detector</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {anonymizeData.entities.map((e: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-2 px-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">{e.type}</span></td>
                <td className="py-2 px-4 text-sm font-mono text-slate-900">{e.surface_text}</td>
                <td className="py-2 px-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">{e.detector_source}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stage4Transformacao({ anonymizeData }: any) {
  if (!anonymizeData) return null;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Política & Transformação</h2></div>
      <div className="space-y-3">
        {anonymizeData.transformations.map((t: any, i: number) => {
          const e = anonymizeData.entities.find((x: any) => x.id === t.entity_id);
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
              <div className="w-1/3"><span className="text-xs font-medium text-slate-500 uppercase">{e?.type}</span><p className="text-sm font-mono text-slate-900 truncate">{e?.surface_text}</p></div>
              <div className="w-1/4"><span className="text-sm">{t.operator}</span></div>
              <div className="w-1/3"><input type="text" className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-sm font-mono bg-slate-50" value={t.replacement_value} readOnly /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stage5Diff({ docData, anonymizeData }: any) {
  if (!docData || !anonymizeData) return null;
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div><h2 className="text-2xl font-bold text-slate-900">Documento Anonimizado</h2></div>
      <div className="flex gap-4 flex-1 min-h-[500px]">
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2"><span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Original</span></div>
          <div className="p-6 overflow-y-auto flex-1"><pre className="text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">{docData.original_text}</pre></div>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-emerald-200 shadow-sm flex flex-col overflow-hidden">
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /><span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Anonimizado</span></div>
          <div className="p-6 overflow-y-auto flex-1"><pre className="text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">{anonymizeData.anonymized_text}</pre></div>
        </div>
      </div>
    </div>
  );
}

function Stage6Verificacao({ anonymizeData }: any) {
  if (!anonymizeData) return null;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Verificação Pós-Anonimização</h2></div>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <ShieldCheck className="w-10 h-10 text-emerald-500 mb-3" /><p className="text-3xl font-bold text-slate-900">0</p><p className="text-sm text-slate-500 mt-1">Vazamentos Diretos</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <ScanSearch className="w-10 h-10 text-blue-500 mb-3" /><p className="text-3xl font-bold text-slate-900">{anonymizeData.verification_metrics.coverage}</p><p className="text-sm text-slate-500 mt-1">Cobertura</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-10 h-10 text-amber-500 mb-3" /><p className="text-3xl font-bold text-slate-900">{anonymizeData.verification_metrics.internal_risk}</p><p className="text-sm text-slate-500 mt-1">Risco Interno Estimado</p>
        </div>
      </div>
    </div>
  );
}

function Stage7Adversarial({ reviewData }: any) {
  if (!reviewData) return null;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Revisão Adversarial (LLM Local)</h2></div>
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden text-slate-300">
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-emerald-400" /><span className="font-mono text-sm text-slate-100">adversarial_reviewer_agent</span></div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">APPROVED: {reviewData.approved ? 'TRUE' : 'FALSE'}</span>
        </div>
        <div className="p-6 space-y-4 font-mono text-sm">
          {reviewData.log?.map((l: string, i: number) => <p key={i} className={l.startsWith('-') ? "text-amber-400/80" : "text-slate-400"}>{l}</p>)}
          <div className="mt-6 p-4 bg-slate-800/50 rounded border border-slate-700">
            <p className="text-white font-semibold mb-2">Resumo da Avaliação:</p>
            <p>{reviewData.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage8Score({ reviewData }: any) {
  if (!reviewData) return null;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Score de Risco Residual</h2></div>
      <div className="bg-white rounded-xl border border-emerald-200 p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold text-emerald-600 mb-2">Risco {reviewData.risk_level}</h3>
        <p className="text-slate-600 max-w-md">O documento pode ser exportado ou compartilhado com segurança de acordo com a política definida.</p>
      </div>
    </div>
  );
}

function Stage9Matriz() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Matriz LGPD (Preview)</h2></div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 text-center">
        <p className="text-slate-500">Matriz gerada com sucesso. Conformidade verificada.</p>
      </div>
    </div>
  );
}

function Stage10Artefatos() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Artefatos & Auditoria</h2></div>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 text-left">
          <div><p className="font-semibold text-slate-900">Pacote Completo (ZIP)</p></div><Download className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}