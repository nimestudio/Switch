gsap.registerPlugin(ScrollTrigger, SplitText);

// portfolio item hover bg
const initPortfolioBackgrounds = () => {
  const items = document.querySelectorAll(".portfolio-item");
  const classes = [
    "background-color-lime",
    "background-color-blue",
    "background-color-purple",
    "background-color-fucsia",
    "background-color-red"
  ];

  items.forEach((item, index) => {
    const bg = item.querySelector(".portfolio-item-bg");
    if (bg) {
      bg.classList.add(classes[index % classes.length]);
    }
  });
};

// portfolio items desktop hover animation
const initPortfolioHover = () => {
  const items = document.querySelectorAll(".portfolio-item");
  if (!items.length) return;

  let mm = gsap.matchMedia();

  mm.add("(min-width: 991px)", () => {
    gsap.set(".portfolio-item-img-wrap", { x: "20vw" });

    items.forEach(item => {
      const bg = item.querySelector(".portfolio-item-bg");
      const details = item.querySelector(".portfolio-item-details");
      const imgWrap = item.querySelector(".portfolio-item-img-wrap");
      const isLime = bg && bg.classList.contains("background-color-lime");

      item.addEventListener("mouseenter", () => {
        gsap.to([bg, details], {
          opacity: 1,
          duration: 0.35,
          overwrite: "auto"
        });
        
        if (isLime) {
          gsap.to(item, {
            color: "var(--color--black)",
            duration: 0.35,
            overwrite: "auto"
          });
        }
        
        gsap.to(imgWrap, {
          x: "0",
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto"
        });
      });

      item.addEventListener("mouseleave", () => {
        gsap.to([bg, details], {
          opacity: 0,
          duration: 0.25,
          overwrite: "auto"
        });
        
        if (isLime) {
          gsap.to(item, {
            color: "",
            duration: 0.25,
            overwrite: "auto"
          });
        }
        
        gsap.to(imgWrap, {
          x: "20vw",
          duration: 0.25,
          ease: "power3.out",
          overwrite: "auto"
        });
      });
    });
  });
};

const runPortfolio = () => {
  initPortfolioBackgrounds();
  initPortfolioHover();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", runPortfolio);
} else {
  runPortfolio();
}