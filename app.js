// Import quotes from external file
import quotes from "./quotes.js";

const WEEKS_IN_YEAR = 52;
const DAY_MS = 24 * 60 * 60 * 1000;

// Proportions relative to the cell size
const GAP_RATIO = 0.2;
const DECADE_RATIO = 1;
const BLOCK_RATIO = 2;
const LABEL_RATIO = 2;

// Color presets selectable in Wallpaper Engine ("custom" uses the color pickers)
const THEMES = {
  ash: {
    bg: "#121212",
    lived: "#ece4d4",
    future: "rgba(236, 228, 212, 0.13)",
    current: "#d4a65a",
    text: "#ece4d4",
  },
  midnight: {
    bg: "#0a0f1d",
    lived: "#8fb3f0",
    future: "rgba(143, 179, 240, 0.14)",
    current: "#ffd479",
    text: "#dfe7f7",
  },
  paper: {
    bg: "#ece6da",
    lived: "#2b2622",
    future: "rgba(43, 38, 34, 0.12)",
    current: "#b23a2f",
    text: "#2b2622",
  },
  crimson: {
    bg: "#100808",
    lived: "#c0362c",
    future: "rgba(240, 217, 214, 0.1)",
    current: "#ffd2c8",
    text: "#f0d9d6",
  },
  forest: {
    bg: "#0d1310",
    lived: "#9cc5a1",
    future: "rgba(156, 197, 161, 0.13)",
    current: "#f2d388",
    text: "#dde8df",
  },
};

// Current settings – overwritten by Wallpaper Engine user properties
const settings = {
  birthDay: 1,
  birthMonth: 1,
  birthYear: 2000,
  lifeExpectancy: 80,
  title: "MEMENTO MORI",
  theme: "ash",
  colors: { ...THEMES.ash },
  cellShape: "rounded",
  columns: "auto",
  gridScale: 100,
  showStats: true,
  showQuote: true,
  showLabels: true,
  showLegend: true,
  showSupport: true,
  pulse: true,
};

// ---------- Date helpers ----------

// Clamp the day so e.g. 31 February becomes 28/29 February
function makeDate(year, month, day) {
  const lastDay = new Date(year, month, 0).getDate();
  return new Date(year, month - 1, Math.min(day, lastDay));
}

function addYears(date, years) {
  return makeDate(date.getFullYear() + years, date.getMonth() + 1, date.getDate());
}

function getBirthDate() {
  return makeDate(settings.birthYear, settings.birthMonth, settings.birthDay);
}

// Returns "past" | "current" | "" for every week of every year of life
function computeWeeks() {
  const birth = getBirthDate();
  const today = new Date();
  const years = [];
  let lived = 0;

  for (let y = 0; y < settings.lifeExpectancy; y++) {
    // Each row is one year of life, starting on the birthday of that age
    const yearStart = addYears(birth, y);
    const nextYearStart = addYears(birth, y + 1);
    const weeks = [];

    for (let w = 0; w < WEEKS_IN_YEAR; w++) {
      const start = new Date(yearStart.getTime() + w * 7 * DAY_MS);
      // The last week absorbs the remaining 1–2 days of the year
      const end =
        w === WEEKS_IN_YEAR - 1
          ? nextYearStart
          : new Date(start.getTime() + 7 * DAY_MS);

      if (end <= today) {
        weeks.push("past");
        lived++;
      } else if (start <= today) {
        weeks.push("current");
      } else {
        weeks.push("");
      }
    }
    years.push(weeks);
  }

  return { birth, today, years, lived };
}

// ---------- Layout ----------

// Rows (years) per block when the calendar is split into `blocks` side-by-side blocks
function rowsPerBlock(blocks) {
  const decades = Math.ceil(settings.lifeExpectancy / 10);
  return Math.min(Math.ceil(decades / blocks) * 10, settings.lifeExpectancy);
}

// Pixel size of the whole calendar for given integer metrics
function calendarSize(blocks, m) {
  const rows = rowsPerBlock(blocks);
  const decades = Math.ceil(rows / 10);
  const labelRow = settings.showLabels ? m.cell + m.decadeGap * 0.6 : 0;
  const blockWidth = m.label + WEEKS_IN_YEAR * (m.cell + m.gap);
  return {
    width: blocks * blockWidth + (blocks - 1) * m.blockGap,
    height:
      labelRow +
      rows * m.cell +
      (rows - decades) * m.gap +
      (decades - 1) * m.decadeGap,
  };
}

function metricsFor(cell) {
  return {
    cell,
    gap: Math.max(1, Math.round(cell * GAP_RATIO)),
    decadeGap: Math.max(4, Math.round(cell * DECADE_RATIO)),
    blockGap: Math.round(cell * BLOCK_RATIO),
    label: Math.max(18, Math.round(cell * LABEL_RATIO)),
  };
}

