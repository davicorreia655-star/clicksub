const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authCard = document.getElementById('auth-card');
const appCard = document.getElementById('app-card');
const authMessage = document.getElementById('auth-message');
const scriptMessage = document.getElementById('script-message');
const creditsEl = document.getElementById('credits');
const userEmailEl = document.getElementById('user-email');
const result = document.getElementById('result');

const setMessage = (el, text, isError = false) => {
  el.textContent = text;
  el.classList.toggle('error', isError);
};

const setAuthedUI = async (session) => {
  if (!session) {
    authCard.classList.remove('hidden');
    appCard.classList.add('hidden');
    return;
  }

  authCard.classList.add('hidden');
  appCard.classList.remove('hidden');
  userEmailEl.textContent = session.user.email;
  await loadCredits(session.user.id);
};

const loadCredits = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error) {
    creditsEl.textContent = '-';
    setMessage(scriptMessage, `Erro ao buscar créditos: ${error.message}`, true);
    return;
  }

  creditsEl.textContent = String(data.credits);
};

const signup = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    setMessage(authMessage, error.message, true);
    return;
  }

  setMessage(authMessage, 'Conta criada. Se o seu projeto exigir, confirme o email para entrar.');
};

const login = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    setMessage(authMessage, error.message, true);
    return;
  }

  setMessage(authMessage, 'Login realizado com sucesso.');
  await setAuthedUI(data.session);
};

const logout = async () => {
  await supabase.auth.signOut();
  result.classList.add('hidden');
  setMessage(scriptMessage, '');
  await setAuthedUI(null);
};

const generateScript = async (event) => {
  event.preventDefault();

  const idea = document.getElementById('idea').value.trim();
  const inspirationUrl = document.getElementById('inspiration').value.trim();

  if (!idea) {
    setMessage(scriptMessage, 'Digite uma ideia para gerar o roteiro.', true);
    return;
  }

  setMessage(scriptMessage, 'Gerando roteiro...');

  const { data, error } = await supabase.functions.invoke('generate-script', {
    body: { idea, inspirationUrl }
  });

  if (error) {
    setMessage(scriptMessage, error.message || 'Falha ao gerar roteiro.', true);
    return;
  }

  if (!data?.script) {
    setMessage(scriptMessage, 'Resposta inválida da função.', true);
    return;
  }

  document.getElementById('hook').textContent = data.script.hook;
  document.getElementById('development').textContent = data.script.development;
  document.getElementById('cta').textContent = data.script.cta;
  creditsEl.textContent = String(data.remainingCredits);
  result.classList.remove('hidden');
  setMessage(scriptMessage, 'Roteiro gerado com sucesso!');
};

document.getElementById('signup-btn').addEventListener('click', signup);
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('script-form').addEventListener('submit', generateScript);

const init = async () => {
  const { data } = await supabase.auth.getSession();
  await setAuthedUI(data.session);

  supabase.auth.onAuthStateChange(async (_event, session) => {
    await setAuthedUI(session);
  });
};

init();
