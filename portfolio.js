gsap.registerPlugin(ScrollTrigger, SplitText);

// hero text loop
const initPortfolioLoop = () => {
  const changingSpan = document.querySelector(".portfolio-changing-chunk");
  if (!changingSpan || changingSpan.dataset.loopInitialized) return;
  
  changingSpan.dataset.loopInitialized = "true";

  const wordsAttr = changingSpan.getAttribute("data-words");
  if (!wordsAttr) return;

  const words = [changingSpan.textContent.trim(), ...wordsAttr.split("-")].filter(Boolean);

  gsap.set(changingSpan, { display: "inline-block", verticalAlign: "bottom" });

  const tl = gsap.timeline({ repeat: -1 });

  words.forEach((_, index) => {
    const nextIndex = (index + 1) % words.length;

    tl.to({}, { duration: 2 })
      .to(changingSpan, {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(changingSpan, {
        opacity: 0,
        duration: 0.15,
        ease: "linear"
      }, "<")
      .call(() => {
        changingSpan.textContent = words[nextIndex];
      }, null, "+=0.15")
      .set(changingSpan, { yPercent: 100 })
      .to(changingSpan, {
        yPercent: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
  });
};

// page load
const initPortfolioHeroReveal = () => {
  const lines = document.querySelectorAll(".hero-heading-line");
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-container > *");
  const subtitle = document.querySelector("[data-hero-reveal='subtitle']");

  const hasElements = lines.length || navbar || subtitle;
  if (!hasElements) return;

  const tl = gsap.timeline({
    onComplete: () => {
      document.dispatchEvent(new CustomEvent("heroRevealComplete"));
    }
  });

  const targetsToAnimate = [];
  const lineGroups = [];

  if (lines.length) {
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
  }

  if (navbar) {
    gsap.set(navbar, { opacity: 0 });
  }
  if (navItems.length) {
    gsap.set(navItems, { opacity: 0, y: 10 });
  }

  let split;
  if (subtitle) {
    split = new SplitText(subtitle, { type: "lines" });
    split.lines.forEach(l => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      wrapper.style.padding = "0.2em 0.05em";
      wrapper.style.margin = "-0.2em -0.05em";
      l.parentNode.insertBefore(wrapper, l);
      wrapper.appendChild(l);
    });
    gsap.set(split.lines, { y: "120%" });
  }

  if (targetsToAnimate.length) {
    if (window.innerWidth >= 768) {
      lineGroups.forEach((group, index) => {
        tl.to(group, {
          y: "0%",
          duration: 1,
          ease: "power3.out"
        }, index * 0.25);
      });
    } else {
      tl.to(targetsToAnimate, {
        y: "0%",
        duration: 1,
        stagger: 0.25,
        ease: "power3.out"
      }, 0);
    }
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

  if (subtitle && split) {
    const startOffset = targetsToAnimate.length ? 0.5 : 0;
    tl.to(split.lines, {
      y: "0%",
      opacity: 1,
      duration: 1.5,
      stagger: 0.1,
      ease: "power2.inOut"
    }, startOffset);
  }

  tl.call(initPortfolioLoop, null, "-=2");
  
};

// project numbers
const initOrderNumbers = () => {
  const numbers = document.querySelectorAll("[data-order='number']");
  numbers.forEach(el => {
    const text = el.textContent.trim();
    if (text && !isNaN(text)) {
      el.textContent = text.padStart(2, "0");
    }
  });
};

// project item hover
const initPortfolioAnimation = () => {
  const items = document.querySelectorAll(".project-item");
  const classes = [
    "background-color-lime",
    "background-color-blue",
    "background-color-purple",
    "background-color-fucsia",
    "background-color-red"
  ];

  if (!items.length) return;

  items.forEach((item, index) => {
    const bg = item.querySelector(".project-item-bg");
    if (bg) {
      bg.classList.add(classes[index % classes.length]);
    }
  });

  let mm = gsap.matchMedia();

  mm.add("(min-width: 991px)", () => {
    const hoverCleanups = [];

    items.forEach((item) => {
      const bg = item.querySelector(".project-item-bg");
      const img = item.querySelector(".project-item-img");

      if (bg) {
        gsap.set(bg, { height: "0rem" });
      }
      if (img) {
        gsap.set(img, { scale: 1 });
      }

      const onMouseEnter = () => {
        if (bg) gsap.to(bg, { height: "1.5rem", duration: 0.3, ease: "power2.out" });
        if (img) gsap.to(img, { scale: 1.1, duration: 0.3, ease: "power2.out" });
      };

      const onMouseLeave = () => {
        if (bg) gsap.to(bg, { height: "0rem", duration: 0.3, ease: "power2.out" });
        if (img) gsap.to(img, { scale: 1, duration: 0.3, ease: "power2.out" });
      };

      item.addEventListener("mouseenter", onMouseEnter);
      item.addEventListener("mouseleave", onMouseLeave);
      hoverCleanups.push({ item, onMouseEnter, onMouseLeave });
    });

    return () => {
      hoverCleanups.forEach(({ item, onMouseEnter, onMouseLeave }) => {
        item.removeEventListener("mouseenter", onMouseEnter);
        item.removeEventListener("mouseleave", onMouseLeave);
        
        const bg = item.querySelector(".project-item-bg");
        const img = item.querySelector(".project-item-img");
        if (bg) gsap.set(bg, { clearProps: "height" });
        if (img) gsap.set(img, { clearProps: "scale" });
      });
    };
  });
};

// venues grid slides
let currentBucket = "";
let gsapMedia = gsap.matchMedia();
const getLayoutBucket = () => {
  const w = window.innerWidth;
  if (w > 1200) return "desktop";
  if (w >= 768) return "tablet";
  if (w >= 481) return "mobile-landscape";
  return "mobile-portrait";
};
const buildGrid = () => {
  const stage = document.querySelector(".portfolio-venues-wrap");
  const sourceItems = document.querySelectorAll(".cms-venue-item");
  if (!stage || !sourceItems.length) return;

  const bucket = getLayoutBucket();
  currentBucket = bucket;

  let cols = 10;
  let rows = 3;

  if (bucket === "tablet") {
    cols = 8;
    rows = 4;
  } else if (bucket === "mobile-landscape" || bucket === "mobile-portrait") {
    cols = 8;
    rows = 4;
  }

  stage.querySelectorAll(".venue-view-grid").forEach(g => g.remove());

  const views = {};
  for (let i = 1; i <= 5; i++) {
    const grid = document.createElement("div");
    grid.classList.add("venue-view-grid");
    grid.setAttribute("data-view-id", i);
    stage.appendChild(grid);
    views[i] = grid;
  }

  sourceItems.forEach((item) => {
    const viewId = item.getAttribute("data-view");
    if (views[viewId]) {
      const clone = item.cloneNode(true);
      clone.classList.remove("cms-venue-item");
      clone.classList.add("venue-item-card");
      views[viewId].appendChild(clone);
    }
  });

  Object.keys(views).forEach((viewId) => {
    const grid = views[viewId];
    const cards = Array.from(grid.querySelectorAll(".venue-item-card"));
    
    const highlightedCards = cards.filter(card => {
      const attr = card.getAttribute("data-highlight");
      return attr && attr.trim() !== "";
    });
    const normalCards = cards.filter(card => {
      const attr = card.getAttribute("data-highlight");
      return !attr || attr.trim() === "";
    });

    const coordinates = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        coordinates.push({ row: r, col: c });
      }
    }

    const placedAll = [];
    const placedHighlights = [];

    const isOccupied = (r, c) => placedAll.some(p => p.row === r && p.col === c);

    const checkContiguity = (coord) => {
      const { row: r, col: c } = coord;
      
      if (isOccupied(r, c - 1) && isOccupied(r, c - 2)) return false;
      if (isOccupied(r, c + 1) && isOccupied(r, c + 2)) return false;
      if (isOccupied(r, c - 1) && isOccupied(r, c + 1)) return false;
      if (isOccupied(r - 1, c) && isOccupied(r - 2, c)) return false;
      if (isOccupied(r + 1, c) && isOccupied(r + 2, c)) return false;
      if (isOccupied(r - 1, c) && isOccupied(r + 1, c)) return false;
      
      if (isOccupied(r, c + 1) && isOccupied(r + 1, c) && isOccupied(r + 1, c + 1)) return false;
      if (isOccupied(r, c - 1) && isOccupied(r + 1, c - 1) && isOccupied(r + 1, c)) return false;
      if (isOccupied(r - 1, c) && isOccupied(r, c + 1) && isOccupied(r - 1, c + 1)) return false;
      if (isOccupied(r - 1, c - 1) && isOccupied(r - 1, c) && isOccupied(r, c - 1)) return false;
      
      return true;
    };

    highlightedCards.forEach((card) => {
      if (coordinates.length === 0) return;

      const validCoordinates = coordinates.filter(coord => {
        if (coord.col === 1 || coord.col === cols) return false;
        
        const noAdjacentHighlight = !placedHighlights.some(ph => {
          return (Math.abs(coord.row - ph.row) + Math.abs(coord.col - ph.col)) === 1;
        });
        return noAdjacentHighlight && checkContiguity(coord);
      });

      const targetPool = validCoordinates.length > 0 ? validCoordinates : coordinates.filter(c => c.col !== 1 && c.col !== cols);
      if (targetPool.length === 0) return;
      
      const randomIndex = Math.floor(Math.random() * targetPool.length);
      const chosenCoord = targetPool[randomIndex];

      const coordIndex = coordinates.findIndex(c => c.row === chosenCoord.row && c.col === chosenCoord.col);
      const coords = coordinates.splice(coordIndex, 1)[0];

      placedHighlights.push(coords);
      placedAll.push(coords);
      card.style.gridRowStart = coords.row;
      card.style.gridColumnStart = coords.col;
    });

    if (normalCards.length > 0) {
      let col1Pool = coordinates.filter(c => c.col === 1 && checkContiguity(c));
      if (col1Pool.length === 0) col1Pool = coordinates.filter(c => c.col === 1);
      
      if (col1Pool.length > 0) {
        const card = normalCards.shift();
        const randomIndex = Math.floor(Math.random() * col1Pool.length);
        const chosenCoord = col1Pool[randomIndex];
        const coordIndex = coordinates.findIndex(c => c.row === chosenCoord.row && c.col === chosenCoord.col);
        const coords = coordinates.splice(coordIndex, 1)[0];
        
        placedAll.push(coords);
        card.style.gridRowStart = coords.row;
        card.style.gridColumnStart = coords.col;
      }
    }

    if (normalCards.length > 0) {
      let colMaxPool = coordinates.filter(c => c.col === cols && checkContiguity(c));
      if (colMaxPool.length === 0) colMaxPool = coordinates.filter(c => c.col === cols);
      
      if (colMaxPool.length > 0) {
        const card = normalCards.shift();
        const randomIndex = Math.floor(Math.random() * colMaxPool.length);
        const chosenCoord = colMaxPool[randomIndex];
        const coordIndex = coordinates.findIndex(c => c.row === chosenCoord.row && c.col === chosenCoord.col);
        const coords = coordinates.splice(coordIndex, 1)[0];
        
        placedAll.push(coords);
        card.style.gridRowStart = coords.row;
        card.style.gridColumnStart = coords.col;
      }
    }

    normalCards.forEach((card) => {
      if (coordinates.length === 0) return;

      const validCoordinates = coordinates.filter(coord => checkContiguity(coord));

      const targetPool = validCoordinates.length > 0 ? validCoordinates : coordinates;
      const randomIndex = Math.floor(Math.random() * targetPool.length);
      const chosenCoord = targetPool[randomIndex];

      const coordIndex = coordinates.findIndex(c => c.row === chosenCoord.row && c.col === chosenCoord.col);
      const coords = coordinates.splice(coordIndex, 1)[0];

      placedAll.push(coords);
      card.style.gridRowStart = coords.row;
      card.style.gridColumnStart = coords.col;
    });
  });

  gsapMedia.revert();
  gsapMedia = gsap.matchMedia();

  gsapMedia.add("(min-width: 768px)", () => {
    const grids = gsap.utils.toArray(".venue-view-grid");
    gsap.set(grids, { opacity: 0, pointerEvents: "none" });

    const tl = gsap.timeline({ repeat: -1 });
    grids.forEach((grid) => {
      tl.to(grid, { opacity: 1, pointerEvents: "auto", duration: 0.35 })
        .to({}, { duration: 2.2 })
        .to(grid, { opacity: 0, pointerEvents: "none", duration: 0.35 });
    });
  });

  gsapMedia.add("(max-width: 767px)", () => {
    gsap.set(".venue-view-grid", { opacity: 1, pointerEvents: "auto" });
  });
};

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (getLayoutBucket() !== currentBucket) {
      buildGrid();
    }
  }, 200);
});

const runPortfolio = () => {
  initPortfolioHeroReveal();
  initOrderNumbers();
  initPortfolioAnimation();
  buildGrid();
};

const checkGsapAndRun = () => {
  if (typeof window.gsap === "undefined" || typeof window.SplitText === "undefined") {
    setTimeout(checkGsapAndRun, 50);
    return;
  }
  
  if (document.readyState === "complete") {
    runPortfolio();
  } else {
    window.addEventListener("load", runPortfolio);
  }
};

window.Webflow = window.Webflow || [];
window.Webflow.push(checkGsapAndRun);