// Largest whole-pixel cell size for which the calendar fits the available space
function bestCellSize(blocks, availW, availH) {
  let cell = 60;
  while (cell > 2) {
    const size = calendarSize(blocks, metricsFor(cell));
    if (size.width <= availW && size.height <= availH) break;
    cell--;
  }
  return cell;
}

function chooseLayout() {
  const header = document.querySelector(".header");
  const progress = document.getElementById("progress");
  const footer = document.querySelector(".footer");
  const frameGap = window.innerHeight * 0.013;

  const outer = (el) => (el.classList.contains("hidden") ? 0 : el.offsetHeight + frameGap);
  // Keep the top-left support heart clear of the title
  const verticalMargin = Math.max(
    window.innerHeight * 0.04,
    settings.showSupport ? 2 * 44 : 0
  );
  const availH =
    window.innerHeight - verticalMargin - outer(header) - outer(progress) - outer(footer);
  const availW = window.innerWidth * 0.97;

  const candidates =
    settings.columns === "auto" ? [1, 2, 3, 4] : [Number(settings.columns)];

  let best = { blocks: 1, cell: 2 };
  for (const blocks of candidates) {
    const cell = bestCellSize(blocks, availW, availH);
    if (cell > best.cell) best = { blocks, cell };
  }

  // Grid size setting shrinks the calendar, still in whole pixels
  best.cell = Math.max(2, Math.floor((best.cell * settings.gridScale) / 100));
  return best;
}

function applyMetrics(m) {
  const root = document.documentElement;
  const radius = {
    square: "0px",
    rounded: `${Math.max(1, Math.round(m.cell * 0.22))}px`,
    circle: "50%",
  }[settings.cellShape] || "0px";

  root.style.setProperty("--cell", `${m.cell}px`);
  root.style.setProperty("--gap", `${m.gap}px`);
  root.style.setProperty("--decade-gap", `${m.decadeGap}px`);
  root.style.setProperty("--block-gap", `${m.blockGap}px`);
  root.style.setProperty("--label-width", `${m.label}px`);
  root.style.setProperty("--radius", radius);
}

// ---------- Rendering ----------

function buildWeekLabels() {
  const labels = document.createElement("div");
  labels.className = "week-labels";
  labels.appendChild(document.createElement("span"));
  for (let w = 1; w <= WEEKS_IN_YEAR; w++) {
    const span = document.createElement("span");
    if (w === 1 || w % 10 === 0) span.textContent = w;
    labels.appendChild(span);
  }
  return labels;
}

function renderCalendar(data, blocks) {
  const calendar = document.getElementById("calendar");
  const perBlock = rowsPerBlock(blocks);
  const fragment = document.createDocumentFragment();

  for (let start = 0; start < data.years.length; start += perBlock) {
    const block = document.createElement("div");
    block.className = "block";
    if (settings.showLabels) block.appendChild(buildWeekLabels());

    const end = Math.min(start + perBlock, data.years.length);
    for (let d = start; d < end; d += 10) {
      // One grid per decade: label column + 52 week columns
      const decade = document.createElement("div");
      decade.className = "decade";

      for (let y = d; y < Math.min(d + 10, end); y++) {
        const label = document.createElement("span");
        label.className = "row-label";
        if (settings.showLabels && y === d) label.textContent = y;
        decade.appendChild(label);

        for (const state of data.years[y]) {
          const cell = document.createElement("i");
          cell.className = state ? `cell ${state}` : "cell";
          decade.appendChild(cell);
        }
      }
      block.appendChild(decade);
    }
    fragment.appendChild(block);
  }

  calendar.replaceChildren(fragment);
}

function renderStats(data) {
  const stats = document.getElementById("stats");
  const totalWeeks = settings.lifeExpectancy * WEEKS_IN_YEAR;
  const weeksLeft = Math.max(totalWeeks - data.lived - 1, 0);
  const percent = Math.min((data.lived / totalWeeks) * 100, 100);

  let age = data.today.getFullYear() - data.birth.getFullYear();
  if (addYears(data.birth, age) > data.today) age--;

  const fmt = (n) => n.toLocaleString("en-US");
  const tiles = [
    [Math.max(age, 0), "Age"],
    [fmt(data.lived), "Weeks lived"],
    [fmt(weeksLeft), "Weeks left"],
    [`${percent.toFixed(1)}%`, "Of life"],
  ];
  stats.innerHTML = tiles
    .map(
      ([value, label]) =>
        `<div class="stat"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`
    )
    .join("");

  document.getElementById("progressBar").style.width = `${percent}%`;
  stats.classList.toggle("hidden", !settings.showStats);
  document.getElementById("progress").classList.toggle("hidden", !settings.showStats);
}

let currentData = null;
let currentBlocks = 0;

// Recompute weeks (e.g. a new week started) and redraw everything
function renderAll() {
  currentData = computeWeeks();
  renderStats(currentData);
  currentBlocks = 0;
  layout();
}

