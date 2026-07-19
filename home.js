gsap.registerPlugin(ScrollTrigger, SplitText);

// preloader
const PreloaderAndHero = () => {
  const logo = document.querySelector(".preloader-logo");
  const logoWrap = document.querySelector(".preloader-logo-wrap");
  const colorColumns = document.querySelectorAll(".preloader-color-column");
  const blackColumns = document.querySelectorAll(".preloader-black-column");
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-container > *");
  const heroSub = document.querySelector(".home-hero-sub p");
  const lines = document.querySelectorAll(".hero-heading-line");

  if (!heroSub || !lines.length) return;

  const hasVisited = sessionStorage.getItem("hasVisitedHome");

  gsap.set(logo, { y: "101%" });
  gsap.set(colorColumns, { height: "0%" });

  if (navbar) {
    gsap.set(navbar, { opacity: 0 });
  }
  if (navItems.length) {
    gsap.set(navItems, { opacity: 0, y: 10 });
  }

  let split;
  const targetsToAnimate = [];
  const lineGroups = [];

  lines.forEach(line => {
    const chunks = line.querySelectorAll("[data-hero-reveal='chunk']");
    const wrappersInLine = [];

    chunks.forEach(chunk => {
      const textContent = chunk.innerHTML;
      chunk.innerHTML = "";
      
      const innerWrapper = document.createElement("span");
      innerWrapper.style.display = "block";
      innerWrapper.innerHTML = textContent;
      
      chunk.style.clipPath = "inset(0% 0% 0% 0%)";
      chunk.style.webkitClipPath = "inset(0% 0% 0% 0%)";
      
      chunk.appendChild(innerWrapper);
      wrappersInLine.push(innerWrapper);
      targetsToAnimate.push(innerWrapper);

      gsap.set(innerWrapper, { y: "130%" });
      gsap.set(chunk, { opacity: 1 });
    });

    if (wrappersInLine.length) {
      lineGroups.push(wrappersInLine);
    }
  });

  const runHeroAnimation = () => {
    const heroTl = gsap.timeline();

    if (targetsToAnimate.length) {
      if (window.innerWidth >= 768) {
        lineGroups.forEach((group, index) => {
          heroTl.to(group, {
            y: "0%",
            duration: 1,
            ease: "power3.out"
          }, index * 0.25);
        });
      } else {
        heroTl.to(targetsToAnimate, {
          y: "0%",
          duration: 1,
          stagger: 0.25,
          ease: "power3.out"
        }, 0);
      }
    }

    if (navbar) {
      heroTl.to(navbar, {
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, 0);
    }

    if (navItems.length) {
      heroTl.to(navItems, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      }, 0);
    }

    if (split && split.lines) {
      const startOffset = targetsToAnimate.length ? 0.5 : 0;
      heroTl.to(split.lines, {
        y: "0%",
        duration: 1.5,
        stagger: 0.1,
        ease: "power2.inOut"
      }, startOffset);
    }
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

    if (hasVisited) {
      gsap.set(".preloader", { display: "none" });
      runHeroAnimation();
    } else {
      sessionStorage.setItem("hasVisitedHome", "true");
      const tl = gsap.timeline();
      tl.to(logo, {
        y: "0%",
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          startColumnsAnimation();
        }
      });
    }
  });
};

