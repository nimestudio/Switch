gsap.registerPlugin(ScrollTrigger, SplitText);

// services fading animation
const initServiceFade = () => {
  const blocks = gsap.utils.toArray(".service-block");
  
  blocks.forEach((block, index) => {
    if (index === blocks.length - 1) return;
    
    const content = block.querySelector(".service-content-wrap");
    const nextBlock = blocks[index + 1];
    
    if (!content || !nextBlock) return;
    
    gsap.to(content, {
      opacity: 0,
      scrollTrigger: {
        trigger: nextBlock,
        start: "top bottom",
        end: "top top",
        scrub: true
      }
    });
  });
};

// events scroll interaction
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
  initServiceFade();
  initServicesScroll();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", runService);
} else {
  runService();
}