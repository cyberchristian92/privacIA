import React from 'react';
import {
  ScrollText,
  Clock,
  Download,
  Trash2,
  FileJson,
  FileText,
  ShieldAlert } from
'lucide-react';
import { MOCK_AUDIT_LOGS } from '../lib/mockData';
export function Auditoria() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Auditoria e Artefatos
            </h1>
            <p className="text-slate-500 mt-1">
              Trilha de execução da sessão atual (Art. 37 LGPD).
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors border border-red-200">
            <Trash2 className="w-4 h-4" />
            Descartar Mapeamento (TTL)
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Log Técnico Versionado
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="relative border-l border-slate-200 ml-3 space-y-6">
                {MOCK_AUDIT_LOGS.map((log, i) =>
                <div key={i} className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-200 rounded-full border-2 border-white"></div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-mono text-slate-400">
                        {log.time}
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 font-mono">
                      {log.detail}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Artifacts */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-slate-400" />
              Artefatos Gerados
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
              <ArtifactItem
                name="document.json"
                icon={<FileJson className="w-4 h-4" />} />
              
              <ArtifactItem
                name="entities.json"
                icon={<FileJson className="w-4 h-4" />} />
              
              <ArtifactItem
                name="transformations.json"
                icon={<FileJson className="w-4 h-4" />} />
              
              <ArtifactItem
                name="anonymized.txt"
                icon={<FileText className="w-4 h-4" />} />
              
              <ArtifactItem
                name="verification.json"
                icon={<FileJson className="w-4 h-4" />} />
              
              <ArtifactItem
                name="adversarial_review.json"
                icon={<ShieldAlert className="w-4 h-4" />}
                highlight />
              
              <ArtifactItem
                name="lgpd_traceability.json"
                icon={<FileJson className="w-4 h-4" />} />
              
              <ArtifactItem
                name="execution_report.md"
                icon={<FileText className="w-4 h-4" />} />
              
            </div>
          </div>
        </div>
      </div>
    </div>);

}
function ArtifactItem({
  name,
  icon,
  highlight = false




}: {name: string;icon: React.ReactNode;highlight?: boolean;}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${highlight ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'} transition-colors group cursor-pointer`}>
      
      <div className="flex items-center gap-3">
        <div
          className={`${highlight ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
          
          {icon}
        </div>
        <span
          className={`text-sm font-mono ${highlight ? 'text-emerald-900 font-medium' : 'text-slate-700'}`}>
          
          {name}
        </span>
      </div>
      <Download
        className={`w-4 h-4 ${highlight ? 'text-emerald-600' : 'text-slate-300 group-hover:text-slate-500'}`} />
      
    </div>);

}