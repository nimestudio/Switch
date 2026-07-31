gsap.registerPlugin(ScrollTrigger, SplitText);

// load
const initTeamHeroReveal = () => {
  const lines = document.querySelectorAll(".hero-heading-line");
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-container > *");
  const imageReveal = document.querySelector("[data-hero-reveal='image-reveal']");

  const hasElements = lines.length || navbar || imageReveal;
  if (!hasElements) return;

  const tl = gsap.timeline({
    onComplete: () => {
      document.dispatchEvent(new CustomEvent("heroRevealComplete"));
    }
  });

  const targetsToAnimate = [];
  const lineGroups = [];

  if (lines.length) {
    lines.forEach(line => {
      const chunks = line.querySelectorAll("[data-hero-reveal='chunk']");
      const wrappersInLine = [];

      chunks.forEach(chunk => {
        const textContent = chunk.innerHTML;
        chunk.innerHTML = "";
        
        const innerWrapper = document.createElement("span");
        innerWrapper.style.display = "block";
        innerWrapper.innerHTML = textContent;
        
        chunk.style.clipPath = "inset(0% 0% 0% 0%)";
        chunk.style.webkitClipPath = "inset(0% 0% 0% 0%)";
        
        chunk.appendChild(innerWrapper);
        wrappersInLine.push(innerWrapper);
        targetsToAnimate.push(innerWrapper);

        gsap.set(innerWrapper, { y: "130%" });
        gsap.set(chunk, { opacity: 1 });
      });

      if (wrappersInLine.length) {
        lineGroups.push(wrappersInLine);
      }
    });
  }

  if (navbar) {
    gsap.set(navbar, { opacity: 0 });
  }
  if (navItems.length) {
    gsap.set(navItems, { opacity: 0, y: 10 });
  }

  if (imageReveal) {
    gsap.set(imageReveal, { scaleY: 1, transformOrigin: "bottom" });
  }

  if (targetsToAnimate.length) {
    if (window.innerWidth >= 768) {
      lineGroups.forEach((group, index) => {
        tl.to(group, {
          y: "0%",
          duration: 1,
          ease: "power3.out"
        }, index * 0.25);
      });
    } else {
      tl.to(targetsToAnimate, {
        y: "0%",
        duration: 1,
        stagger: 0.3,
        ease: "power3.out"
      }, 0);
    }
  }

  if (navbar) {
    tl.to(navbar, {
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    }, 0);
  }

  if (navItems.length) {
    tl.to(navItems, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out"
    }, 0);
  }

  if (imageReveal) {
    tl.to(imageReveal, {
      scaleY: 0,
      duration: 1,
      ease: "power3.in"
    }, 0.3);
  }
};

// sumamos
const initSumamosScroll = () => {
  const section = document.querySelector(".sumamos-section");
  const items = document.querySelectorAll(".sumamos-text-item");

  if (!section || !items.length) return;

  items.forEach((item) => {
    gsap.set(item, { opacity: 0.2 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 60%",
        end: "bottom 40%",
        scrub: true
      }
    });

    tl.to(item, {
      opacity: 1,
      ease: "power1.inOut",
      duration: 0.25
    })
    .to(item, {
      opacity: 0.2,
      ease: "power1.inOut",
      duration: 0.25
    });
  });
};

// cta section reveal
const CTAReveal = () => {
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

const runTeam = () => {
  initTeamHeroReveal();
  initSumamosScroll();
  CTAReveal();
};

const checkGsapAndRunTeam = () => {
  if (typeof window.gsap === "undefined" || typeof window.SplitText === "undefined" || typeof window.ScrollTrigger === "undefined") {
    setTimeout(checkGsapAndRunTeam, 50);
    return;
  }
  
  if (document.readyState === "complete") {
    runTeam();
    ScrollTrigger.refresh();
  } else {
    window.addEventListener("load", () => {
      runTeam();
      ScrollTrigger.refresh();
    });
  }
};

window.Webflow = window.Webflow || [];
window.Webflow.push(checkGsapAndRunTeam);