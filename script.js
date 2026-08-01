(function () {
  "use strict";

  const PROJECTS_KEY = "kimoai_projects";
  const RESEND_COOLDOWN_SECONDS = 60;
  const RESEND_STATE_KEY = "kimoai_resend_state";

  const authBundle = window.kimoaiSupabase || {};
  const supabase = authBundle.client || window.supabaseClient || null;
  const verifyRedirectUrl = authBundle.verifyRedirectUrl || "";
  const authStatus = authBundle.status || window.KIMOAI_SUPABASE_STATUS || "unknown";
  const authError = authBundle.error || window.KIMOAI_SUPABASE_ERROR || "";

  console.log("Supabase auth status:", authStatus);
  if (authError) {
    console.error("Supabase auth initialization error:", authError);
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initSmoothAnchors();
    initRevealAnimations();
    initModals();
    initFaqAccordion();
    initTestimonials();
    initGeneratorPanel();
    initPricingButtons();
    initAuthForms();
    initForgotPassword();
    initDashboard();
    initVerificationPage();
    initLoginQueryHints();
  });

  function initHeader() {
    const header = $(".site-header");
    const navToggle = $(".nav-toggle");
    if (!header) return;

    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    });

    if (navToggle) {
      navToggle.addEventListener("click", () => {
        const expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!expanded));
        navToggle.classList.toggle("active", !expanded);
        header.classList.toggle("mobile-open", !expanded);
      });
    }

    $$(".nav-menu a, .nav-ctas a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 960 && header.classList.contains("mobile-open")) {
          header.classList.remove("mobile-open");
          if (navToggle) {
            navToggle.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
          }
        }
      });
    });
  }

  function initSmoothAnchors() {
    const localAnchors = $$('a[href^="#"]:not([href="#"])');
    localAnchors.forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const target = $(anchor.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function initRevealAnimations() {
    const revealItems = $$(".reveal");
    if (!revealItems.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => obs.observe(item));
  }

  function initModals() {
    const modalTriggers = $$('[data-modal-target]');
    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const modal = $(trigger.getAttribute("data-modal-target"));
        if (!modal) return;

        if (trigger.dataset.videoUrl) {
          const frame = $("iframe, video", modal);
          if (frame && frame.tagName === "IFRAME") frame.setAttribute("src", trigger.dataset.videoUrl);
          if (frame && frame.tagName === "VIDEO") frame.setAttribute("src", trigger.dataset.videoUrl);
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
      });
    });

    $$('[data-modal-close]').forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => closeModal(closeBtn.closest(".modal")));
    });

    $$(".modal").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const activeModal = $(".modal.active");
      if (activeModal) closeModal(activeModal);
    });

    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      const frame = $("iframe", modal);
      if (frame) frame.setAttribute("src", "");
    }
  }

  function initFaqAccordion() {
    const faqItems = $$(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const button = $(".faq-question", item);
      if (!button) return;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");
        faqItems.forEach((faq) => {
          faq.classList.remove("active");
          const q = $(".faq-question", faq);
          if (q) q.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("active");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function initTestimonials() {
    const items = $$('[data-testimonial-item]');
    if (!items.length) return;

    let index = 0;
    const dots = $$(".dot");
    const prev = $('[data-carousel-prev]');
    const next = $('[data-carousel-next]');

    function render() {
      items.forEach((item, i) => item.classList.toggle("hidden", i !== index));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        index = i;
        render();
      });
    });

    if (prev) {
      prev.addEventListener("click", () => {
        index = (index - 1 + items.length) % items.length;
        render();
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        index = (index + 1) % items.length;
        render();
      });
    }

    render();
  }

  function initGeneratorPanel() {
    const form = $("#generator-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = $("button[type='submit']", form);
      if (button) {
        button.disabled = true;
        button.textContent = "Preparing Setup...";
      }

      setTimeout(() => {
        showToast("Generation setup saved. Connect your AI API to render videos.", "success");
        if (button) {
          button.disabled = false;
          button.textContent = "Generate Video";
        }
      }, 500);
    });
  }

  function initPricingButtons() {
    $$('[data-pricing-action]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-pricing-action");
        if (action === "contact") {
          window.location.href = "mailto:sales@kimoai.demo?subject=KimoAI%20Business%20Plan";
          return;
        }
        window.location.href = "signup.html";
      });
    });
  }

  function initAuthForms() {
    const signupForm = $("#signup-form");
    if (signupForm) handleSignup(signupForm);

    const loginForm = $("#login-form");
    if (loginForm) handleLogin(loginForm);

    $$(".toggle-password").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = $(btn.getAttribute("data-target"));
        if (!target) return;
        const isPassword = target.type === "password";
        target.type = isPassword ? "text" : "password";
        btn.textContent = isPassword ? "Hide" : "Show";
      });
    });
  }

  function handleSignup(form) {
    if (!supabase) {
      const message = authError || "Authentication service unavailable. Add the current Supabase public anon key from the dashboard to enable sign-up.";
      disableForm(form, message);
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearErrors(form);

      const name = $("#fullName")?.value.trim() || "";
      const email = $("#signupEmail")?.value.trim().toLowerCase() || "";
      const password = $("#signupPassword")?.value || "";
      const confirm = $("#confirmPassword")?.value || "";
      const agreed = $("#agreeTerms")?.checked || false;

      let valid = true;
      if (!name) valid = setError("#fullNameError", "Full name is required.", form);
      if (!isValidEmail(email)) valid = setError("#signupEmailError", "Enter a valid email address.", form);
      if (password.length < 8) valid = setError("#signupPasswordError", "Use at least 8 characters.", form);
      if (confirm !== password) valid = setError("#confirmPasswordError", "Passwords do not match.", form);
      if (!agreed) valid = setError("#agreeTermsError", "You must accept the terms.", form);

      if (!valid) {
        showToast("Please fix the highlighted fields.", "error");
        return;
      }

      const submitButton = $("button[type='submit']", form);
      const originalLabel = submitButton ? submitButton.textContent : "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Creating Account...";
      }

      try {
        console.info("Attempting Supabase signup", { email });
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
            emailRedirectTo: verifyRedirectUrl || "https://abdulkareemd99.github.io/kimoAI/verify-email.html",
          },
        });

        console.log("Supabase signup response", { data, error });

        if (error) {
          console.error("Supabase signup error:", error);
          const msg = mapSupabaseError(error);
          setError("#signupEmailError", msg, form);
          showToast(msg, "error");
          return;
        }

        showToast(
          "Your account has been created. We've sent a verification email to your email address. Please check your inbox and verify your email before logging in.",
          "success"
        );
        form.reset();
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalLabel;
        }
      }
    });
  }

  function handleLogin(form) {
    if (!supabase) {
      const message = authError || "Authentication service unavailable. Add the current Supabase public anon key from the dashboard to enable login.";
      disableForm(form, message);
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearErrors(form);

      const email = $("#loginEmail")?.value.trim().toLowerCase() || "";
      const password = $("#loginPassword")?.value || "";

      let valid = true;
      if (!isValidEmail(email)) valid = setError("#loginEmailError", "Enter a valid email.", form);
      if (!password) valid = setError("#loginPasswordError", "Password is required.", form);
      if (!valid) return;

      const submitButton = $("button[type='submit']", form);
      const originalLabel = submitButton ? submitButton.textContent : "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Logging In...";
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error || !data.user) {
          const msg = mapSupabaseError(error);
          setError("#loginPasswordError", msg, form);
          showToast(msg, "error");
          if (msg.includes("verify your email")) showResendHelper(email);
          return;
        }

        if (!data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          const msg = "Please verify your email address before logging in.";
          setError("#loginPasswordError", msg, form);
          showToast(msg, "error");
          showResendHelper(email);
          return;
        }

        showToast("Login success. Redirecting to your dashboard.", "success");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 600);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalLabel;
        }
      }
    });
  }

  function initForgotPassword() {
    if (!supabase) return;

    const forgotBtn = $("#forgotPasswordButton");
    const form = $("#forgot-form");
    if (!forgotBtn || !form) return;

    forgotBtn.addEventListener("click", () => {
      const modal = $("#forgotModal");
      if (!modal) return;
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      $("#forgotEmail")?.focus();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = $("#forgotEmail")?.value.trim().toLowerCase() || "";
      const errorEl = $("#forgotEmailError");
      if (errorEl) errorEl.textContent = "";

      if (!isValidEmail(email)) {
        if (errorEl) errorEl.textContent = "Please enter a valid email address.";
        return;
      }

      const submitButton = $("button[type='submit']", form);
      const originalLabel = submitButton ? submitButton.textContent : "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: verifyRedirectUrl,
      });

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }

      if (error) {
        const msg = mapSupabaseError(error);
        if (errorEl) errorEl.textContent = msg;
        showToast(msg, "error");
        return;
      }

      showToast("Password reset email sent. Check your inbox.", "success");
      form.reset();
      const modal = $("#forgotModal");
      if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }

  async function initDashboard() {
    if (!document.body.classList.contains("dashboard-page")) return;
    if (!supabase) {
      const message = authError || "Authentication service unavailable. Add the current Supabase public anon key from the dashboard to enable the dashboard.";
      showToast(message, "error");
      return;
    }

    const user = await requireVerifiedUser();
    if (!user) return;

    const nameSlot = $("#dashUserName");
    if (nameSlot) {
      nameSlot.textContent = user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator";
    }

    const logoutBtn = $("#logoutButton");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await supabase.auth.signOut();
        showToast("You have been logged out.", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 450);
      });
    }

    seedProjectsIfNeeded(user.id);
    renderProjects(user.id);

    const search = $("#projectSearch");
    const filter = $("#projectFilter");
    if (search) search.addEventListener("input", () => renderProjects(user.id));
    if (filter) filter.addEventListener("change", () => renderProjects(user.id));

    const createVideoBtn = $("#createVideoBtn");
    if (createVideoBtn) {
      createVideoBtn.addEventListener("click", () => {
        const project = {
          id: `project_${Date.now()}`,
          userId: user.id,
          title: "New Concept Video",
          date: new Date().toISOString().slice(0, 10),
          status: "Draft",
          thumb:
            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=640&q=80",
        };

        const allProjects = getStore(PROJECTS_KEY, []);
        allProjects.unshift(project);
        setStore(PROJECTS_KEY, allProjects);
        showToast("A new project has been created.", "success");
        renderProjects(user.id);
      });
    }

    const accountSettingsBtn = $("#accountSettingsBtn");
    if (accountSettingsBtn) {
      accountSettingsBtn.addEventListener("click", () => {
        showToast("Account settings panel is coming soon.", "success");
      });
    }

    function renderProjects(currentUserId) {
      const wrapper = $("#projectList");
      if (!wrapper) return;

      const allProjects = getStore(PROJECTS_KEY, []).filter((p) => p.userId === currentUserId);
      const query = ($("#projectSearch")?.value || "").trim().toLowerCase();
      const statusFilter = $("#projectFilter")?.value || "all";

      const filtered = allProjects.filter((project) => {
        const matchQuery = project.title.toLowerCase().includes(query);
        const matchStatus = statusFilter === "all" || project.status === statusFilter;
        return matchQuery && matchStatus;
      });

      if (!filtered.length) {
        wrapper.innerHTML = '<div class="empty-state">No projects match your filters. Try a new search or create a video.</div>';
        return;
      }

      wrapper.innerHTML = filtered
        .map(
          (project) => `
            <article class="project-card" data-project-id="${project.id}">
              <img src="${project.thumb}" alt="${project.title} thumbnail" loading="lazy" />
              <div>
                <h3>${project.title}</h3>
                <p>Created on ${project.date}</p>
                <span class="project-status">${project.status}</span>
              </div>
              <div class="project-actions">
                <button class="btn btn-secondary btn-small" data-project-edit="${project.id}">Edit</button>
                <button class="btn btn-secondary btn-small" data-project-delete="${project.id}">Delete</button>
              </div>
            </article>
          `
        )
        .join("");

      $$('[data-project-edit]', wrapper).forEach((btn) => {
        btn.addEventListener("click", () => {
          showToast("Project editor will open here in a connected backend flow.", "success");
        });
      });

      $$('[data-project-delete]', wrapper).forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-project-delete");
          const all = getStore(PROJECTS_KEY, []);
          const next = all.filter((project) => project.id !== id);
          setStore(PROJECTS_KEY, next);
          showToast("Project deleted.", "success");
          renderProjects(currentUserId);
        });
      });
    }
  }

  function initVerificationPage() {
    const shell = $("#verifyEmailApp");
    if (!shell || !supabase) return;

    const titleEl = $("#verifyStateTitle");
    const copyEl = $("#verifyStateCopy");
    const continueBtn = $("#continueToLoginButton");
    const resendForm = $("#resendVerificationForm");
    const resendEmail = $("#resendEmail");
    const resendError = $("#resendEmailError");
    const resendButton = $("#resendButton");
    const cooldownLabel = $("#resendCooldown");

    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        window.location.href = "login.html";
      });
    }

    hydrateEmailFromQuery();
    setVerifyState("loading");
    updateResendCooldown(cooldownLabel, resendButton);
    setInterval(() => updateResendCooldown(cooldownLabel, resendButton), 1000);
    checkVerificationResult();

    if (resendForm) {
      resendForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (resendError) resendError.textContent = "";

        const email = (resendEmail?.value || "").trim().toLowerCase();
        if (!isValidEmail(email)) {
          if (resendError) resendError.textContent = "Please enter a valid email address.";
          return;
        }

        if (isResendCoolingDown()) {
          showToast("Please wait before requesting another verification email.", "error");
          return;
        }

        resendButton.disabled = true;
        resendButton.textContent = "Sending...";

        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
          options: {
            emailRedirectTo: verifyRedirectUrl,
          },
        });

        resendButton.disabled = false;
        resendButton.textContent = "Resend Verification Email";

        if (error) {
          const msg = mapSupabaseError(error);
          if (resendError) resendError.textContent = msg;
          showToast(msg, "error");
          return;
        }

        startResendCooldown();
        showToast("Verification email sent successfully.", "success");
      });
    }

    async function checkVerificationResult() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else {
          await supabase.auth.getSession();
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && user.email_confirmed_at) {
          setVerifyState("success");
          await supabase.auth.signOut();
          return;
        }

        setVerifyState("failed");
      } catch (_) {
        setVerifyState("failed");
      }
    }

    function setVerifyState(state) {
      if (state === "loading") {
        if (titleEl) titleEl.textContent = "Checking Verification...";
        if (copyEl) copyEl.textContent = "Please wait while we confirm your verification link.";
        if (continueBtn) continueBtn.classList.add("hidden");
        return;
      }

      if (state === "success") {
        if (titleEl) titleEl.textContent = "Email Verified Successfully!";
        if (copyEl) copyEl.textContent = "Your KimoAI account is now verified. You can now log in.";
        if (continueBtn) continueBtn.classList.remove("hidden");
        return;
      }

      if (titleEl) titleEl.textContent = "Verification Failed";
      if (copyEl) {
        copyEl.textContent = "This verification link is invalid or expired. Please request a new verification email below.";
      }
      if (continueBtn) continueBtn.classList.remove("hidden");
    }

    function hydrateEmailFromQuery() {
      const email = new URLSearchParams(window.location.search).get("email") || "";
      if (email && resendEmail) resendEmail.value = email;
    }
  }

  function initLoginQueryHints() {
    const isLoginPage = !!$("#login-form");
    if (!isLoginPage) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("verificationRequired") === "1") {
      showToast("Please verify your email address before logging in.", "error");
    }
  }

  async function requireVerifiedUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "login.html";
      return null;
    }

    if (!user.email_confirmed_at) {
      const email = encodeURIComponent(user.email || "");
      await supabase.auth.signOut();
      window.location.href = `verify-email.html?email=${email}`;
      return null;
    }

    return user;
  }

  function showResendHelper(email) {
    const slot = $("#loginResendHelp");
    if (!slot) return;
    slot.classList.remove("hidden");
    slot.innerHTML = `<p class="small-note" style="margin-top: 4px;">Need another verification email? <a href="verify-email.html?email=${encodeURIComponent(
      email
    )}">Resend Verification Email</a></p>`;
  }

  function mapSupabaseError(error) {
    if (!error) return "Something went wrong. Please try again.";
    const message = String(error.message || "").toLowerCase();

    if (message.includes("invalid login credentials")) return "Incorrect email or password.";
    if (message.includes("email not confirmed")) return "Please verify your email address before logging in.";
    if (message.includes("already registered") || message.includes("already been registered")) {
      return "An account with this email already exists.";
    }
    if (message.includes("over_email_send_rate_limit") || message.includes("rate limit") || message.includes("too many")) {
      return "Too many requests. Please wait a moment and try again.";
    }

    return error.message || "Something went wrong. Please try again.";
  }

  function startResendCooldown() {
    const until = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
    setStore(RESEND_STATE_KEY, { until });
  }

  function isResendCoolingDown() {
    const state = getStore(RESEND_STATE_KEY, null);
    return !!(state && Number(state.until) > Date.now());
  }

  function updateResendCooldown(labelEl, buttonEl) {
    const state = getStore(RESEND_STATE_KEY, null);
    if (!state || Number(state.until) <= Date.now()) {
      if (labelEl) labelEl.textContent = "";
      if (buttonEl) buttonEl.disabled = false;
      return;
    }

    const secondsLeft = Math.max(0, Math.ceil((Number(state.until) - Date.now()) / 1000));
    if (labelEl) labelEl.textContent = `You can resend in ${secondsLeft}s`;
    if (buttonEl) buttonEl.disabled = true;
  }

  function seedProjectsIfNeeded(userId) {
    const all = getStore(PROJECTS_KEY, []);
    const hasUserProjects = all.some((p) => p.userId === userId);
    if (hasUserProjects) return;

    const seed = [
      {
        id: `project_${Date.now()}_1`,
        userId,
        title: "Summer Product Ad",
        date: "2026-07-27",
        status: "Published",
        thumb:
          "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=640&q=80",
      },
      {
        id: `project_${Date.now()}_2`,
        userId,
        title: "Founders Story Reel",
        date: "2026-07-25",
        status: "In Review",
        thumb:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=640&q=80",
      },
      {
        id: `project_${Date.now()}_3`,
        userId,
        title: "Mobile App Launch Teaser",
        date: "2026-07-23",
        status: "Draft",
        thumb:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=640&q=80",
      },
    ];

    setStore(PROJECTS_KEY, [...seed, ...all]);
  }

  function disableForm(form, message) {
    const submitButton = $("button[type='submit']", form);
    if (submitButton) submitButton.disabled = true;
    showToast(message, "error");
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(selector, message, root = document) {
    const target = $(selector, root);
    if (target) target.textContent = message;
    return false;
  }

  function clearErrors(root = document) {
    $$(".field-error", root).forEach((el) => {
      el.textContent = "";
    });
  }

  function getStore(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function setStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function showToast(message, type = "success") {
    let wrap = $(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    wrap.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }
})();
