# PrivacIA â€” Arquitetura e EspecificaÃ§Ã£o TÃ©cnica

**VersÃ£o:** 0.1  
**Data:** 2026-06-18

## 1. PrincÃ­pio Arquitetural

PrivacIA deve ser projetado como um sistema **local-first, modular, auditÃ¡vel e orientado a evidÃªncias**.

NÃ£o basta â€œanonimizarâ€. O sistema precisa conseguir demonstrar:

- como detectou;
- como transformou;
- o que sobrou;
- como tentou ser quebrado adversarialmente;
- por que o resultado final Ã© juridicamente defensÃ¡vel.

## 2. Macrocomponentes

### 2.1 Ingestion Layer

ResponsÃ¡vel por:

- receber arquivos;
- identificar tipo MIME/extensÃ£o;
- extrair texto nativo;
- acionar OCR local quando necessÃ¡rio;
- produzir representaÃ§Ã£o textual normalizada.

### 2.2 Detection Layer

ResponsÃ¡vel por:

- rodar NER em pt-BR;
- aplicar regex para padrÃµes estruturados;
- aplicar heurÃ­sticas contextuais;
- consolidar spans concorrentes;
- produzir lista final de entidades candidatas.

### 2.3 Policy & Transformation Layer

ResponsÃ¡vel por:

- aplicar polÃ­ticas por tipo de entidade;
- decidir entre tokenizaÃ§Ã£o, mÃ¡scara, supressÃ£o, generalizaÃ§Ã£o e substituiÃ§Ã£o fictÃ­cia;
- manter consistÃªncia de pseudÃ´nimos ao longo do documento;
- registrar justificativas tÃ©cnicas.

### 2.4 Verification Layer

ResponsÃ¡vel por:

- executar segunda passagem no texto anonimizado;
- detectar vazamentos remanescentes;
- comparar original/anÃ´nimo;
- calcular mÃ©tricas internas de cobertura e risco.

### 2.5 Adversarial LLM Validation Layer

ResponsÃ¡vel por:

- submeter apenas a versÃ£o anonimizada a um LLM local;
- pedir explicitamente tentativas de reidentificaÃ§Ã£o;
- registrar hipÃ³teses, alvos e justificativas do ataque;
- consolidar risco residual e pontos fracos.

### 2.6 LGPD Compliance Layer

ResponsÃ¡vel por:

- mapear requisitos tÃ©cnicos a dispositivos da LGPD;
- manter tabela de rastreabilidade;
- gerar relatÃ³rio formal de aderÃªncia e limitaÃ§Ãµes.

### 2.7 Audit & Artifact Layer

ResponsÃ¡vel por:

- persistir logs estruturados;
- armazenar mapeamentos criptografados;
- versionar artefatos de execuÃ§Ã£o;
- exportar evidÃªncias tÃ©cnicas em formatos legÃ­veis.

## 3. Fluxo de Processamento

1. arquivo entra no sistema;
2. texto Ã© extraÃ­do/normalizado;
3. entidades candidatas sÃ£o detectadas;
4. conflitos entre entidades sÃ£o resolvidos;
5. polÃ­tica de anonimizaÃ§Ã£o Ã© aplicada;
6. versÃ£o anonimizada Ã© gerada;
7. verificaÃ§Ã£o pÃ³s-anonimizaÃ§Ã£o executa nova varredura;
8. LLM local tenta reidentificar o conteÃºdo;
9. sistema gera score residual de risco;
10. matriz LGPD e trilha de auditoria sÃ£o emitidas.

## 4. Modelo de Dados LÃ³gico

### 4.1 Documento

- `document_id`
- `source_path`
- `sha256`
- `mime_type`
- `text_extracted`
- `ocr_used`
- `language`

### 4.2 Entidade Detectada

- `entity_id`
- `document_id`
- `entity_type`
- `span_start`
- `span_end`
- `surface_text`
- `detector_source` (`ner`, `regex`, `hybrid`)
- `confidence`
- `sensitivity_level`
- `context_label`

### 4.3 TransformaÃ§Ã£o

