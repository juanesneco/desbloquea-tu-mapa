### Connection String

postgresql://postgres.wjhmycxkvmtxtyrcqgfm:zubfYx-jyhbic-mofja3@aws-0-us-west-1.pooler.supabase.com:5432/postgres

### Supabase Commmand

npx -y @modelcontextprotocol/server-postgres postgresql://postgres.wjhmycxkvmtxtyrcqgfm:zubfYx-jyhbic-mofja3@aws-0-us-west-1.pooler.supabase.com:5432/postgres

### SQL Command

alter table prompts add column title text;

update prompts set title = 'Quitando la Máscara' where metadata->>'ejercicio' = '1';
update prompts set title = 'Explorando Tu Mapa Interior' where metadata->>'ejercicio' = '2';

alter table prompts drop column metadata;

.modal {
  display: none; 
  position: fixed; 
  z-index: 1000; 
  left: 0; top: 0; width: 100%; height: 100%;
  overflow: auto; background-color: rgba(0,0,0,0.4);
}
.modal-content {
  background-color: #fff; margin: 10% auto; padding: 2rem; border: 1px solid #888; width: 90%; max-width: 400px; border-radius: 8px; position: relative;
}
.close {
  color: #aaa; position: absolute; top: 10px; right: 20px; font-size: 28px; font-weight: bold; cursor: pointer;
}
.close:hover, .close:focus { color: #000; text-decoration: none; cursor: pointer; }

.google-login-btn {
  background: #fff;
  color: #444;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.google-login-btn:hover {
  background: #f5f5f5;
}

<script>
const supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

const openLoginModalBtn = document.getElementById('openLoginModal');
const loginModal = document.getElementById('loginModal');
const closeLoginModalBtn = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');
const authError = document.getElementById('authError');

// Open modal
openLoginModalBtn.onclick = () => { loginModal.style.display = 'block'; };
// Close modal
closeLoginModalBtn.onclick = () => { loginModal.style.display = 'none'; };
// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target == loginModal) loginModal.style.display = 'none';
};

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.textContent = '';
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  let { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Try sign up
    let { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      authError.textContent = signUpError.message;
      return;
    }
    authError.textContent = 'Revisa tu correo para confirmar tu cuenta.';
    return;
  }
  // On login, upsert profile
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      last_login: new Date().toISOString()
    });
  }
  // Optionally, redirect or reload
  window.location.reload();
});

// Optionally, hide login button if already logged in
supabase.auth.getUser().then(async ({ data: { user } }) => {
  if (user) {
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      last_login: new Date().toISOString()
    });
    openLoginModalBtn.style.display = 'none';
  }
});

document.getElementById('googleLoginBtn').onclick = async function() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) {
    authError.textContent = error.message;
  }
};
</script>

<button type="button" id="googleLoginBtn" class="google-login-btn" style="width:100%;margin:1rem 0 0 0;">
  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style="width:20px;vertical-align:middle;margin-right:8px;">
  Iniciar sesión con Google
</button>

<a href="profile.html">Mi Perfil</a>