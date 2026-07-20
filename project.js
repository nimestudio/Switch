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

// project item hover
const initPortfolioAnimation = () => {
  const items = document.querySelectorAll(".project-item");
  const classes = [
    "background-color-lime",
    "background-color-blue",
    "background-color-purple",
    "background-color-fucsia",
    "background-color-red"
  ];

  if (!items.length) return;

  items.forEach((item, index) => {
    const bg = item.querySelector(".project-item-bg");
    if (bg) {
      bg.classList.add(classes[index % classes.length]);
    }
  });

  let mm = gsap.matchMedia();

  mm.add("(min-width: 991px)", () => {
    const hoverCleanups = [];

    items.forEach((item) => {
      const bg = item.querySelector(".project-item-bg");
      const img = item.querySelector(".project-item-img");

      if (bg) {
        gsap.set(bg, { height: "0rem" });
      }
      if (img) {
        gsap.set(img, { scale: 1 });
      }

      const onMouseEnter = () => {
        if (bg) gsap.to(bg, { height: "1.5rem", duration: 0.3, ease: "power2.out" });
        if (img) gsap.to(img, { scale: 1.1, duration: 0.3, ease: "power2.out" });
      };

      const onMouseLeave = () => {
        if (bg) gsap.to(bg, { height: "0rem", duration: 0.3, ease: "power2.out" });
        if (img) gsap.to(img, { scale: 1, duration: 0.3, ease: "power2.out" });
      };

      item.addEventListener("mouseenter", onMouseEnter);
      item.addEventListener("mouseleave", onMouseLeave);
      hoverCleanups.push({ item, onMouseEnter, onMouseLeave });
    });

    return () => {
      hoverCleanups.forEach(({ item, onMouseEnter, onMouseLeave }) => {
        item.removeEventListener("mouseenter", onMouseEnter);
        item.removeEventListener("mouseleave", onMouseLeave);
        
        const bg = item.querySelector(".project-item-bg");
        const img = item.querySelector(".project-item-img");
        if (bg) gsap.set(bg, { clearProps: "height" });
        if (img) gsap.set(img, { clearProps: "scale" });
      });
    };
  });
};


const runProject = () => {
  initProjectHeroReveal();
  initPortfolioAnimation();
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