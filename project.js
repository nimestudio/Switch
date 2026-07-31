gsap.registerPlugin(ScrollTrigger, SplitText);

// load
const initProjectHeroReveal = () => {
  const imageReveal = document.querySelector("[data-hero-reveal='image-reveal']");
  const textElement = document.querySelector("[data-hero-reveal='text']");
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-container > *");
  const projectDetails = document.querySelectorAll("[data-hero-reveal='project-details']");

  const hasElements = imageReveal || textElement || navbar || projectDetails.length;
  if (!hasElements) return;

  const tl = gsap.timeline({
    onComplete: () => {
      document.dispatchEvent(new CustomEvent("heroRevealComplete"));
    }
  });

  if (imageReveal) {
    gsap.set(imageReveal, { scaleY: 1, transformOrigin: "bottom" });
  }

  let split;
  if (textElement) {
    split = new SplitText(textElement, { type: "lines" });
    split.lines.forEach(line => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      wrapper.style.padding = "0.2em 0em";
      wrapper.style.margin = "-0.2em 0em";
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
    gsap.set(split.lines, { y: "130%" });
  }

  if (navbar) {
    gsap.set(navbar, { opacity: 0 });
  }
  if (navItems.length) {
    gsap.set(navItems, { opacity: 0, y: 10 });
  }

  if (projectDetails.length) {
    gsap.set(projectDetails, { opacity: 0, y: 20 });
  }

  if (imageReveal) {
    tl.to(imageReveal, {
      scaleY: 0,
      duration: 1,
      ease: "power3.in"
    }, 0);
  }

  const revealStartTime = imageReveal ? 1.1 : 0;

  if (textElement && split) {
    tl.to(split.lines, {
      y: "0%",
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    }, revealStartTime);
  }

  if (navbar) {
    tl.to(navbar, {
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    }, revealStartTime);
  }

  if (navItems.length) {
    tl.to(navItems, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out"
    }, revealStartTime);
  }

  if (projectDetails.length) {
    const detailsStartTime = imageReveal ? 1.6 : "-=1";
    tl.to(projectDetails, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    }, detailsStartTime);
  }
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

const runProject = () => {
  initProjectHeroReveal();
  CTAReveal();
};

const checkGsapAndRunProject = () => {
  if (typeof window.gsap === "undefined" || typeof window.SplitText === "undefined") {
    setTimeout(checkGsapAndRunProject, 50);
    return;
  }
  
  if (document.readyState === "complete") {
    runProject();
  } else {
    window.addEventListener("load", runProject);
  }
};

window.Webflow = window.Webflow || [];
window.Webflow.push(checkGsapAndRunProject);