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

// global CTA section
const initCTAReveal = () => {
  if (document.querySelector(".preloader")) return;

  const section = document.querySelector(".section-cta");
  if (!section) return;

  const columns = document.querySelectorAll(".image-reveal-column");
  const textWrap = document.querySelector(".cta-reveal-text-wrap");
  const button = document.querySelector(".section-cta .button");

  if (columns.length < 5 || !textWrap) return;

  const split = new SplitText(textWrap, { type: "lines" });
  split.lines.forEach(line => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "hidden";
    wrapper.style.padding = "0.2em 0.05em";
    wrapper.style.margin = "-0.2em -0.05em";
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });
  
  gsap.set(split.lines, { y: "130%" });
  gsap.set(button, { autoAlpha: 0 });

  gsap.set(columns[0], { height: "0%" });
  gsap.set(columns[1], { height: "25%" });
  gsap.set(columns[2], { height: "50%" });
  gsap.set(columns[3], { height: "75%" });
  gsap.set(columns[4], { height: "100%" });

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top bottom+=40%",
      end: "top top-=30%",
      scrub: true
    }
  })
  .to(columns[4], { height: "0%", ease: "none", duration: 100 }, 0)
  .to(columns[2], { height: "0%", ease: "none", duration: 100 }, 0)
  .to(columns[0], { height: "0%", ease: "none", duration: 100 }, 0)
  .to(columns[1], { height: "0%", ease: "none", duration: 100 }, 0)
  .to(columns[3], { height: "0%", ease: "none", duration: 100 }, 0);

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 25%",
      once: true
    }
  })
  .to(split.lines, {
    y: "0%",
    duration: 1,
    stagger: 0.3,
    ease: "power3.out"
  })
  .to(button, {
    autoAlpha: 1,
    duration: 1.5,
    ease: "power1.out"
  }, "-=0.4");
};

const runAnimationScripts = () => {
  if (!document.querySelector(".preloader")) {
    window.initLineReveal();
  }
  
  initCTAReveal();

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