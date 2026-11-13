const initContactHeroReveal = () => {
  const title = document.querySelector("[data-hero-reveal='title']");
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-container > *");
  const heroReveal = document.querySelector("[data-hero-reveal='image-reveal']");
  const contactDetails = document.querySelectorAll("[data-hero-reveal='contact-details']");

  const tl = gsap.timeline({
    onComplete: () => {
      document.dispatchEvent(new CustomEvent("heroRevealComplete"));
    }
  });

  const titleSplit = new SplitText(title, { type: "lines" });
  titleSplit.lines.forEach(line => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "hidden";
    wrapper.style.padding = "0.2em 0em";
    wrapper.style.margin = "-0.35em 0em";

    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  gsap.set(navbar, { opacity: 0 });
  gsap.set(navItems, { opacity: 0, y: 10 });
  gsap.set(heroReveal, { scaleY: 1, transformOrigin: "bottom" });
  gsap.set(contactDetails, { opacity: 0, y: 20 });
  gsap.set(title, { opacity: 1 });

  tl.from(titleSplit.lines, {
    yPercent: 130,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
  }, 0)
  .to(navbar, {
    opacity: 1,
    duration: 1,
    ease: "power3.out"
  }, 0)
  .to(navItems, {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out"
  }, 0)
  .to(heroReveal, {
    scaleY: 0,
    duration: 1,
    ease: "power3.in"
  }, 0)
  .to(contactDetails, {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out"
  }, "-=0.2");
};

const runContact = () => {
  initContactHeroReveal();
};

const checkGsapAndRunContact = () => {
  if (typeof window.gsap === "undefined" || typeof window.SplitText === "undefined") {
    setTimeout(checkGsapAndRunContact, 50);
    return;
  }
  
  if (document.readyState === "complete") {
    runContact();
  } else {
    window.addEventListener("load", runContact);
  }
};

window.Webflow = window.Webflow || [];
window.Webflow.push(checkGsapAndRunContact);
