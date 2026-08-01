const SUPABASE_URL = "https://qiwkksmtmffdojrwrjwz.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd2trc210bWZmZG9qcnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MDA5OTQsImV4cCI6MjEwMTE3Njk5NH0.1b4ff6fduAVx2ixjg3zWko6tsC9hyaTRYyeD6BRcARE";

const KIMOAI_SITE_URL = "https://abdulkareemd99.github.io/kimoAI";
const KIMOAI_VERIFY_REDIRECT_URL = `${KIMOAI_SITE_URL}/verify-email.html`;

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

window.kimoaiSupabase = {
    client: supabaseClient,
    siteUrl: KIMOAI_SITE_URL,
    verifyRedirectUrl: KIMOAI_VERIFY_REDIRECT_URL,
};