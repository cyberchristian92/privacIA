# PrivacIA â€” Matriz de Requisitos TÃ©cnicos x LGPD

**Objetivo:** estabelecer rastreabilidade formal entre decisÃµes tÃ©cnicas do software e dispositivos da LGPD.

## 1. Estrutura da Matriz

Cada requisito tÃ©cnico deve possuir:

- identificador estÃ¡vel;
- descriÃ§Ã£o objetiva;
- componente responsÃ¡vel;
- dispositivo LGPD correlato;
- evidÃªncia tÃ©cnica verificÃ¡vel;
- status de implementaÃ§Ã£o.

## 2. Matriz Base (16 Requisitos)

| ID | Requisito TÃ©cnico | Componente | LGPD | EvidÃªncia Esperada |
|---|---|---|---|---|
| LGPD-01 | Detectar dados pessoais diretos | Detection Layer | Art. 5, I | lista estruturada de entidades |
| LGPD-02 | Detectar dados pessoais indiretos / contextuais | Detection Layer | Arts. 5, I e 12 | regras contextuais + spans detectados |
| LGPD-03 | Classificar sensibilidade da entidade | Detection/Policy | Arts. 6, II e 11 | campo `sensitivity_level` |
| LGPD-04 | Aplicar minimizaÃ§Ã£o por polÃ­tica | Policy Layer | Art. 6, III | operador aplicado por entidade |
| LGPD-05 | Limitar uso ao fim declarado | Policy/Compliance | Art. 6, I | polÃ­tica vinculada ao caso de uso |
| LGPD-06 | Preservar necessidade e proporcionalidade | Policy/Compliance | Art. 6, II e III | justificativa de retenÃ§Ã£o ou supressÃ£o |
| LGPD-07 | Executar anonimizaÃ§Ã£o sem envio a terceiros externos | Runtime/Infra | Arts. 6, VII e 46 | log de execuÃ§Ã£o local |
| LGPD-08 | Armazenar mapeamento sensÃ­vel com proteÃ§Ã£o criptogrÃ¡fica | Audit Layer | Art. 46 | evidÃªncia de criptografia local |
| LGPD-09 | Permitir descarte controlado do mapeamento | Audit Layer | Arts. 15 e 16 | TTL / exclusÃ£o de sessÃ£o |
| LGPD-10 | Verificar se restaram identificadores apÃ³s anonimizaÃ§Ã£o | Verification Layer | Arts. 6, VIII e 12 | relatÃ³rio de segunda passagem |
| LGPD-11 | Testar reidentificaÃ§Ã£o residual de modo adversarial | Adversarial Layer | Art. 12 | `adversarial_review.json` |
| LGPD-12 | Bloquear saÃ­da quando risco residual crÃ­tico persistir | Adversarial/Policy | Arts. 6, VIII e 46 | `approved=false` + trava de envio |
| LGPD-13 | Manter trilha de auditoria da sessÃ£o | Audit Layer | Art. 37 | log tÃ©cnico versionado |
| LGPD-14 | Gerar matriz de rastreabilidade jurÃ­dico-tÃ©cnica | Compliance Layer | Arts. 6, X e 37 | relatÃ³rio de conformidade |
| LGPD-15 | Registrar limitaÃ§Ãµes e zonas de incerteza | Compliance Layer | Arts. 6, VI e X | seÃ§Ã£o de limitaÃ§Ãµes |
| LGPD-16 | Permitir revisÃ£o humana e governanÃ§a sobre a decisÃ£o | Interface/Workflow | Arts. 6, VI e 50 | checkpoint de aprovaÃ§Ã£o humana |

## 3. InterpretaÃ§Ã£o JurÃ­dico-TÃ©cnica

### 3.1 Art. 5 e Art. 12

O software precisa partir de conceito funcional de dado pessoal e anonimizaÃ§Ã£o, nÃ£o apenas de listas fixas de identificadores. Por isso a camada contextual Ã© indispensÃ¡vel.

### 3.2 Art. 6

Os princÃ­pios da finalidade, necessidade, adequaÃ§Ã£o, seguranÃ§a, prevenÃ§Ã£o e responsabilizaÃ§Ã£o precisam aparecer como comportamento tÃ©cnico observÃ¡vel, e nÃ£o sÃ³ como declaraÃ§Ã£o abstrata.

### 3.3 Art. 46

SeguranÃ§a nÃ£o se esgota em â€œrodar localmenteâ€. TambÃ©m exige proteÃ§Ã£o do mapeamento reversÃ­vel e contenÃ§Ã£o do fluxo de dados.

### 3.4 Art. 37

Sem trilha de auditoria, a conformidade Ã© alegada, mas nÃ£o demonstrada.

## 4. Uso no Artigo

Esta matriz sustenta uma das contribuiÃ§Ãµes centrais do artigo: a passagem de uma anonimizaÃ§Ã£o â€œtÃ©cnicaâ€ para uma anonimizaÃ§Ã£o **juridicamente rastreÃ¡vel**.

## 5. CritÃ©rio de Aceite RegulatÃ³rio do Framework

PrivacIA sÃ³ satisfaz a tese do artigo se:

1. todos os 16 requisitos possuÃ­rem correspondÃªncia tÃ©cnica explÃ­cita;
2. cada correspondÃªncia gerar evidÃªncia auditÃ¡vel;
3. a revisÃ£o adversarial puder reprovar uma anonimizaÃ§Ã£o aparentemente â€œboaâ€;
4. a saÃ­da final registrar limitaÃ§Ãµes, nÃ£o apenas sucessos.
