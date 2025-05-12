// Import Supabase from CDN if not already loaded
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
// <script src="supabase-keys.js"></script>

const supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

async function getPrompts() {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function savePrompt(promptData) {
  const { data, error } = await supabase
    .from('prompts')
    .insert([promptData])
    .select();
  if (error) throw error;
  return data;
}

// Expose functions globally for prompts.html
window.getPrompts = getPrompts;
window.savePrompt = savePrompt; 