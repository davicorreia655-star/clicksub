# Arquitetura Estratégica do Dashboard — ClickSub

## 1) Estrutura completa do Dashboard

### 1.1 Princípios de arquitetura
- **North Star do produto**: aumentar o número de sessões úteis de IA por usuário por semana (proxy de retenção + consumo de créditos).
- **Primeiro valor em < 3 minutos**: usuário novo deve chegar ao primeiro insight aplicável ao YouTube rapidamente.
- **Monetização sem fricção**: momento de compra de crédito aparece no contexto de valor (não só quando trava).
- **Visibilidade de progresso**: usuário enxerga melhoria de performance de conteúdo e entende “o que fazer agora”.

### 1.2 Layout geral (desktop-first, responsivo)
- **Topbar fixa (altura ~64px)**
  - Busca global (comandos e páginas)
  - Saldo de créditos em destaque
  - Botão primário: **“Comprar Créditos”**
  - Notificações (status de pagamento, dicas da IA, alertas de performance)
  - Avatar/menu da conta
- **Sidebar esquerda (colapsável)**
  - Dashboard
  - IA Studio (Chat)
  - Conteúdo & Ideias
  - Títulos & Thumbnails
  - SEO & Keywords
  - Histórico de Sessões
  - Créditos & Pagamentos
  - Configurações
- **Área principal (grid modular 12 colunas)**
  - Linha 1: KPI cards (visão de crescimento)
  - Linha 2: Insight estratégico da IA + Recomendação acionável
  - Linha 3: Funil de uso e monetização
  - Linha 4: Atalhos de ação (gerar título, roteiro, análise de vídeo)

### 1.3 Hierarquia visual da home
1. **Saldo + estado da conta** (evita ansiedade e orienta uso)
2. **Próxima melhor ação recomendada pela IA**
3. **KPIs de resultado e atividade**
4. **Blocos de execução rápida**
5. **Histórico e profundidade analítica**

### 1.4 Mapa de telas principais
- **/dashboard** (visão executiva + ações)
- **/chat** (núcleo de valor: IA conversacional)
- **/credits** (saldo, consumo, previsão, packs)
- **/payments** (upload comprovante PIX, status, histórico)
- **/history** (conversas salvas + outputs favoritos)
- **/onboarding** (setup inicial de nicho, objetivo e frequência)

---

## 2) Componentes estratégicos

### 2.1 KPIs principais (na home)
- **Créditos disponíveis** (com badge de risco: alto/médio/baixo)
- **Mensagens IA (7 dias)**
- **Sessões produtivas** (sessão com ao menos 1 output salvo/aplicado)
- **Taxa de retorno semanal** (WAU/MAU)
- **Outputs gerados** (títulos, ideias, scripts)
- **Conversão para recarga** (visitou página de créditos → pagamento confirmado)

### 2.2 Indicadores de crescimento YouTube (produto orientado a creator)
- **Velocidade de publicação** (conteúdos planejados vs publicados)
- **Score de consistência** (dias ativos de produção)
- **Score de potencial de CTR** (com base em qualidade de título/thumb sugeridos)
- **Score de retenção potencial** (estrutura de roteiro avaliada pela IA)

> Mesmo sem integrar APIs externas no MVP, esses scores podem vir da qualidade dos prompts + outputs aprovados pelo usuário, gerando sensação de progresso real.

### 2.3 Área de insights da IA (bloco premium)
- Card “**Diagnóstico da Semana**”
  - “Você está subutilizando temas de alta intenção no seu nicho.”
- Card “**3 ações para crescer agora**”
  1. Gerar 10 títulos com promessa clara
  2. Criar roteiro com hook de 10 segundos
  3. Produzir variações de thumbnail
- Card “**Impacto estimado**”
  - “+12% chance de CTR com execução das ações sugeridas”

### 2.4 CTAs estratégicos por contexto
- **Crédito baixo (< 20%)**: “Recarregar agora com prioridade de análise”
- **Após output útil**: “Gerar mais 5 variações (consome 1 crédito)”
- **Após 3 sessões no dia**: “Ativar modo Sprint de Conteúdo”
- **No bloqueio de saldo**: paywall com proposta clara de valor e prova social

---

## 3) Fluxo do usuário dentro da plataforma

### 3.1 Primeiro acesso (onboarding guiado)
1. Cadastro/login
2. Quiz rápido (nicho, estágio do canal, objetivo em 30 dias)
3. Seleção de templates iniciais (ideias, título, roteiro, SEO)
4. Primeira interação assistida no chat (prompt sugerido)
5. “Primeiro resultado entregue” + convite para salvar/plano de execução

**Meta UX**: reduzir blank state e levar ao “aha moment” imediato.

### 3.2 Uso do chat (core loop)
1. Usuário entra no IA Studio
2. Vê créditos e custo por mensagem
3. Envia prompt
4. Loading com microfeedback: “Analisando nicho… criando opções…”
5. Recebe resposta estruturada em blocos (rápido de escanear)
6. Ações rápidas: copiar, salvar, gerar variação, transformar em checklist
7. Histórico persistente e recuperável

### 3.3 Fim dos créditos (momento crítico)
1. Usuário tenta enviar prompt com saldo 0
2. Intercept de bloqueio elegante (não punitivo)
3. Modal de upgrade com:
   - Benefício imediato (“continue desta resposta sem perder contexto”)
   - Packs recomendados por perfil de uso
   - Upload de comprovante PIX simplificado
4. Confirmação e atualização de saldo em tempo real
5. Retorno direto para o chat onde parou

