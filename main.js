window.initLineReveal = () => {
  const targetElements = document.querySelectorAll("[data-text-animation='lines']");
  
  targetElements.forEach(element => {
    if (element.offsetWidth === 0 && element.offsetHeight === 0) return;

    const split = new SplitText(element, { type: "lines" });

    split.lines.forEach(line => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      wrapper.style.padding = "0.2em 0.05em";
      wrapper.style.margin = "-0.2em -0.05em";

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

window.addEventListener("DOMContentLoaded", () => {
  window.initLineReveal();

  const yearEl = document.querySelector("#current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});