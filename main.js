// lenis scroll

let lenis;

const initLenis = () => {
  if (typeof Lenis === "undefined") return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis;
};

// nav scroll lock
const initNavbarScrollLock = () => {
  const menu = document.querySelector(".mobile-nav");
  if (!menu) return;

  const checkScrollLock = () => {
    const isClosed = window.getComputedStyle(menu).display === "none";
    if (window.innerWidth >= 992 || isClosed) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  const observer = new MutationObserver(checkScrollLock);
  observer.observe(menu, { attributes: true, attributeFilter: ["style", "class"] });

  window.addEventListener("resize", checkScrollLock);
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initNavbarScrollLock);
} else {
  initNavbarScrollLock();
}

// global line reveal
window.initLineReveal = () => {
  const targetElements = document.querySelectorAll("[data-text-animation='lines']");
  
  targetElements.forEach(element => {
    if (element.offsetWidth === 0 && element.offsetHeight === 0) return;

    const split = new SplitText(element, { type: "lines" });

    split.lines.forEach(line => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      wrapper.style.padding = "0.2em 0em";
      wrapper.style.margin = "-0.2em 0em";

      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.from(split.lines, {
      yPercent: 130,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
};

const runAnimationScripts = () => {
  initLenis();

  if (!document.querySelector(".preloader")) {
    window.initLineReveal();
  }

  // update year
  const yearEl = document.querySelector("#current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

const checkGsapAndRunAnimations = () => {
  if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined" || typeof window.SplitText === "undefined") {
    setTimeout(checkGsapAndRunAnimations, 50);
    return;
  }
  
  if (document.readyState === "complete") {
    runAnimationScripts();
  } else {
    window.addEventListener("load", runAnimationScripts);
  }
};

window.Webflow = window.Webflow || [];
window.Webflow.push(checkGsapAndRunAnimations);