# ClickSub

SaaS simples para gerar roteiros virais (TikTok, Reels e Shorts) com sistema de créditos usando Supabase.

## Stack
- Frontend: HTML + CSS + JavaScript (simples e direto)
- Backend: Supabase (Auth, Postgres, Edge Functions)
- Banco: tabela `users` com créditos por usuário

## Fluxo do produto
1. Usuário cria conta / faz login com email e senha.
2. Na tela principal, escreve uma ideia e (opcionalmente) um link de inspiração.
3. Clica em **Gerar roteiro**.
4. Edge Function valida sessão e créditos.
5. Se tiver crédito, consome 1 e devolve roteiro com `hook`, `desenvolvimento` e `cta`.
6. Frontend renderiza roteiro e atualiza créditos na interface.

## Estrutura
- `index.html`: UI com autenticação e geração
- `styles.css`: tema simples e moderno
- `app.js`: lógica de sessão, auth e chamada da função
- `supabase/migrations/0001_init.sql`: schema + RLS
- `supabase/functions/generate-script/index.ts`: função que gera roteiro e debita crédito
- `supabase/functions/_shared/cors.ts`: CORS reutilizável

## Configuração
1. Crie projeto no Supabase.
2. Rode a migration `supabase/migrations/0001_init.sql`.
3. Faça deploy das edge functions.
4. Copie URL e anon key no `app.js`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## Deploy da function
```bash
supabase functions deploy generate-script
```

## Rodar frontend local
Qualquer servidor estático funciona. Exemplo:

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

## Segurança e boas práticas
- Validação de crédito ocorre no backend (nunca só no frontend).
- A função usa `auth.getUser()` para confiar no usuário autenticado.
- Atualização de créditos e criação do roteiro ocorre dentro de transação SQL atômica.
- RLS habilitado para impedir acesso cruzado entre usuários.
