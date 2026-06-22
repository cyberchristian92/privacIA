# PrivacIA â€” Product Requirements Document

**VersÃ£o:** 0.1  
**Data:** 2026-06-18  
**Contexto:** artigo cientÃ­fico e futura implementaÃ§Ã£o do software

## 1. VisÃ£o do Produto

**PrivacIA** Ã© um framework de anonimizaÃ§Ã£o documental para portuguÃªs brasileiro, concebido para uso local e auditÃ¡vel em cenÃ¡rios jurÃ­dico-regulatÃ³rios. Seu diferencial nÃ£o estÃ¡ apenas em remover dados pessoais, mas em:

1. anonimizar com contexto;
2. testar a robustez da anonimizaÃ§Ã£o contra reidentificaÃ§Ã£o por um LLM local;
3. demonstrar rastreabilidade formal entre comportamento tÃ©cnico e requisitos da LGPD.

## 2. Problema

Ferramentas tradicionais de anonimizaÃ§Ã£o tendem a falhar em pelo menos uma destas dimensÃµes:

- detectam entidades superficiais, mas ignoram contexto semÃ¢ntico;
- nÃ£o medem resistÃªncia a ataques de reidentificaÃ§Ã£o;
- nÃ£o entregam evidÃªncia auditÃ¡vel de aderÃªncia regulatÃ³ria;
- dependem de APIs externas, elevando risco de exposiÃ§Ã£o de dados;
- funcionam bem em inglÃªs, mas perdem desempenho em portuguÃªs brasileiro e documentos reais.

No cenÃ¡rio brasileiro, isso cria uma lacuna entre anonimizaÃ§Ã£o â€œaparenteâ€ e anonimizaÃ§Ã£o defensÃ¡vel do ponto de vista tÃ©cnico-jurÃ­dico.

## 3. Tese de Produto

O software a ser criado para o artigo deve operacionalizar a hipÃ³tese de que uma anonimizaÃ§Ã£o sÃ³ Ã© forte o suficiente para cenÃ¡rios sensÃ­veis quando combina:

- **detecÃ§Ã£o contextual hÃ­brida**;
- **validaÃ§Ã£o adversarial local**;
- **conformidade formal verificÃ¡vel**.

## 4. Objetivo PrimÃ¡rio

Permitir que um operador submeta um documento em portuguÃªs brasileiro, obtenha uma versÃ£o anonimizada, receba um parecer adversarial automatizado sobre risco residual de reidentificaÃ§Ã£o e gere evidÃªncias formais de conformidade alinhadas Ã  LGPD.

## 5. Objetivos SecundÃ¡rios

- Produzir artefatos demonstrÃ¡veis no artigo.
- Viabilizar benchmark reproduzÃ­vel.
- Servir de base para MVP funcional e posterior software operacional.
- Reduzir dependÃªncia de serviÃ§os externos durante a avaliaÃ§Ã£o.

## 6. Perfis de UsuÃ¡rio

### 6.1 Pesquisador jurÃ­dico-regulatÃ³rio

Precisa demonstrar tecnicamente a robustez de anonimizaÃ§Ã£o e a ligaÃ§Ã£o com a LGPD.

### 6.2 DPO / jurÃ­dico interno

Precisa de rastreabilidade entre polÃ­tica de tratamento e comportamento do software.

### 6.3 Perito / advogado / analista documental

Precisa anonimizar peÃ§as e anexos sem destruir inteligibilidade do texto.

### 6.4 Engenheiro de ML / NLP

Precisa medir recall, precisÃ£o, cobertura e resistÃªncia a ataques de reidentificaÃ§Ã£o.

## 7. Escopo do Software

### 7.1 Em escopo

- ingestÃ£o local de documentos;
- extraÃ§Ã£o de texto e OCR quando necessÃ¡rio;
- detecÃ§Ã£o hÃ­brida NER + regex + regras contextuais;
- normalizaÃ§Ã£o e classificaÃ§Ã£o de entidades;
- anonimizaÃ§Ã£o com mÃºltiplos operadores;
- geraÃ§Ã£o de relatÃ³rio de risco residual;
- validaÃ§Ã£o adversarial via LLM local;
- matriz de conformidade LGPD;
- trilha de auditoria;
- exportaÃ§Ã£o de artefatos tÃ©cnicos.

### 7.2 Fora do escopo inicial

- uso de APIs externas de LLM;
- suporte amplo a colaboraÃ§Ã£o multiusuÃ¡rio;
- orquestraÃ§Ã£o distribuÃ­da;
- implantaÃ§Ã£o SaaS pÃºblica;
- integraÃ§Ã£o com ERPs, tribunais ou prontuÃ¡rios em produÃ§Ã£o.

## 8. Casos de Uso Principais

### CU01 â€” Anonimizar documento individual

Entrada: PDF, DOCX, TXT ou imagem  
SaÃ­da: texto anonimizado + mapa de entidades + relatÃ³rio tÃ©cnico

### CU02 â€” Testar robustez adversarial

Entrada: documento anonimizado  
SaÃ­da: tentativas automatizadas de reidentificaÃ§Ã£o + score de risco + falhas detectadas

