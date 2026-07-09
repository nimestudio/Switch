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

// venues grid
const initVenueMap = () => {
  const stage = document.querySelector(".portfolio-venues-wrap");
  const sourceItems = document.querySelectorAll(".cms-venue-item");
  if (!stage || !sourceItems.length) return;

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
    for (let row = 1; row <= 3; row++) {
      for (let col = 1; col <= 10; col++) {
        coordinates.push({ row, col });
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
      return true;
    };

    highlightedCards.forEach((card) => {
      if (coordinates.length === 0) return;

      const validCoordinates = coordinates.filter(coord => {
        const noAdjacentHighlight = !placedHighlights.some(ph => {
          return (Math.abs(coord.row - ph.row) + Math.abs(coord.col - ph.col)) === 1;
        });
        return noAdjacentHighlight && checkContiguity(coord);
      });

      const targetPool = validCoordinates.length > 0 ? validCoordinates : coordinates;
      const randomIndex = Math.floor(Math.random() * targetPool.length);
      const chosenCoord = targetPool[randomIndex];

      const coordIndex = coordinates.findIndex(c => c.row === chosenCoord.row && c.col === chosenCoord.col);
      const coords = coordinates.splice(coordIndex, 1)[0];

      placedHighlights.push(coords);
      placedAll.push(coords);
      card.style.gridRowStart = coords.row;
      card.style.gridColumnStart = coords.col;
    });

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

  let mm = gsap.matchMedia();

  mm.add("(min-width: 991px)", () => {
    const grids = gsap.utils.toArray(".venue-view-grid");
    gsap.set(grids, { opacity: 0, pointerEvents: "none" });

    const tl = gsap.timeline({ repeat: -1 });
    grids.forEach((grid) => {
      tl.to(grid, { opacity: 1, pointerEvents: "auto", duration: 0.35 })
        .to({}, { duration: 2.2 })
        .to(grid, { opacity: 0, pointerEvents: "none", duration: 0.35 });
    });
  });

  mm.add("(max-width: 990px)", () => {
    gsap.set(".venue-view-grid", { opacity: 1, pointerEvents: "auto" });
  });
};

const runPortfolio = () => {
  initPortfolioBackgrounds();
  initPortfolioHover();
  initVenueMap();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", runPortfolio);
} else {
  runPortfolio();
}