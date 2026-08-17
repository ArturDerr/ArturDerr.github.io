document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".skill-item");

  function openItem(item) {
    item.classList.add("is-open");
    const content = item.querySelector(".skill-content");
    const icon = item.querySelector(".skill-icon");

    if (content) {
      content.classList.remove("grid-rows-[0fr]", "opacity-0");
      content.classList.add("grid-rows-[1fr]", "opacity-100");
    }
    if (icon) {
      icon.classList.remove("rotate-0");
      icon.classList.add("rotate-45");
    }
  }

  function closeItem(item) {
    item.classList.remove("is-open");
    const content = item.querySelector(".skill-content");
    const icon = item.querySelector(".skill-icon");

    if (content) {
      content.classList.remove("grid-rows-[1fr]", "opacity-100");
      content.classList.add("grid-rows-[0fr]", "opacity-0");
    }
    if (icon) {
      icon.classList.remove("rotate-45");
      icon.classList.add("rotate-0");
    }
  }

  items.forEach((item) => {
    const toggle = item.querySelector(".skill-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        items.forEach((i) => closeItem(i));
        if (!isOpen) openItem(item);
      });
    }
  });

  const defaultItem = document.querySelector(
    '.skill-item[data-skill="frontend"]',
  );
  if (defaultItem) openItem(defaultItem);

  const inViewEl = document.querySelector(".skills-inview");
  if (inViewEl) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inViewEl.classList.remove(
            "opacity-0",
            "translate-y-[5px]",
            "blur-[4px]",
          );
          inViewEl.classList.add("opacity-100", "translate-y-0", "blur-0");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -100px 0px" },
    );
    observer.observe(inViewEl);
  }

  const preloader = document.getElementById("preloader");
  const progressText = document.getElementById("progress");

  if (preloader && progressText) {
    const images = document.querySelectorAll("#cases-track img");
    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        const preloadImage = new Image();
        preloadImage.src = src;
      }
    });

    document.body.classList.add("loading");

    const duration = 1500;
    const start = performance.now();

    function animatePreloader(time) {
      const elapsed = time - start;
      const percent = Math.min(elapsed / duration, 1);
      const progress = Math.floor(percent * 100);

      progressText.textContent = progress + "%";

      const containerHeight = preloader.offsetHeight;
      const textHeight = progressText.offsetHeight;
      const maxMove = containerHeight - textHeight;
      const moveY = maxMove * percent;

      progressText.style.transform = `translateY(-${moveY}px)`;

      if (percent < 1) {
        requestAnimationFrame(animatePreloader);
      } else {
        preloader.style.transition = "opacity 0.6s ease";
        preloader.style.opacity = "0";

        setTimeout(() => {
          preloader.remove();
          document.body.classList.remove("loading");
        }, 600);
      }
    }
    requestAnimationFrame(animatePreloader);
  }
});

const header = document.getElementById("header");
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-link");

let open = false;

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    open = !open;
    burger.classList.toggle("burger-open", open);
    mobileMenu.classList.toggle("opacity-100", open);
    mobileMenu.classList.toggle("pointer-events-auto", open);

    if (open) {
      targetScroll = currentScroll;
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      open = false;
      burger.classList.remove("burger-open");
      mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
    });
  });
}

const wrapper = document.getElementById("cursor-wrapper");
const cursor = document.getElementById("cursor");

if (wrapper && cursor) {
  let mouseX = 0,
    mouseY = 0,
    scale = 1;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    wrapper.style.transform = `translate(${mouseX - 12}px, ${mouseY - 12}px)`;
  });

  document.querySelectorAll(".cursor-hover").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      scale = 2.5;
      cursor.style.transform = `scale(${scale})`;
    });
    el.addEventListener("mouseleave", () => {
      scale = 1;
      cursor.style.transform = `scale(${scale})`;
    });
  });
}

let currentScroll = window.scrollY || 0;
let targetScroll = window.scrollY || 0;
let ease = 0.08;

window.addEventListener(
  "wheel",
  (e) => {
    if (open) return;
    targetScroll += e.deltaY;
    targetScroll = Math.max(
      0,
      Math.min(targetScroll, document.body.scrollHeight - window.innerHeight),
    );
    e.preventDefault();
  },
  { passive: false },
);

window.addEventListener("scroll", () => {
  if (Math.abs(window.scrollY - currentScroll) > 10) {
    targetScroll = window.scrollY;
    currentScroll = window.scrollY;
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();

      let offsetTop =
        targetElement.getBoundingClientRect().top + window.scrollY;

      targetScroll = Math.max(
        0,
        Math.min(offsetTop, document.body.scrollHeight - window.innerHeight),
      );

      if (open) {
        open = false;
        if (burger) burger.classList.remove("burger-open");
        if (mobileMenu)
          mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
      }
    }
  });
});

function smoothScroll() {
  if (!open) {
    const diff = targetScroll - currentScroll;
    if (Math.abs(diff) > 0.5) {
      currentScroll += diff * ease;
      window.scrollTo(0, currentScroll);
    } else if (Math.abs(diff) > 0) {
      currentScroll = targetScroll;
      window.scrollTo(0, currentScroll);
    }
  }
  requestAnimationFrame(smoothScroll);
}
smoothScroll();

let headerLastScroll = window.scrollY || 0;
let headerLastState = null; 

function handleHeader() {
  if (!header) return;

  const current = currentScroll;
  const shouldBeScrolled = current > 80;

  if (open) {
    header.style.transform = "translateY(0)";
  } else {
    if (current > headerLastScroll && current > 120) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }
  }

  const currentHeaderState = `${shouldBeScrolled}-${open}`;

  if (currentHeaderState !== headerLastState) {
    
    header.classList.toggle("bg-white", shouldBeScrolled && !open);
    header.classList.toggle("bg-transparent", !shouldBeScrolled || open);
    
    header.classList.toggle("text-black", shouldBeScrolled && !open);
    header.classList.toggle("text-white", !shouldBeScrolled || open);

    const subtitle = header.querySelector("a.text-white\\/40, a.text-black\\/40");
    if (subtitle) {
      subtitle.classList.toggle("text-black/40", shouldBeScrolled && !open);
      subtitle.classList.toggle("text-white/40", !shouldBeScrolled || open);
    }

    document.querySelectorAll("#burger .line").forEach((line) => {
      const shouldBeWhite = open || !shouldBeScrolled; 
      
      const shouldBeBlack = !open && shouldBeScrolled;
      
      line.classList.toggle("bg-black", shouldBeBlack);
      line.classList.toggle("bg-white", shouldBeWhite);
    });

    headerLastState = currentHeaderState;
  }

  headerLastScroll = current;
  requestAnimationFrame(handleHeader);
}

handleHeader();

const revealItems = document.querySelectorAll(".reveal-text, .reveal-fade");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

revealItems.forEach((el) => revealObserver.observe(el));
