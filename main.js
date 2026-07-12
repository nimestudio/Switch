window.initLineReveal = () => {
  const targetElements = document.querySelectorAll("[data-text-animation='lines']");
  
  targetElements.forEach(element => {
    if (element.offsetWidth === 0 && element.offsetHeight === 0) return;

    const split = new SplitText(element, { type: "lines" });

    split.lines.forEach(line => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      wrapper.style.padding = "0.2em";
      wrapper.style.margin = "-0.2em";

      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.from(split.lines, {
      yPercent: 130,
      duration: 1.5,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
};

const initCTAReveal = () => {
  const section = document.querySelector(".section-cta");
  if (!section) return;

  const columns = document.querySelectorAll(".image-reveal-column");
  const textWrap = document.querySelector(".cta-reveal-text-wrap");
  const button = document.querySelector(".section-cta .button");

  if (columns.length < 2 || !textWrap) return;

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

  let mm = gsap.matchMedia();

  mm.add("(min-width: 480px)", () => {
    if (columns.length >= 5) {
      gsap.set(columns[0], { height: "85%" });
      gsap.set(columns[1], { height: "45%" });
      gsap.set(columns[2], { height: "90%" });
      gsap.set(columns[3], { height: "55%" });
      gsap.set(columns[4], { height: "100%" });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom+=50%",
          end: "top top",
          scrub: true
        }
      })
      .to(columns[4], { height: "0%", ease: "none", duration: 100 }, 0)
      .to(columns[2], { height: "0%", ease: "none", duration: 100 }, 0)
      .to(columns[0], { height: "0%", ease: "none", duration: 100 }, 0)
      .to(columns[1], { height: "0%", ease: "none", duration: 100 }, 0)
      .to(columns[3], { height: "0%", ease: "none", duration: 100 }, 0);
    }
  });

  mm.add("(max-width: 479px)", () => {
    gsap.set(columns[0], { height: "90%" });
    gsap.set(columns[1], { height: "60%" });

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom+=50%",
        end: "top top",
        scrub: true
      }
    })
    .to(columns[0], { height: "0%", ease: "none", duration: 100 }, 0)
    .to(columns[1], { height: "0%", ease: "none", duration: 100 }, 0);
  });

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
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.4");
};

window.addEventListener("DOMContentLoaded", () => {
  window.initLineReveal();
  window.initCTAReveal();

  const yearEl = document.querySelector("#current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});