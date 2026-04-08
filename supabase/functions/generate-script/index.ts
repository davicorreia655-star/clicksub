import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface ScriptBody {
  idea?: string;
  inspirationUrl?: string;
}

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });

const buildScript = (idea: string, inspirationUrl?: string) => {
  const sourceHint = inspirationUrl
    ? `Referência opcional considerada: ${inspirationUrl}.`
    : 'Sem referência externa.';

  return {
    hook: `Pare de postar no escuro: sobre "${idea}", este erro mata sua retenção nos 3 primeiros segundos.`,
    development:
      `Comece mostrando o problema central em 1 frase, entregue 3 passos práticos e inclua um exemplo real em linguagem simples. ${sourceHint}`,
    cta: 'Se este roteiro te ajudou, comente "roteiro" para eu te enviar a versão 2.0.'
  };
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return json({ error: 'Não autenticado.' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return json({ error: 'Sessão inválida.' }, 401);
    }

    const body = (await req.json()) as ScriptBody;
    const idea = body.idea?.trim();

    if (!idea) {
      return json({ error: 'A ideia do vídeo é obrigatória.' }, 400);
    }

    const { data: profile, error: profileError } = await admin
      .from('users')
      .select('credits')
      .eq('id', userData.user.id)
      .single();

    if (profileError) {
      return json({ error: 'Erro ao consultar créditos.' }, 500);
    }

    if (profile.credits <= 0) {
      return json({ error: 'Créditos insuficientes.' }, 402);
    }

    const script = buildScript(idea, body.inspirationUrl);

    const { data: updated, error: updateError } = await admin.rpc('consume_credit', {
      user_id: userData.user.id
    });

    if (updateError) {
      return json({ error: 'Erro ao debitar crédito.' }, 500);
    }

    return json({ script, remainingCredits: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado.';
    return json({ error: message }, 500);
  }
});
