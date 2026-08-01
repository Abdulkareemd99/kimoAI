(function () {
  const existingConfig = window.KIMOAI_SUPABASE_CONFIG || {};

  window.KIMOAI_SUPABASE_CONFIG = {
    url: existingConfig.url || "https://qiwkksmtmffdojrwrjwz.supabase.co",
    anonKey: existingConfig.anonKey || window.KIMOAI_SUPABASE_ANON_KEY || "",
    ...existingConfig,
  };

  window.KIMOAI_SUPABASE_URL = window.KIMOAI_SUPABASE_CONFIG.url;
  window.KIMOAI_SUPABASE_ANON_KEY = window.KIMOAI_SUPABASE_CONFIG.anonKey;
  window.KIMOAI_SUPABASE_STATUS = "ready";
  window.KIMOAI_SUPABASE_ERROR = "";

  if (!window.KIMOAI_SUPABASE_ANON_KEY) {
    window.KIMOAI_SUPABASE_STATUS = "missing-key";
    window.KIMOAI_SUPABASE_ERROR = "Supabase public anon key is not configured yet.";
  }
})();
