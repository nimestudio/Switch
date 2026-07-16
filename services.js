gsap.registerPlugin(ScrollTrigger, SplitText);

// page load
const initServicesHeroReveal = () => {
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
      duration: 1,
      ease: "power3.in"
    }, 0);
  }

  if (serviceItems.length) {
    const position = imageReveal ? "-=0.2" : "-=0.5";
    tl.to(serviceItems, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    }, position);
  }
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
            start: "top bottom",
            end: "top top",
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

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", runService);
} else {
  runService();
}