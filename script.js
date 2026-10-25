
/* ==================================
   SAURABH - DIGITAL PORTFOLIO
   Main JavaScript
================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Typing animation
  const typingText = document.getElementById("typing-text");

  const words = [
    "MCA Student",
    "Aspiring Software Developer",
    "Web Developer"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeEffect() {
    if (!typingText) return;

    const currentWord = words[wordIndex];
    typingText.textContent = currentWord.substring(0, charIndex);

    let delay = deleting ? 45 : 90;

    if (!deleting && charIndex === currentWord.length) {
      deleting = true;
      delay = 1400;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    } else {
      charIndex += deleting ? -1 : 1;
    }

    window.setTimeout(typeEffect, delay);
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (typingText && !reduceMotion) {
    typeEffect();
  } else if (typingText) {
    typingText.textContent = words[0];
  }

  // 2. Mobile navigation menu
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.textContent = "☰";
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // 3. Dark / Light theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.textContent = isDark ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
    }
  }

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("portfolio-theme");
  } catch (error) {
    // Theme still works if browser storage is unavailable.
  }

  applyTheme(savedTheme === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch (error) {
        // The selected theme remains active for this page session.
      }
    });
  }

  // 4. Scroll reveal animation
  const revealElements = document.querySelectorAll(
    ".hero-content, .developer-avatar, " +
    ".section-kicker, .section-title, .section-description, " +
    ".about-panel, .skill-card, .project-card, " +
    ".education-card, .resume-panel, .contact-card"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  }

  // 5. Highlight the navigation link for the visible section
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const matches = link.getAttribute("href") ===
              `#${entry.target.id}`;

            link.classList.toggle("active", matches);
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // 6. Back-to-top button
  const backToTop = document.getElementById("back-to-top");

  function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle("visible", window.scrollY > 350);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }

  // 7. Automatically update the footer year
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