### 3.4 Upgrade (fluxo de pagamento PIX manual automatizado)
1. Escolha do pacote
2. Exibição de instruções PIX + ID da transação
3. Upload comprovante
4. Estado de validação (timeline: enviado → validando → confirmado)
5. Créditos liberados + notificação in-app
6. Reengajamento: CTA “Voltar para IA Studio”

---

## 4) Estratégia de UX para aumentar compra de créditos

### 4.1 Estratégia de pricing behavior
- **Ancoragem de pacote**: destacar plano “Mais vantajoso” no meio (efeito decoy)
- **Preço por crédito visível**: mostrar economia progressiva
- **Recomendação dinâmica**: pacote sugerido com base no consumo semanal

### 4.2 Gatilhos de conversão sem ser agressivo
- **Pre-bloqueio inteligente**: alerta quando restam 5 créditos
- **Contextual paywall**: interrompe no momento de alta intenção (durante criação)
- **Recarga em 1 clique de contexto**: voltar exatamente para a conversa após confirmação
- **Prova de resultado**: “Usuários ativos geram X outputs/semana antes de publicar”

### 4.3 Redução de fricção no pagamento manual
- Upload com drag-and-drop
- Pré-validação de formato do comprovante
- Checklist visual “como enviar comprovante correto”
- Status transparente de validação + tempo estimado
- Histórico de transações claro para confiança

### 4.4 Retenção ligada à monetização
- Mostrar impacto de uso de créditos em outputs gerados
- Resumo semanal com recomendações e consumo ideal
- Missões de produção (“3 vídeos planejados esta semana”) associadas ao uso do chat

---

## 5) Estrutura visual moderna (estilo)

### 5.1 Direção de marca
- **Personalidade**: premium, confiante, prática, orientada a resultado
- **Tom visual**: SaaS moderno com contraste alto e elementos de precisão

### 5.2 Paleta de cores sugerida
- **Primária**: Indigo elétrica `#4F46E5`
- **Secundária**: Ciano destaque `#06B6D4`
- **Sucesso**: `#10B981`
- **Alerta**: `#F59E0B`
- **Erro**: `#EF4444`
- **Neutros**: fundo `#0B1020` (dark premium) e `#F8FAFC` (light clean)

### 5.3 Tipografia
- **UI**: Inter / Söhne / SF Pro (alta legibilidade)
- **Escala**:
  - H1: 32/40 semibold
  - H2: 24/32 semibold
  - Body: 14–16/22 regular
  - Labels/KPIs: 12–13 medium

### 5.4 Sistema visual
- Cards com borda suave + sombra leve
- Gradientes discretos em áreas de CTA
- Ícones lineares minimalistas
- Espaçamento generoso (8pt grid)
- Estados bem definidos (hover/focus/disabled/loading)

### 5.5 Referências de produto
- **Linear**: clareza de hierarquia e velocidade de uso
- **Stripe Dashboard**: densidade informacional elegante
- **Notion**: organização modular e sensação de controle
- **Vercel**: feedback de estado e limpeza visual

---

## 6) Microinterações e gamificação

### 6.1 Microinterações (alto impacto)
- Skeleton loading com mensagens de progresso contextual
- Confete sutil ao completar primeira “sessão produtiva”
- Barra de créditos com animação ao consumo
- Toast inteligente: “+1 output salvo para vídeo da semana”
- Hover preview em CTAs (“o que esse botão gera”)

### 6.2 Gamificação orientada a retenção
- **Streak de produção** (dias com sessão útil)
- **Missões semanais** (ex.: 5 títulos + 2 roteiros)
- **Badges funcionais** (não infantis): “Consistência 7d”, “Sprint concluído”
- **Progressão de creator level** baseada em outputs aplicáveis
- **Recompensa de engajamento**: bônus de créditos por meta semanal (limite para preservar unit economics)

---

## 7) Métricas internas para growth

### 7.1 Aquisição e ativação
- Taxa de cadastro → primeiro prompt enviado
- Tempo até primeiro valor (TTV)
- % de usuários que completam onboarding

### 7.2 Engajamento de produto
- Mensagens por usuário/semana
- Sessões produtivas por usuário
- % de respostas com ação pós-output (salvar/copiar/gerar variação)
- Frequência de retorno (D1, D7, D30)

### 7.3 Monetização
- Conversão para primeira compra de créditos
- Conversão em paywall (saldo 0 → compra)
- ARPPU (receita média por usuário pagante)
- Taxa de recompra de créditos (7/30 dias)

### 7.4 Qualidade operacional
- Tempo médio de validação de comprovante PIX
- Taxa de fraude/duplicidade detectada
- Taxa de erro em envio de chat
- Latência média de resposta IA

### 7.5 North Star e framework de decisão
- **North Star Metric**: Sessões produtivas com IA por usuário ativo/semana
- **Input metrics**: créditos disponíveis, qualidade de onboarding, tempo de resposta IA
- **Output metrics**: retenção, recompra, satisfação, crescimento de uso

---

## Blueprint de priorização (90 dias)

### Fase 1 (0–30 dias) — Base de conversão
- Home com KPIs centrais
- Chat com histórico e estados robustos
- Créditos + paywall contextual
- Fluxo de pagamento PIX com status claro

### Fase 2 (31–60 dias) — Aceleração
- Insights semanais da IA
- Missões e streaks
- Recomendação dinâmica de pacote
- Resumo semanal de performance

### Fase 3 (61–90 dias) — Escala
- Segmentação comportamental (novato, consistente, power user)
- CTAs personalizados por perfil
- Experimentos A/B de paywall e pricing
- Modelos preditivos de risco de churn por queda de uso

---

## Resultado esperado do design
- Mais sessões úteis por usuário
- Maior clareza de valor percebido do chat
- Conversão mais natural em compra de créditos
- Retenção semanal superior por loop de progresso + ação
