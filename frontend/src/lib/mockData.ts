export type EntityType =
'pessoa' |
'organização' |
'localidade' |
'CPF' |
'CNPJ' |
'RG' |
'telefone' |
'e-mail' |
'CEP' |
'processo CNJ' |
'OAB' |
'CRM' |
'data';
export type DetectorSource = 'ner' | 'regex' | 'hybrid';
export type SensitivityLevel = 'alta' | 'média' | 'baixa';
export type Operator =
'Tokenização' |
'Mascaramento' |
'Generalização' |
'Supressão' |
'Substituição fictícia' |
'Nenhum';

export interface Entity {
  id: string;
  type: EntityType;
  surface_text: string;
  detector_source: DetectorSource;
  confidence: number;
  sensitivity_level: SensitivityLevel;
  context_label: string;
}

export interface Transformation {
  entity_id: string;
  operator: Operator;
  replacement_value: string;
  justification: string;
}

export const MOCK_DOCUMENT = {
  id: 'doc_8f72a1b9',
  filename: 'peticao_inicial_trabalhista.pdf',
  sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  mime_type: 'application/pdf',
  ocr_used: false,
  language: 'pt-BR',
  original_text: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DA 2ª VARA DO TRABALHO DE SÃO PAULO/SP

Processo nº 1001234-56.2023.5.02.0002

JOÃO CARLOS DA SILVA, brasileiro, casado, portador do RG nº 12.345.678-9 e inscrito no CPF sob o nº 123.456.789-00, residente e domiciliado na Rua das Flores, 123, CEP 01234-567, São Paulo/SP, e-mail joao.silva@email.com.br, telefone (11) 98765-4321, vem, respeitosamente, por seu advogado infra-assinado, MARCOS ANTONIO PEREIRA, OAB/SP 123.456, propor a presente RECLAMAÇÃO TRABALHISTA em face de EMPRESA FICTÍCIA LTDA, inscrita no CNPJ sob o nº 12.345.678/0001-90.

O reclamante foi admitido em 15/03/2018 e demitido sem justa causa em 10/01/2023.`
};

export const MOCK_ENTITIES: Entity[] = [
{
  id: 'e1',
  type: 'processo CNJ',
  surface_text: '1001234-56.2023.5.02.0002',
  detector_source: 'regex',
  confidence: 0.99,
  sensitivity_level: 'alta',
  context_label: 'cabeçalho processual'
},
{
  id: 'e2',
  type: 'pessoa',
  surface_text: 'JOÃO CARLOS DA SILVA',
  detector_source: 'hybrid',
  confidence: 0.98,
  sensitivity_level: 'alta',
  context_label: 'reclamante'
},
{
  id: 'e3',
  type: 'RG',
  surface_text: '12.345.678-9',
  detector_source: 'regex',
  confidence: 0.99,
  sensitivity_level: 'alta',
  context_label: 'documento identificador'
},
{
  id: 'e4',
  type: 'CPF',
  surface_text: '123.456.789-00',
  detector_source: 'regex',
  confidence: 0.99,
  sensitivity_level: 'alta',
  context_label: 'documento identificador'
},
{
  id: 'e5',
  type: 'localidade',
  surface_text: 'Rua das Flores, 123',
  detector_source: 'ner',
  confidence: 0.85,
  sensitivity_level: 'média',
  context_label: 'endereço residencial'
},
{
  id: 'e6',
  type: 'CEP',
  surface_text: '01234-567',
  detector_source: 'regex',
  confidence: 0.99,
  sensitivity_level: 'média',
  context_label: 'endereço residencial'
},
{
  id: 'e7',
  type: 'e-mail',
  surface_text: 'joao.silva@email.com.br',
  detector_source: 'regex',
  confidence: 0.99,
  sensitivity_level: 'alta',
  context_label: 'contato'
},
{
  id: 'e8',
  type: 'telefone',
  surface_text: '(11) 98765-4321',
  detector_source: 'regex',
  confidence: 0.99,
  sensitivity_level: 'alta',
  context_label: 'contato'
},
{
  id: 'e9',
  type: 'pessoa',
  surface_text: 'MARCOS ANTONIO PEREIRA',
  detector_source: 'ner',
  confidence: 0.95,
  sensitivity_level: 'média',
  context_label: 'advogado'
},
{
  id: 'e10',
  type: 'OAB',
  surface_text: '123.456',
  detector_source: 'hybrid',
  confidence: 0.92,
  sensitivity_level: 'baixa',
  context_label: 'registro profissional'
},
{
  id: 'e11',
  type: 'organização',
  surface_text: 'EMPRESA FICTÍCIA LTDA',
  detector_source: 'ner',
  confidence: 0.96,
  sensitivity_level: 'média',
  context_label: 'reclamada'
},
{
  id: 'e12',
  type: 'CNPJ',
  surface_text: '12.345.678/0001-90',
  detector_source: 'regex',
  confidence: 0.99,
  sensitivity_level: 'média',
  context_label: 'documento empresarial'
},
{
  id: 'e13',
  type: 'data',
  surface_text: '15/03/2018',
  detector_source: 'regex',
  confidence: 0.99,
  sensitivity_level: 'baixa',
  context_label: 'data de admissão'
},
{
  id: 'e14',
  type: 'data',
  surface_text: '10/01/2023',
  detector_source: 'regex',
  confidence: 0.99,
  sensitivity_level: 'baixa',
  context_label: 'data de demissão'
}];


export const MOCK_DEFAULT_TRANSFORMATIONS: Transformation[] = [
{
  entity_id: 'e1',
  operator: 'Tokenização',
  replacement_value: '[PROCESSO_001]',
  justification: 'Ocultação de identificador único do processo'
},
{
  entity_id: 'e2',
  operator: 'Tokenização',
  replacement_value: '[RECLAMANTE_001]',
  justification: 'Proteção de identidade direta'
},
{
  entity_id: 'e3',
  operator: 'Mascaramento',
  replacement_value: '12.***.***-*',
  justification: 'Ocultação parcial de documento'
},
{
  entity_id: 'e4',
  operator: 'Mascaramento',
  replacement_value: '***.456.***-**',
  justification: 'Ocultação parcial de documento'
},
{
  entity_id: 'e5',
  operator: 'Supressão',
  replacement_value: '[ENDEREÇO SUPRIMIDO]',
  justification: 'Risco de reidentificação geográfica'
},
{
  entity_id: 'e6',
  operator: 'Mascaramento',
  replacement_value: '012**-***',
  justification: 'Generalização de região'
},
{
  entity_id: 'e7',
  operator: 'Mascaramento',
  replacement_value: 'jo***@***.com.br',
  justification: 'Ocultação de contato direto'
},
{
  entity_id: 'e8',
  operator: 'Mascaramento',
  replacement_value: '(11) 9****-****',
  justification: 'Ocultação de contato direto'
},
{
  entity_id: 'e9',
  operator: 'Tokenização',
  replacement_value: '[ADVOGADO_001]',
  justification: 'Minimização de dados de terceiros'
},
{
  entity_id: 'e10',
  operator: 'Mascaramento',
  replacement_value: '123.***',
  justification: 'Ocultação parcial'
},
{
  entity_id: 'e11',
  operator: 'Substituiçãofictícia',
  replacement_value: 'EMPRESA ALFA S.A.',
  justification: 'Preservação narrativa'
},
{
  entity_id: 'e12',
  operator: 'Mascaramento',
  replacement_value: '12.***.***/0001-**',
  justification: 'Ocultação parcial'
},
{
  entity_id: 'e13',
  operator: 'Generalização',
  replacement_value: 'março/2018',
  justification: 'Redução de precisão temporal'
},
{
  entity_id: 'e14',
  operator: 'Generalização',
  replacement_value: 'janeiro/2023',
  justification: 'Redução de precisão temporal'
}];


export const MOCK_LGPD_MATRIX = [
{
  id: 'LGPD-01',
  req: 'Detectar dados pessoais diretos',
  comp: 'Detection Layer',
  art: 'Art. 5, I',
  ev: 'lista estruturada de entidades',
  status: 'atendido'
},
{
  id: 'LGPD-02',
  req: 'Detectar dados pessoais indiretos/contextuais',
  comp: 'Detection Layer',
  art: 'Arts. 5,I e 12',
  ev: 'regras contextuais + spans',
  status: 'atendido'
},
{
  id: 'LGPD-03',
  req: 'Classificar sensibilidade da entidade',
  comp: 'Detection/Policy',
  art: 'Arts. 6,II e 11',
  ev: 'campo sensitivity_level',
  status: 'atendido'
},
{
  id: 'LGPD-04',
  req: 'Aplicar minimização por política',
  comp: 'Policy Layer',
  art: 'Art. 6,III',
  ev: 'operador aplicado por entidade',
  status: 'atendido'
},
{
  id: 'LGPD-05',
  req: 'Limitar uso ao fim declarado',
  comp: 'Policy/Compliance',
  art: 'Art. 6,I',
  ev: 'política vinculada ao caso de uso',
  status: 'atendido'
},
{
  id: 'LGPD-06',
  req: 'Preservar necessidade e proporcionalidade',
  comp: 'Policy/Compliance',
  art: 'Art. 6,II e III',
  ev: 'justificativa de retenção/supressão',
  status: 'atendido'
},
{
  id: 'LGPD-07',
  req: 'Anonimizar sem envio a terceiros externos',
  comp: 'Runtime/Infra',
  art: 'Arts. 6,VII e 46',
  ev: 'log de execução local',
  status: 'atendido'
},
{
  id: 'LGPD-08',
  req: 'Armazenar mapeamento sensível com criptografia',
  comp: 'Audit Layer',
  art: 'Art. 46',
  ev: 'evidência de criptografia local',
  status: 'atendido'
},
{
  id: 'LGPD-09',
  req: 'Permitir descarte controlado do mapeamento',
  comp: 'Audit Layer',
  art: 'Arts. 15 e 16',
  ev: 'TTL / exclusão de sessão',
  status: 'atendido'
},
{
  id: 'LGPD-10',
  req: 'Verificar identificadores residuais',
  comp: 'Verification Layer',
  art: 'Arts. 6,VIII e 12',
  ev: 'relatório de segunda passagem',
  status: 'atendido'
},
{
  id: 'LGPD-11',
  req: 'Testar reidentificação residual adversarial',
  comp: 'Adversarial Layer',
  art: 'Art. 12',
  ev: 'adversarial_review.json',
  status: 'atendido'
},
{
  id: 'LGPD-12',
  req: 'Bloquear saída em risco residual crítico',
  comp: 'Adversarial/Policy',
  art: 'Arts. 6,VIII e 46',
  ev: 'approved=false + trava de envio',
  status: 'atendido'
},
{
  id: 'LGPD-13',
  req: 'Manter trilha de auditoria da sessão',
  comp: 'Audit Layer',
  art: 'Art. 37',
  ev: 'log técnico versionado',
  status: 'atendido'
},
{
  id: 'LGPD-14',
  req: 'Gerar matriz de rastreabilidade',
  comp: 'Compliance Layer',
  art: 'Arts. 6,X e 37',
  ev: 'relatório de conformidade',
  status: 'atendido'
},
{
  id: 'LGPD-15',
  req: 'Registrar limitações e zonas de incerteza',
  comp: 'Compliance Layer',
  art: 'Arts. 6,VI e X',
  ev: 'seção de limitações',
  status: 'atendido'
},
{
  id: 'LGPD-16',
  req: 'Permitir revisão humana e governança',
  comp: 'Interface/Workflow',
  art: 'Arts. 6,VI e 50',
  ev: 'checkpoint de aprovação humana',
  status: 'atendido'
}];


export const MOCK_AUDIT_LOGS = [
{ time: '10:00:01', action: 'Sessão iniciada', detail: 'ID: sess_9f8a7b6c' },
{
  time: '10:00:05',
  action: 'Documento ingerido',
  detail: 'peticao_inicial_trabalhista.pdf (sha256: e3b0c...)'
},
{
  time: '10:00:06',
  action: 'Extração de texto concluída',
  detail: '134 palavras extraídas'
},
{
  time: '10:00:08',
  action: 'Detecção híbrida concluída',
  detail: '14 entidades candidatas encontradas'
},
{
  time: '10:00:15',
  action: 'Política de transformação aplicada',
  detail: 'Domínio: Jurídico. 14 transformações registradas.'
},
{
  time: '10:00:16',
  action: 'Verificação pós-anonimização',
  detail: 'Nenhum vazamento direto detectado. Cobertura: 100%'
},
{
  time: '10:00:22',
  action: 'Revisão adversarial (LLM Local)',
  detail: 'Modelo: Llama-3-8B-Instruct-GGUF. Risco residual: Baixo.'
},
{
  time: '10:00:23',
  action: 'Matriz LGPD gerada',
  detail: '16/16 requisitos atendidos.'
},
{
  time: '10:00:24',
  action: 'Artefatos exportáveis prontos',
  detail: '8 arquivos gerados na sessão.'
}];