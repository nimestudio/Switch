gsap.registerPlugin(ScrollTrigger, SplitText);

// page load
const initServicesHeroReveal = () => {
  const title = document.querySelector("[data-hero-reveal='title']");
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-container > *");
  const imageReveal = document.querySelector("[data-hero-reveal='image-reveal']");
  const serviceItems = document.querySelectorAll("[data-hero-reveal='service-number']");

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
  gsap.set(imageReveal, { scaleY: 1, transformOrigin: "bottom" });
  gsap.set(serviceItems, { opacity: 0, y: 20 });
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
  .to(imageReveal, {
    scaleY: 0,
    duration: 1,
    ease: "power3.in"
  }, 0)
  .to(serviceItems, {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out"
  }, "-=0.2");
};

// service nav reveal
const initServiceNavReveal = () => {
  const blocks = document.querySelectorAll(".service-block");
  const navItems = document.querySelectorAll(".service-block-topbar-block");
  
  if (!blocks.length || navItems.length !== blocks.length) return;

  const bgs = [];
  navItems.forEach(item => {
    const bg = item.querySelector(".topbar-bg");
    if (bg) bgs.push(bg);
  });

  if (bgs.length !== blocks.length) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    gsap.set(bgs, { opacity: 0 });

    blocks.forEach((block, index) => {
      const currentBg = bgs[index];
      const currentNumber = currentBg.parentNode.querySelector(".number");
      
      const tl = gsap.timeline({ paused: true });

      tl.to(currentBg, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, 0);

      if (currentBg.classList.contains("background-color-lime") && currentNumber) {
        tl.to(currentNumber, {
          color: "black",
          duration: 0.5,
          ease: "power2.out"
        }, 0);
      }

      ScrollTrigger.create({
        trigger: block,
        start: "top top",
        toggleActions: "play none none reverse",
        animation: tl
      });
    });
  });

  mm.add("(min-width: 0px)", () => {
    blocks.forEach((block, i) => {
      const textWrap = block.querySelector(".service-text-wrap");
      const nextBlock = blocks[i + 1];

      if (nextBlock && textWrap) {
        gsap.set(textWrap, { opacity: 1 });

        gsap.to(textWrap, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: nextBlock,
            start: "top 70%",
            end: "top 30%",
            scrub: true
          }
        });
      }
    });
  });
};

// events categories scroll
const initServicesScroll = () => {
  const blocks = document.querySelectorAll(".services-events-block");
  const photos = document.querySelectorAll(".services-events-photo");

  if (!blocks.length || !photos.length) return;

  blocks.forEach((block, index) => {
    const photo = photos[index];
    const bgBlock = block.querySelector(".services-events-bg-block");

    ScrollTrigger.create({
      trigger: block,
      start: "top 60%",
      end: "bottom 60%",
      onEnter: () => {
        if (bgBlock) gsap.to(bgBlock, { opacity: 1, duration: 0.5, overwrite: "auto" });
        if (photo && index > 0) gsap.to(photo, { opacity: 1, duration: 0.5, overwrite: "auto" });
      },
      onLeave: () => {
        if (bgBlock) gsap.to(bgBlock, { opacity: 0, duration: 0.5, overwrite: "auto" });
      },
      onEnterBack: () => {
        if (bgBlock) gsap.to(bgBlock, { opacity: 1, duration: 0.5, overwrite: "auto" });
        if (photo && index > 0) gsap.to(photo, { opacity: 1, duration: 0.5, overwrite: "auto" });
      },
      onLeaveBack: () => {
        if (bgBlock) gsap.to(bgBlock, { opacity: 0, duration: 0.5, overwrite: "auto" });
        if (photo && index > 0) gsap.to(photo, { opacity: 0, duration: 0.5, overwrite: "auto" });
      }
    });
  });
};

const runService = () => {
  initServicesHeroReveal();
  initServiceNavReveal();
  initServicesScroll();
};

const checkGsapAndRunService = () => {
  if (typeof window.gsap === "undefined" || typeof window.SplitText === "undefined") {
    setTimeout(checkGsapAndRunService, 50);
    return;
  }
  
  if (document.readyState === "complete") {
    runService();
  } else {
    window.addEventListener("load", runService);
  }
};

window.Webflow = window.Webflow || [];
window.Webflow.push(checkGsapAndRunService);
