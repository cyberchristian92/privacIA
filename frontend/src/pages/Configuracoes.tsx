import React from 'react';
import { Shield, Database, Cpu, Lock, AlertTriangle } from 'lucide-react';
export function Configuracoes() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-500 mt-1">
            Gerencie políticas de anonimização e modelos locais.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Policy Preset */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Política de Domínio
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Define as regras padrão de transformação aplicadas às
                  entidades detectadas.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                  'Jurídico (Rigoroso)',
                  'Saúde (HIPAA/LGPD)',
                  'RH (Interno)',
                  'Financeiro'].
                  map((preset, i) =>
                  <label
                    key={preset}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${i === 0 ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                    
                      <input
                      type="radio"
                      name="policy"
                      defaultChecked={i === 0}
                      className="text-emerald-600 focus:ring-emerald-500" />
                    
                      <span
                      className={`text-sm font-medium ${i === 0 ? 'text-emerald-900' : 'text-slate-700'}`}>
                      
                        {preset}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Models */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Modelos Locais (Modularidade)
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Selecione os modelos a serem carregados na memória local.
                  Nenhum dado é enviado para APIs externas.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Modelo NER (Detecção)
                    </label>
                    <select className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option>pt_core_news_lg (spaCy) + Regex Híbrido</option>
                      <option>
                        neuralmind/bert-base-portuguese-cased (Transformers)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      LLM Adversarial (Revisão)
                    </label>
                    <select className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option>Llama-3-8B-Instruct-GGUF (Q4_K_M)</option>
                      <option>Mistral-7B-Instruct-v0.2-GGUF</option>
                      <option>Sabiá-7B-GGUF (Otimizado pt-BR)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Segurança e Reversibilidade
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Controles de armazenamento e criptografia do mapeamento de
                  entidades.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Reversão Controlada
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Permite reverter o documento anonimizado usando a chave
                        da sessão.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked />
                      
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                        Criptografia Local do Mapeamento
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          OBRIGATÓRIO
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        AES-256-GCM. Chave gerenciada pelo SO local.
                      </p>
                    </div>
                    <Lock className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>);

}