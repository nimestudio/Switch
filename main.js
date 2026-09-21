// lenis
const initLenis = () => {
  if (typeof Lenis === "undefined") return;

  let lenis = new Lenis({
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

  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.addEventListener("refresh", () => {
      lenis.resize();
    });
  }

  window.addEventListener("load", () => {
    lenis.resize();
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  });

  let refreshTimeout;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
      lenis.resize();
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 250);
  });

  resizeObserver.observe(document.body);
};

// navbar scroll lock on mobile
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
  checkScrollLock();
};

// line reveal
window.initLineReveal = () => {
  const targetElements = document.querySelectorAll("[data-text-animation='lines']");
  let splitInstances = [];
  let animations = [];
  let windowWidth = window.innerWidth;
  let resizeTimer;

  const buildReveal = () => {
    targetElements.forEach(element => {
      if (element.offsetWidth === 0 && element.offsetHeight === 0) return;

      const split = new SplitText(element, { type: "lines" });
      splitInstances.push(split);

      split.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        wrapper.style.padding = "0.2em 0em";
        wrapper.style.margin = "-0.2em 0em";

        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      const anim = gsap.from(split.lines, {
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
      
      animations.push(anim);
    });
  };

  buildReveal();

  window.addEventListener("resize", () => {
    if (window.innerWidth === windowWidth) return;
    windowWidth = window.innerWidth;

    clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(() => {
      animations.forEach(anim => {
        if (anim.scrollTrigger) {
          anim.scrollTrigger.kill();
        }
        anim.kill();
      });
      animations = [];

      splitInstances.forEach(split => split.revert());
      splitInstances = [];

      buildReveal();
      
      ScrollTrigger.refresh();
    }, 250);
  });
};

// button hover
const initButtonHover = () => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  const buttons = document.querySelectorAll('.button');

  buttons.forEach(button => {
    const wrap = button.querySelector('.button-wrap');
    const hovers = button.querySelectorAll('.button-hover');

    let hoverAnimations = [];
    let fadeOutTween;

    hovers.forEach((hover, index) => {
      const tl = gsap.timeline({
        repeat: -1,
        delay: index * 1.25,
        paused: true
      });

      tl.set(hover, {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.8
      }).to(hover, {
        top: -18,
        left: -18,
        right: -18,
        bottom: -18,
        opacity: 0,
        duration: 2.5,
        ease: "power1.out"
      });

      hoverAnimations.push(tl);
    });

    button.addEventListener('mouseenter', () => {
      if (fadeOutTween) fadeOutTween.kill();
      
      gsap.to(wrap, {
        clipPath: "inset(4px)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      hoverAnimations.forEach(tl => tl.restart(true));
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(wrap, {
        clipPath: "inset(0px)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      hoverAnimations.forEach(tl => tl.pause());
      
      fadeOutTween = gsap.to(hovers, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: false
      });
    });
  });
};

// lang separator
const initAddLocalesSeparator = () => {
  const parent = document.querySelector('.nav-locales-list');
  const firstChild = parent ? parent.querySelector('.nav-locale') : null;

  if (parent && firstChild && !parent.querySelector('.locales-separator')) {
    const separator = document.createElement('span');
    separator.className = 'locales-separator';
    separator.textContent = '/';

    parent.insertBefore(separator, firstChild.nextSibling);
  }
};
  
// year
const initUpdateYear = () => {
  const yearEl = document.querySelector("#current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

// run scripts
let isInitialized = false;

const initAllScripts = () => {
  if (isInitialized) return;
  isInitialized = true;

  initLenis();
  initNavbarScrollLock();
  
  if (!document.querySelector(".preloader")) {
    window.initLineReveal();
  }
  
  initButtonHover();
  initAddLocalesSeparator();
};

const checkDependenciesAndInit = () => {  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllScripts);
  } else {
    initAllScripts();
  }
};

window.Webflow = window.Webflow || [];
window.Webflow.push(checkDependenciesAndInit);