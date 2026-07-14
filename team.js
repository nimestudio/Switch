gsap.registerPlugin(ScrollTrigger, SplitText);

// load
const initTeamHeroReveal = () => {
  const chunks = document.querySelectorAll("[data-hero-reveal='chunk']");
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-container > *");
  const imageReveal = document.querySelector("[data-hero-reveal='image-reveal']");

  const hasElements = chunks.length || navbar || imageReveal;
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
      duration: 1,
      ease: "power3.in"
    }, 0.3);
  }
};

const runTeam = () => {
  initTeamHeroReveal();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", runTeam);
} else {
  runTeam();
}

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});