const SUPABASE_URL = "https://qiwkksmtmffdojrwrjwz.supabase.co";
const SUPABASE_ANON_KEY = window.KIMOAI_SUPABASE_ANON_KEY || "";

const KIMOAI_SITE_URL = "https://abdulkareemd99.github.io/kimoAI";
const KIMOAI_VERIFY_REDIRECT_URL = `${KIMOAI_SITE_URL}/verify-email.html`;

let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    });
} else {
    console.error("KimoAI Supabase is not configured. Set window.KIMOAI_SUPABASE_ANON_KEY to the anon or publishable key from the Supabase project dashboard.");
}

window.supabaseClient = supabaseClient;

window.kimoaiSupabase = {
    client: supabaseClient,
    siteUrl: KIMOAI_SITE_URL,
    verifyRedirectUrl: KIMOAI_VERIFY_REDIRECT_URL,
};

if (supabaseClient) {
    console.info("KimoAI Supabase client initialized", {
        url: SUPABASE_URL,
        hasAnonKey: Boolean(SUPABASE_ANON_KEY),
    });
}