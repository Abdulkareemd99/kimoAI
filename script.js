(function () {
  "use strict";

  const DEMO_USERS_KEY = "kimoai_users";
  const CURRENT_USER_KEY = "kimoai_current_user";
  const PROJECTS_KEY = "kimoai_projects";

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
          if (frame && frame.tagName === "IFRAME") {
            frame.setAttribute("src", trigger.dataset.videoUrl);
          }
          if (frame && frame.tagName === "VIDEO") {
            frame.setAttribute("src", trigger.dataset.videoUrl);
          }
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
      });
    });

    $$("[data-modal-close]").forEach((closeBtn) => {
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
    const items = $$("[data-testimonial-item]");
    if (!items.length) return;

    let index = 0;
    const dots = $$(".dot");
    const prev = $("[data-carousel-prev]");
    const next = $("[data-carousel-next]");

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

      // Real AI generation API request can be integrated here later.
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
    $$("[data-pricing-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-pricing-action");
        if (action === "contact") {
          window.location.href = "mailto:sales@kimoai.demo?subject=KimoAI%20Business%20Plan";
        } else {
          window.location.href = "signup.html";
        }
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
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors(form);

      const name = $("#fullName").value.trim();
      const email = $("#signupEmail").value.trim().toLowerCase();
      const password = $("#signupPassword").value;
      const confirm = $("#confirmPassword").value;
      const agreed = $("#agreeTerms").checked;

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

      // In production, replace localStorage writes with a secure signup API call.
      // Example: POST /api/auth/signup with hashed password handling on the server.

      const users = getStore(DEMO_USERS_KEY, []);
      const exists = users.some((u) => u.email === email);
      if (exists) {
        setError("#signupEmailError", "An account with this email already exists.", form);
        showToast("Account already exists. Please log in.", "error");
        return;
      }

      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      setStore(DEMO_USERS_KEY, users);
      setStore(CURRENT_USER_KEY, { id: newUser.id, name: newUser.name, email: newUser.email });

      showToast("Account created successfully. Redirecting to your dashboard.", "success");
      form.reset();
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    });
  }

  function handleLogin(form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors(form);

      const email = $("#loginEmail").value.trim().toLowerCase();
      const password = $("#loginPassword").value;

      let valid = true;
      if (!isValidEmail(email)) valid = setError("#loginEmailError", "Enter a valid email.", form);
      if (!password) valid = setError("#loginPasswordError", "Password is required.", form);
      if (!valid) return;

      // In production, replace this local lookup with a secure login API request.
      // Example: POST /api/auth/login and store only server-issued auth tokens.

      const users = getStore(DEMO_USERS_KEY, []);
      const user = users.find((u) => u.email === email && u.password === password);

      if (!user) {
        setError("#loginPasswordError", "Incorrect email or password.", form);
        showToast("Unable to log in with those credentials.", "error");
        return;
      }

      setStore(CURRENT_USER_KEY, { id: user.id, name: user.name, email: user.email });
      showToast("Welcome back to KimoAI.", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);
    });
  }

  function initForgotPassword() {
    const forgotBtn = $("#forgotPasswordButton");
    const form = $("#forgot-form");
    if (!forgotBtn || !form) return;

    forgotBtn.addEventListener("click", () => {
      const modal = $("#forgotModal");
      if (!modal) return;
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      $("#forgotEmail").focus();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = $("#forgotEmail").value.trim().toLowerCase();
      const error = $("#forgotEmailError");
      if (error) error.textContent = "";

      if (!isValidEmail(email)) {
        if (error) error.textContent = "Please enter a valid email address.";
        return;
      }

      showToast("Reset request received. Check your inbox for next steps.", "success");
      form.reset();
      const modal = $("#forgotModal");
      if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }

  function initDashboard() {
    if (!document.body.classList.contains("dashboard-page")) return;

    const currentUser = getStore(CURRENT_USER_KEY, null);
    if (!currentUser) {
      showToast("Please log in to access your dashboard.", "error");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 700);
      return;
    }

    const nameSlot = $("#dashUserName");
    if (nameSlot) nameSlot.textContent = currentUser.name;

    const logoutBtn = $("#logoutButton");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        showToast("You have been logged out.", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 700);
      });
    }

    seedProjectsIfNeeded(currentUser.id);
    renderProjects();

    const search = $("#projectSearch");
    const filter = $("#projectFilter");
    if (search) search.addEventListener("input", renderProjects);
    if (filter) filter.addEventListener("change", renderProjects);

    const createVideoBtn = $("#createVideoBtn");
    if (createVideoBtn) {
      createVideoBtn.addEventListener("click", () => {
        const project = {
          id: `project_${Date.now()}`,
          userId: currentUser.id,
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
        renderProjects();
      });
    }

    const accountSettingsBtn = $("#accountSettingsBtn");
    if (accountSettingsBtn) {
      accountSettingsBtn.addEventListener("click", () => {
        showToast("Account settings panel is coming soon.", "success");
      });
    }

    function renderProjects() {
      const wrapper = $("#projectList");
      if (!wrapper) return;

      const allProjects = getStore(PROJECTS_KEY, []).filter((p) => p.userId === currentUser.id);
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
          renderProjects();
        });
      });
    }
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