### CU03 â€” Gerar evidÃªncia de conformidade

Entrada: execuÃ§Ã£o de anonimizaÃ§Ã£o  
SaÃ­da: matriz requisitoâ†’componenteâ†’evidÃªnciaâ†’artigo LGPD

### CU04 â€” Rodar benchmark experimental

Entrada: conjunto de documentos anotados  
SaÃ­da: mÃ©tricas agregadas de desempenho e robustez

## 9. Requisitos Funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | Aceitar entrada em PDF, DOCX, TXT e imagem | Must |
| RF02 | Executar OCR local para PDFs escaneados e imagens | Must |
| RF03 | Detectar entidades por NER em portuguÃªs brasileiro | Must |
| RF04 | Detectar entidades por regex para identificadores estruturados | Must |
| RF05 | Combinar NER e regex em pipeline Ãºnico com deduplicaÃ§Ã£o | Must |
| RF06 | Classificar entidades por tipo, sensibilidade e confiabilidade | Must |
| RF07 | Suportar operadores de anonimizaÃ§Ã£o: tokenizaÃ§Ã£o, mascaramento, supressÃ£o, generalizaÃ§Ã£o e substituiÃ§Ã£o fictÃ­cia | Must |
| RF08 | Manter tabela de mapeamento local criptografada | Must |
| RF09 | Permitir reversÃ£o controlada apenas quando polÃ­tica permitir | Should |
| RF10 | Executar segunda passagem de verificaÃ§Ã£o apÃ³s anonimizaÃ§Ã£o | Must |
| RF11 | Acionar LLM local para revisÃ£o adversarial de reidentificaÃ§Ã£o | Must |
| RF12 | Registrar prompts, resultados e achados do adversarial reviewer sem expor dado original fora da mÃ¡quina | Must |
| RF13 | Produzir score residual de risco por documento | Must |
| RF14 | Gerar relatÃ³rio tÃ©cnico estruturado da execuÃ§Ã£o | Must |
| RF15 | Gerar matriz de conformidade LGPD com evidÃªncias por requisito | Must |
| RF16 | Disponibilizar CLI para execuÃ§Ã£o reprodutÃ­vel | Must |
| RF17 | Disponibilizar API local para integraÃ§Ã£o futura | Should |
| RF18 | Permitir polÃ­ticas por domÃ­nio documental (jurÃ­dico, saÃºde, RH, financeiro) | Should |
| RF19 | Permitir processamento em lote | Should |
| RF20 | Permitir benchmark com ground truth anotado | Should |
| RF21 | Gerar dataset de erros / falsos negativos para melhoria contÃ­nua | Should |
| RF22 | Exportar artefatos em JSON e Markdown | Must |

## 10. Requisitos NÃ£o-Funcionais

| ID | Requisito | Meta |
|---|---|---|
| RNF01 | ExecuÃ§Ã£o local | Nenhum dado original enviado a serviÃ§os externos |
| RNF02 | Idioma | OtimizaÃ§Ã£o primÃ¡ria para pt-BR |
| RNF03 | Reprodutibilidade | ExecuÃ§Ã£o determinÃ­stica sempre que possÃ­vel |
| RNF04 | Auditabilidade | Cada decisÃ£o relevante deve produzir evidÃªncia tÃ©cnica rastreÃ¡vel |
| RNF05 | SeguranÃ§a | Mapeamentos e logs sensÃ­veis armazenados com criptografia local |
| RNF06 | Desempenho | Documento jurÃ­dico mÃ©dio em tempo operacional aceitÃ¡vel no ambiente local |
| RNF07 | Modularidade | Troca de modelos NER e LLM sem reescrever o nÃºcleo |
| RNF08 | Explicabilidade | RelatÃ³rios devem justificar por que cada entidade foi ou nÃ£o anonimizada |
| RNF09 | Robustez | Sistema deve falhar de forma segura quando houver ambiguidade alta |
| RNF10 | Testabilidade | Cobertura de testes unitÃ¡rios, integraÃ§Ã£o e casos adversariais |

## 11. Artefatos Esperados por ExecuÃ§Ã£o

- documento original;
- texto extraÃ­do;
- entidades detectadas;
- decisÃµes de anonimizaÃ§Ã£o;
- documento anonimizado;
- relatÃ³rio de validaÃ§Ã£o pÃ³s-anonimizaÃ§Ã£o;
- revisÃ£o adversarial por LLM local;
- score residual de risco;
- matriz de conformidade LGPD;
- log tÃ©cnico da sessÃ£o.

## 12. CritÃ©rios de Aceite do MVP CientÃ­fico

O MVP do artigo sÃ³ deve ser considerado pronto quando:

1. anonimizar documentos reais em pt-BR com pipeline hÃ­brido;
2. executar revisÃ£o adversarial local sem API externa;
3. gerar matriz formal de conformidade LGPD;
4. produzir artefatos suficientes para experimentaÃ§Ã£o reprodutÃ­vel;
5. demonstrar claramente as trÃªs contribuiÃ§Ãµes conjuntas do framework.