- `transformation_id`
- `entity_id`
- `operator`
- `replacement_value`
- `reversible`
- `policy_source`

### 4.4 RevisÃ£o Adversarial

- `review_id`
- `document_id`
- `model_name`
- `prompt_version`
- `attack_findings`
- `approved`
- `risk_level`

### 4.5 EvidÃªncia de Conformidade

- `compliance_id`
- `document_id`
- `requirement_id`
- `lgpd_article`
- `technical_evidence`
- `status`

## 5. Detectores MÃ­nimos

### 5.1 NER

Entidades mÃ­nimas:

- pessoa;
- organizaÃ§Ã£o;
- localidade;
- datas contextualizadas;
- documentos identificadores quando detectÃ¡veis por contexto.

### 5.2 Regex

PadrÃµes mÃ­nimos:

- CPF;
- CNPJ;
- RG;
- telefone;
- e-mail;
- CEP;
- IP;
- nÃºmero CNJ;
- placa;
- OAB;
- CRM;
- CNS e identificadores equivalentes, quando aplicÃ¡vel.

### 5.3 Regras Contextuais

Exemplos:

- â€œfilho deâ€, â€œnascido emâ€, â€œresidente Ã â€, â€œportador do CPFâ€;
- cabeÃ§alhos processuais;
- blocos de assinatura;
- metadados de certidÃµes e formulÃ¡rios.

## 6. Operadores de AnonimizaÃ§Ã£o

### 6.1 TokenizaÃ§Ã£o estruturada

Exemplo:

- `[PESSOA_001]`
- `[CPF_003]`
- `[PROCESSO_001]`

### 6.2 Mascaramento

Exemplo:

- `123.***.***-00`
- `jo***@dominio.com`

### 6.3 GeneralizaÃ§Ã£o

Exemplo:

- `06/06/1958` â†’ `faixa 60+`
- `Teresina/PI` â†’ `capital do Nordeste`

### 6.4 SupressÃ£o

Usada quando a permanÃªncia do dado destrÃ³i o objetivo de anonimizaÃ§Ã£o.

### 6.5 SubstituiÃ§Ã£o fictÃ­cia

Usada quando a legibilidade do texto exige preservaÃ§Ã£o narrativa.

## 7. RevisÃ£o Adversarial por LLM Local

### 7.1 FunÃ§Ã£o

Atuar como revisor hostil do documento anonimizado, tentando:

- inferir identidades;
- reconstruir vÃ­nculos;
- cruzar contexto residual;
- detectar combinaÃ§Ãµes singulares que ainda individualizam alguÃ©m.

### 7.2 RestriÃ§Ãµes

- sem acesso ao original;
- sem internet;
- sem API externa;
- somente sobre o texto anonimizado e metadados autorizados.

### 7.3 SaÃ­da mÃ­nima

- `approved: true/false`
- `risk_level`
- `critical_issues`
- `improvements`
- `summary`

## 8. Artefatos Gerados

- `document.json`
- `entities.json`
- `transformations.json`
- `anonymized.txt`
- `verification.json`
- `adversarial_review.json`
- `lgpd_traceability.json`
- `execution_report.md`

## 9. Interface Inicial

### 9.1 CLI

Comandos mÃ­nimos:

- `privacia anonymize arquivo.pdf`
- `privacia review arquivo_anon.txt`
- `privacia compliance sessao.json`
- `privacia benchmark dataset/`

### 9.2 API local

Endpoints mÃ­nimos:

- `POST /api/v1/anonymize`
- `POST /api/v1/review`
- `GET /api/v1/report/{session_id}`
- `GET /api/v1/compliance/{session_id}`

## 10. CritÃ©rios TÃ©cnicos de Qualidade

- nenhuma dependÃªncia obrigatÃ³ria de cloud;
- cada transformaÃ§Ã£o rastreÃ¡vel;
- saÃ­da explicÃ¡vel;
- artefatos reprodutÃ­veis;
- bloqueio seguro em caso de falha crÃ­tica;
- revisÃ£o adversarial obrigatÃ³ria nas execuÃ§Ãµes â€œpublicÃ¡veisâ€ ou â€œauditÃ¡veisâ€.
