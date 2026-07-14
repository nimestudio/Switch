gsap.registerPlugin(ScrollTrigger, SplitText);

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
      stagger: 0.1,
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

const runProject = () => {
  initProjectHeroReveal();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", runProject);
} else {
  runProject();
}