// Fit the calendar to the screen; rebuild cells only if the block count changed
function layout() {
  if (!currentData) return;
  // Second pass: the header may wrap once the frame width is known
  for (let pass = 0; pass < 2; pass++) {
    const { blocks, cell } = chooseLayout();
    const metrics = metricsFor(cell);
    applyMetrics(metrics);
    // Header and footer match the calendar width, but keep room for text on narrow screens
    const frameWidth = Math.max(
      calendarSize(blocks, metrics).width,
      Math.min(window.innerWidth * 0.92, 720)
    );
    document.documentElement.style.setProperty("--frame-width", `${frameWidth}px`);
    if (blocks !== currentBlocks) {
      renderCalendar(currentData, blocks);
      currentBlocks = blocks;
    }
  }
}

function applyTheme() {
  const colors =
    settings.theme === "custom" ? settings.colors : THEMES[settings.theme];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(colors || THEMES.ash)) {
    root.style.setProperty(`--${key}`, value);
  }
}

function applyTexts() {
  const title = document.getElementById("title");
  title.textContent = settings.title;
  // An empty title hides the subtitle too
  document.querySelector(".brand").classList.toggle("hidden", !settings.title);
  document.getElementById("quote").classList.toggle("hidden", !settings.showQuote);
  document.getElementById("legend").classList.toggle("hidden", !settings.showLegend);
  document
    .querySelector(".footer")
    .classList.toggle("hidden", !settings.showQuote && !settings.showLegend);
  document.getElementById("support").classList.toggle("hidden", !settings.showSupport);
  document.body.classList.toggle("pulse", settings.pulse);
}

function render() {
  applyTheme();
  applyTexts();
  renderAll();
}

// ---------- Quotes ----------

function showRandomQuote() {
  const raw = quotes[Math.floor(Math.random() * quotes.length)];
  const [text, author] = raw.split("―").map((part) => part.trim());

  const quote = document.getElementById("quote");
  quote.textContent = text;
  if (author) {
    const authorEl = document.createElement("span");
    authorEl.className = "author";
    authorEl.textContent = author;
    quote.appendChild(authorEl);
  }
  layout();
}

// ---------- Wallpaper Engine integration ----------

// Wallpaper Engine sends colors as "r g b" with values 0–1
function weColor(value, alpha = 1) {
  const [r, g, b] = value.split(" ").map((c) => Math.round(parseFloat(c) * 255));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

window.wallpaperPropertyListener = {
  applyUserProperties(props) {
    const p = (key) => (props[key] ? props[key].value : undefined);

    if (p("birthday") !== undefined) settings.birthDay = Number(p("birthday"));
    if (p("birthmonth") !== undefined) settings.birthMonth = Number(p("birthmonth"));
    if (p("birthyear") !== undefined) settings.birthYear = Number(p("birthyear"));
    if (p("lifeexpectancy") !== undefined)
      settings.lifeExpectancy = Number(p("lifeexpectancy"));
    if (p("titletext") !== undefined) settings.title = p("titletext");
    if (p("theme") !== undefined) settings.theme = p("theme");
    if (p("cellshape") !== undefined) settings.cellShape = p("cellshape");
    if (p("columns") !== undefined) settings.columns = p("columns");
    if (p("gridscale") !== undefined) settings.gridScale = Number(p("gridscale"));
    if (p("showstats") !== undefined) settings.showStats = p("showstats");
    if (p("showquote") !== undefined) settings.showQuote = p("showquote");
    if (p("showlabels") !== undefined) settings.showLabels = p("showlabels");
    if (p("showlegend") !== undefined) settings.showLegend = p("showlegend");
    if (p("showsupport") !== undefined) settings.showSupport = p("showsupport");
    if (p("pulse") !== undefined) settings.pulse = p("pulse");

    if (p("backgroundcolor")) settings.colors.bg = weColor(p("backgroundcolor"));
    if (p("textcolor")) settings.colors.text = weColor(p("textcolor"));
    if (p("livedcolor")) settings.colors.lived = weColor(p("livedcolor"));
    if (p("currentcolor")) settings.colors.current = weColor(p("currentcolor"));
    if (p("futurecolor")) settings.colors.future = weColor(p("futurecolor"), 0.15);

    render();
  },
};

// ---------- Init ----------

// Outside Wallpaper Engine the birth date can be tested via ?birth=1995-06-15
function loadUrlParams() {
  const birth = new URLSearchParams(location.search).get("birth");
  const match = birth && birth.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    settings.birthYear = Number(match[1]);
    settings.birthMonth = Number(match[2]);
    settings.birthDay = Number(match[3]);
  }
}

loadUrlParams();
showRandomQuote();
render();

window.addEventListener("resize", layout);
document.fonts?.ready.then(layout);

// Refresh the calendar every hour (new week) and the quote every 24 hours
setInterval(renderAll, 60 * 60 * 1000);
setInterval(showRandomQuote, 24 * 60 * 60 * 1000);
