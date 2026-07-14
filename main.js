// global hero load
const initGlobalHeroReveal = () => {
  if (document.querySelector(".preloader")) return;

  const chunks = document.querySelectorAll("[data-hero-reveal='chunk']");
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-container > *");
  const imageReveal = document.querySelector("[data-hero-reveal='image-reveal']");
  const serviceItems = document.querySelectorAll("[data-hero-reveal='service-number']");

  const hasElements = chunks.length || navbar || imageReveal || serviceItems.length;
  if (!hasElements) return;

  const tl = gsap.timeline({
    onComplete: () => {
      document.dispatchEvent(new CustomEvent("heroRevealComplete"));
    }
  });

  const targetsToAnimate = [];

  if (chunks.length) {
    chunks.forEach(chunk => {
      const textContent = chunk.innerHTML;
      chunk.innerHTML = "";
      
      const innerWrapper = document.createElement("span");
      innerWrapper.style.display = "block";
      innerWrapper.innerHTML = textContent;
      
      chunk.style.clipPath = "inset(0% 0% 0% 0%)";
      chunk.style.webkitClipPath = "inset(0% 0% 0% 0%)";
      
      chunk.appendChild(innerWrapper);
      targetsToAnimate.push(innerWrapper);
    });

    gsap.set(targetsToAnimate, { y: "130%" });
    gsap.set(chunks, { opacity: 1 });
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

  if (serviceItems.length) {
    gsap.set(serviceItems, { opacity: 0, y: 20 });
  }

  if (chunks.length) {
    tl.to(targetsToAnimate, {
      y: "0%",
      duration: 1,
      stagger: 0.25,
      ease: "power3.out"
    });
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
      duration: 1.5,
      ease: "power2.in"
    }, 0);
  }

  if (serviceItems.length) {
    const position = imageReveal ? "-=0.8" : "-=0.5";
    tl.to(serviceItems, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    }, position);
  }
};

// global text line reveal
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
      stagger: 0.1,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
};

// global cta section
const initCTAReveal = () => {
  if (document.querySelector(".preloader")) return;

  const section = document.querySelector(".section-cta");
  if (!section) return;

  const columns = document.querySelectorAll(".image-reveal-column");
  const textWrap = document.querySelector(".cta-reveal-text-wrap");
  const button = document.querySelector(".section-cta .button");

  if (columns.length < 2 || !textWrap) return;

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

  let mm = gsap.matchMedia();

  mm.add("(min-width: 480px)", () => {
    if (columns.length >= 5) {
      gsap.set(columns[0], { height: "85%" });
      gsap.set(columns[1], { height: "45%" });
      gsap.set(columns[2], { height: "90%" });
      gsap.set(columns[3], { height: "55%" });
      gsap.set(columns[4], { height: "100%" });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom+=50%",
          end: "top top",
          scrub: true
        }
      })
      .to(columns[4], { height: "0%", ease: "none", duration: 100 }, 0)
      .to(columns[2], { height: "0%", ease: "none", duration: 100 }, 0)
      .to(columns[0], { height: "0%", ease: "none", duration: 100 }, 0)
      .to(columns[1], { height: "0%", ease: "none", duration: 100 }, 0)
      .to(columns[3], { height: "0%", ease: "none", duration: 100 }, 0);
    }
  });

  mm.add("(max-width: 479px)", () => {
    gsap.set(columns[0], { height: "90%" });
    gsap.set(columns[1], { height: "60%" });

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom+=50%",
        end: "top top",
        scrub: true
      }
    })
    .to(columns[0], { height: "0%", ease: "none", duration: 100 }, 0)
    .to(columns[1], { height: "0%", ease: "none", duration: 100 }, 0);
  });

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
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.4");
};

if (!document.querySelector(".preloader")) {
  window.initLineReveal();
}
initCTAReveal();
initGlobalHeroReveal();

const yearEl = document.querySelector("#current-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}