gsap.registerPlugin(ScrollTrigger, SplitText);

// services scroll
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

  gsap.set(bgs, { opacity: 0 });

  blocks.forEach((block, index) => {
    const currentBg = bgs[index];
    const textElement = block.querySelector("[data-text-animation='lines-services']");
    
    const tl = gsap.timeline({ paused: true });

    tl.to(currentBg, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, 0);

    if (textElement) {
      const split = new SplitText(textElement, { type: "lines" });
      split.lines.forEach(line => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        wrapper.style.padding = "0.2em 0em";
        wrapper.style.margin = "-0.2em 0em";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      tl.from(split.lines, {
        yPercent: 130,
        duration: 1,
        ease: "power3.out",
        stagger: 0.25,
      }, 0.15);
    }

    ScrollTrigger.create({
      trigger: block,
      start: "top 25%",
      toggleActions: "play none none reverse",
      animation: tl
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
  initServiceNavReveal();
  initServicesScroll();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", runService);
} else {
  runService();
}