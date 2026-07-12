gsap.registerPlugin(ScrollTrigger, SplitText);

// Preloader
const initPreloaderAndHero = () => {
  const logo = document.querySelector(".preloader-logo");
  const logoWrap = document.querySelector(".preloader-logo-wrap");
  const colorColumns = document.querySelectorAll(".preloader-color-column");
  const blackColumns = document.querySelectorAll(".preloader-black-column");
  const navbar = document.querySelector(".navbar");
  const heroSub = document.querySelector(".home-hero-sub p");
  const chunks = document.querySelectorAll(".heading-chunk");

  if (!heroSub || !chunks.length) return;

  gsap.set(logo, { y: "101%" });
  gsap.set(colorColumns, { height: "0%" });
  gsap.set(navbar, { y: "-100%" });

  let split;
  const targetsToAnimate = [];

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

  const runHeroAnimation = () => {
    const heroTl = gsap.timeline();

    heroTl
      .to(targetsToAnimate, {
        y: "0%",
        duration: 1,
        stagger: 0.4,
        ease: "power3.out"
      })
      .to(navbar, {
        y: "0%",
        duration: 1.5,
        ease: "power2.inOut"
      }, "<-0.2")
      .to(split.lines, {
        y: "0%",
        duration: 1.5,
        stagger: 0.1,
        ease: "power2.inOut"
      }, "<1");
  };

  const startColumnsAnimation = () => {
    const columnsTl = gsap.timeline({
      onComplete: () => {
        gsap.set(".preloader", { display: "none" });
      }
    });

    columnsTl
      .to(colorColumns, {
        height: "100%",
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.inOut",
        delay: 2
      })
      .set(logoWrap, {
        autoAlpha: 0
      }, "-=0.3")
      .to(blackColumns, {
        yPercent: -100,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.inOut"
      }, "-=0.3")
      .to(colorColumns, {
        yPercent: -100,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.inOut"
      }, "<")
      .call(runHeroAnimation, null, "-=0.5");
  };

  document.fonts.ready.then(() => {
    split = new SplitText(heroSub, { type: "lines" });
    split.lines.forEach(l => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      wrapper.style.padding = "0.2em 0.05em";
      wrapper.style.margin = "-0.2em -0.05em";
      l.parentNode.insertBefore(wrapper, l);
      wrapper.appendChild(l);
    });

    gsap.set(split.lines, { y: "120%" });

    const tl = gsap.timeline();
    tl.to(logo, {
      y: "0%",
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        startColumnsAnimation();
      }
    });
  });
};

// Intro horizontal venues
const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const initHorizontalScroll = () => {
  const section = document.querySelector(".section-home-intro");
  const track = document.querySelector(".scroll-track");
  const items = document.querySelectorAll(".scroll-item");
  const venues = document.querySelectorAll(".home-intro-venue");

  if (!section || !track || !items.length) return;

  let itemBaseLefts = [];
  let trackWidthPx = 0;

  const calculateSizes = () => {
    itemBaseLefts = [];
    let maxRight = 0;
    
    items.forEach(item => {
      itemBaseLefts.push(item.offsetLeft);
      const rect = item.getBoundingClientRect();
      maxRight = Math.max(maxRight, rect.right + window.scrollX);
    });

    const extraSpace = window.innerWidth;
    trackWidthPx = maxRight + extraSpace;
  };

  calculateSizes();

  gsap.to(track, {
    x: () => -(trackWidthPx - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${trackWidthPx - window.innerWidth}`,
      scrub: true,
      pin: true,
      invalidateOnRefresh: true,
      onRefresh: calculateSizes
    }
  });

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${trackWidthPx - window.innerWidth}`,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const currentX = -progress * (trackWidthPx - window.innerWidth);
      const viewportCenter = window.innerWidth / 2;

      items.forEach((item, i) => {
        const venue = venues[i];
        if (!venue) return;

        const itemCenterBase = itemBaseLefts[i] + item.offsetWidth / 2;
        const itemCenterNow = itemCenterBase + currentX;
        const distance = Math.abs(itemCenterNow - viewportCenter);

        const plateauWidth = item.offsetWidth * 0.6;
        const fadeWidth = item.offsetWidth * 0.4;

        let opacity;
        if (distance <= plateauWidth) {
          opacity = 1;
        } else if (distance <= plateauWidth + fadeWidth) {
          opacity = 1 - (distance - plateauWidth) / fadeWidth;
        } else {
          opacity = 0;
        }

        venue.style.opacity = Math.max(0, opacity);
      });
    }
  });
};

// steps blocks
const initHomeSteps = () => {
  const wrapper = document.querySelector(".home-steps-wrap");
  if (!wrapper) return;

  const steps = wrapper.querySelectorAll(".home-step");
  if (steps.length < 5) return;

  gsap.from(steps, {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
      trigger: wrapper,
      start: "top 80%"
    }
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  tl.to(steps[0], { yPercent: -40, ease: "none" }, 0)
    .to(steps[1], { yPercent: -20, ease: "none" }, 0)
    .to(steps[3], { yPercent: 20, ease: "none" }, 0)
    .to(steps[4], { yPercent: 40, ease: "none" }, 0);
};

// cta section reveal


const runHomeScripts = () => {
  initPreloaderAndHero();
  initHorizontalScroll();
  initHomeSteps();
  initCTAReveal();
  initLineReveal();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", runHomeScripts);
} else {
  runHomeScripts();
}