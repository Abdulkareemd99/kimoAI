const SUPABASE_URL = window.KIMOAI_SUPABASE_URL || window.KIMOAI_SUPABASE_CONFIG?.url || "https://qiwkksmtmffdojrwrjwz.supabase.co";
const SUPABASE_ANON_KEY = window.KIMOAI_SUPABASE_ANON_KEY || window.KIMOAI_SUPABASE_CONFIG?.anonKey || "";

const KIMOAI_SITE_URL = "https://abdulkareemd99.github.io/kimoAI";
const KIMOAI_VERIFY_REDIRECT_URL = `${KIMOAI_SITE_URL}/verify-email.html`;

let supabaseClient = null;

console.log("Supabase library loaded:", typeof window.supabase !== "undefined");

if (typeof window.supabase === "undefined" || typeof window.supabase.createClient !== "function") {
    window.KIMOAI_SUPABASE_STATUS = "library-missing";
    window.KIMOAI_SUPABASE_ERROR = "Supabase JS library did not load.";
    console.error("KimoAI Supabase library did not load.");
} else if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    });
    window.KIMOAI_SUPABASE_STATUS = "ready";
    window.KIMOAI_SUPABASE_ERROR = "";
    console.info("KimoAI Supabase client initialized", {
        url: SUPABASE_URL,
        hasAnonKey: Boolean(SUPABASE_ANON_KEY),
    });
} else {
    window.KIMOAI_SUPABASE_STATUS = "missing-key";
    window.KIMOAI_SUPABASE_ERROR = "Supabase public anon key is missing. Add the current anon/publishable key from the Supabase dashboard.";
    console.error("KimoAI Supabase is not configured. Add the current public anon or publishable key from the Supabase dashboard.");
}

window.supabaseClient = supabaseClient;

window.kimoaiSupabase = {
    client: supabaseClient,
    siteUrl: KIMOAI_SITE_URL,
    verifyRedirectUrl: KIMOAI_VERIFY_REDIRECT_URL,
    status: window.KIMOAI_SUPABASE_STATUS,
    error: window.KIMOAI_SUPABASE_ERROR,
};