const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// venues scroll
const HorizontalScroll = () => {
  const section = document.querySelector(".section-home-intro");
  const track = document.querySelector(".scroll-track");
  const items = document.querySelectorAll(".scroll-item");
  const venues = document.querySelectorAll(".home-intro-venue");

  if (!section || !track || !items.length) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    let trackWidthPx = 0;

    const calculateSizes = () => {
      let maxRight = 0;
      
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        maxRight = Math.max(maxRight, rect.right + window.scrollX);
      });

      const extraSpace = window.innerWidth;
      trackWidthPx = maxRight + extraSpace;
    };

    calculateSizes();

    const horizontalTween = gsap.to(track, {
      x: () => -(trackWidthPx - window.innerWidth * 1.25),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${(trackWidthPx - window.innerWidth * 1.5) * 0.5}`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
        onRefresh: calculateSizes
      }
    });

    items.forEach((item, i) => {
      const venue = venues[i];
      const isFirst = i === 0;
      const isLast = i === items.length - 1;

      if (venue) {
        gsap.set(venue, { opacity: 0 });

        ScrollTrigger.create({
          trigger: item,
          containerAnimation: horizontalTween,
          start: "center 75%",
          end: "center 25%",
          onEnter: () => {
            gsap.to(venue, { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          },
          onLeave: () => {
            gsap.to(venue, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
          },
          onEnterBack: () => {
            gsap.to(venue, { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          },
          onLeaveBack: () => {
            gsap.to(venue, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
          }
        });
      }

      if (isFirst) {
        gsap.set(item, { opacity: 0, scale: 0.7 });

        ScrollTrigger.create({
          trigger: item,
          containerAnimation: horizontalTween,
          start: "left 65%",
          onEnter: () => {
            gsap.to(item, { opacity: 1, scale: 1, duration: 1, ease: "power2.out", overwrite: "auto" });
          },
          onLeaveBack: () => {
            gsap.to(item, { opacity: 0, scale: 0.7, duration: 0.8, ease: "power2.in", overwrite: "auto" });
          }
        });
      } else if (isLast) {
        gsap.set(item, { opacity: 1, scale: 1 });

        ScrollTrigger.create({
          trigger: item,
          containerAnimation: horizontalTween,
          end: "left 0%",
          onLeave: () => {
            gsap.to(item, { opacity: 0, scale: 0.7, duration: 0.5, ease: "power3.in", overwrite: "auto" });
          },
          onEnterBack: () => {
            gsap.to(item, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          }
        });
      } else {
        gsap.set(item, { opacity: 1, scale: 1 });
      }
    });
  });
};

// venues slider
const initMobileSlider = () => {
  if (window.innerWidth > 991) return;
  
  const sliderElement = document.querySelector("#mobile-intro-slider");
  if (!sliderElement) return;

  const splide = new Splide("#mobile-intro-slider", {
    type: "loop",
    perPage: 1,
    arrows: false,
    pagination: true,
    gap: "1.5rem",
    flickPower: 500,
    turnPage: 1,
    updateOnMove: true,
    autoplay: true,
    interval: 3000
  });

  splide.mount();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const autoplay = splide.Components.Autoplay;
      if (!autoplay) return;
      
      if (entry.isIntersecting) {
        autoplay.play();
      } else {
        autoplay.pause();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(sliderElement);
};

// steps
const HomeSteps = () => {
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

  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
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
  });
};

// cta section reveal
const HomeCTAReveal = () => {
  const section = document.querySelector(".section-cta");
  if (!section) return;

  const columns = document.querySelectorAll(".image-reveal-column");
  const textWrap = document.querySelector(".cta-reveal-text-wrap");
  const button = document.querySelector(".section-cta .button");

  if (columns.length < 5 || !textWrap) return;

  const split = new SplitText(textWrap, { type: "lines" });
  split.lines.forEach(line => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "hidden";
    wrapper.style.padding = "0.2em 0.05em";
    wrapper.style.margin = "-0.2em -0.05em";
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });
  
  gsap.set(split.lines, { y: "130%" });
  gsap.set(button, { autoAlpha: 0 });

  gsap.set(columns[0], { height: "0%" });
  gsap.set(columns[1], { height: "25%" });
  gsap.set(columns[2], { height: "50%" });
  gsap.set(columns[3], { height: "75%" });
  gsap.set(columns[4], { height: "100%" });

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top bottom+=40%",
      end: "top top-=30%",
      scrub: true
    }
  })
  .to(columns[4], { height: "0%", ease: "none", duration: 100 }, 0)
  .to(columns[2], { height: "0%", ease: "none", duration: 100 }, 0)
  .to(columns[0], { height: "0%", ease: "none", duration: 100 }, 0)
  .to(columns[1], { height: "0%", ease: "none", duration: 100 }, 0)
  .to(columns[3], { height: "0%", ease: "none", duration: 100 }, 0);

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 25%",
      once: true
    }
  })
  .to(split.lines, {
    y: "0%",
    duration: 1,
    stagger: 0.3,
    ease: "power3.out"
  })
  .to(button, {
    autoAlpha: 1,
    duration: 1.5,
    ease: "power1.out"
  }, "-=0.4");
};

const runHomeScripts = () => {
  PreloaderAndHero();
  HorizontalScroll();
  initMobileSlider();
  HomeSteps();
  HomeCTAReveal();
  
  if (typeof window.initLineReveal === "function") {
    window.initLineReveal();
  }
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", runHomeScripts);
} else {
  runHomeScripts();
}