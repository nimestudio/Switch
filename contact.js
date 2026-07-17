const initContactHeroReveal = () => {
  const chunks = document.querySelectorAll("[data-hero-reveal='chunk']");
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-container > *");
  const heroReveal = document.querySelector("[data-hero-reveal='hero']");
  const contactDetails = document.querySelectorAll("[data-hero-reveal='contact-details']");

  const hasElements = chunks.length || navbar || heroReveal || contactDetails.length;
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

  if (heroReveal) {
    gsap.set(heroReveal, { scaleY: 1, transformOrigin: "bottom" });
  }

  if (contactDetails.length) {
    gsap.set(contactDetails, { opacity: 0, y: 20 });
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

  if (heroReveal) {
    tl.to(heroReveal, {
      scaleY: 0,
      duration: 1,
      ease: "power3.in"
    }, 0);
  }

  if (contactDetails.length) {
    const position = heroReveal ? "-=0.2" : "-=0.5";
    tl.to(contactDetails, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    }, position);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initContactHeroReveal();
});