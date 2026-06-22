import React, { useState, Fragment, Component } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle } from
'lucide-react';
import { MOCK_LGPD_MATRIX } from '../lib/mockData';
export function Conformidade() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const atendidos = MOCK_LGPD_MATRIX.filter(
    (r) => r.status === 'atendido'
  ).length;
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Matriz de Conformidade LGPD
            </h1>
            <p className="text-slate-500 mt-1">
              Rastreabilidade formal entre requisitos técnicos e dispositivos
              legais.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-900 font-semibold">
              {atendidos}/16 Requisitos Atendidos
            </span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900">
              Limitações e zonas de incerteza (Art. 6, VI)
            </h3>
            <p className="text-sm text-amber-800 mt-1">
              A anonimização contextual depende de inferência probabilística
              (NER/LLM). Falsos negativos podem ocorrer em textos altamente
              ambíguos ou com erros de OCR. A revisão humana é recomendada para
              documentos de altíssima sensibilidade.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                  ID
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Requisito Técnico
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Componente
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  LGPD
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                  Status
                </th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_LGPD_MATRIX.map((row) =>
              <Fragment key={row.id}>
                  <tr
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() =>
                  setExpandedRow(expandedRow === row.id ? null : row.id)
                  }>
                  
                    <td className="py-3 px-4 text-sm font-mono text-slate-500">
                      {row.id}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">
                      {row.req}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {row.comp}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 font-mono">
                      {row.art}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {expandedRow === row.id ?
                    <ChevronUp className="w-4 h-4" /> :

                    <ChevronDown className="w-4 h-4" />
                    }
                    </td>
                  </tr>
                  {expandedRow === row.id &&
                <tr className="bg-slate-50/50">
                      <td
                    colSpan={6}
                    className="px-4 py-4 border-t border-slate-100">
                    
                        <div className="pl-24">
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                            Evidência Esperada / Gerada
                          </p>
                          <p className="text-sm font-mono text-slate-800 bg-white p-3 rounded border border-slate-200 inline-block">
                            {row.ev}
                          </p>
                        </div>
                      </td>
                    </tr>
                }
                </Fragment>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}