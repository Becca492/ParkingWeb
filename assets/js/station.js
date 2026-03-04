let currentField = null;
let calYear = 2026,
  calMonth = 2;
let selectedDay = 12;
let currentTimeField = null;
let selectedHour = 10,
  selectedMin = 0;
let summaryVisible = false;
let selectedOfferPrice = null;

let arriveeDate = { d: 12, m: 3, y: 2026 };
let departDate = { d: 12, m: 3, y: 2026 };
let arriveeTime = { h: 10, min: 0 };
let departTime = { h: 13, min: 0 };

const PRICE_PER_HOUR = 2500;
const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const dayNames = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

function computeSummary() {
  const a = new Date(
    arriveeDate.y,
    arriveeDate.m - 1,
    arriveeDate.d,
    arriveeTime.h,
    arriveeTime.min,
  );
  const d = new Date(
    departDate.y,
    departDate.m - 1,
    departDate.d,
    departTime.h,
    departTime.min,
  );
  const diffMs = d - a;
  const diffH = Math.max(0, Math.floor(diffMs / 3600000));
  const diffMin = Math.max(0, Math.floor((diffMs % 3600000) / 60000));

  let durationLabel = "";
  if (diffH > 0 && diffMin > 0) durationLabel = `${diffH} h ${diffMin} min`;
  else if (diffH > 0)
    durationLabel = `${String(diffH).padStart(2, "0")} heure${diffH > 1 ? "s" : ""}`;
  else if (diffMin > 0) durationLabel = `${diffMin} min`;
  else durationLabel = "—";

  const totalPrice =
    selectedOfferPrice !== null
      ? selectedOfferPrice
      : diffH * PRICE_PER_HOUR +
        (diffMin > 0 ? Math.round(PRICE_PER_HOUR / 2) : 0);

  const fmt2 = (n) => String(n).padStart(2, "0");
  document.getElementById("summary-duration-label").textContent = durationLabel;
  document.getElementById("summary-date").textContent =
    `${fmt2(arriveeDate.d)}/${fmt2(arriveeDate.m)}/${arriveeDate.y}`;
  document.getElementById("summary-hours").textContent =
    `${fmt2(arriveeTime.h)} h - ${fmt2(departTime.h)} h`;
  document.getElementById("summary-total").textContent =
    totalPrice.toLocaleString("fr-FR") + " Fcfa";
}

function showSummary() {
  computeSummary();
  document.getElementById("summary-wrap").classList.add("visible");
  summaryVisible = true;
}

function handleConfirm() {
  if (!summaryVisible) {
    showSummary();
  } else {
    const btn = document.querySelector(".cta-btn");
    btn.textContent = "✓ Réservé !";
    btn.style.background = "#8ab800";
    btn.style.color = "#fff";
    setTimeout(() => {
      btn.textContent = "Confirmer";
      btn.style.background = "";
      btn.style.color = "";
    }, 2000);
  }
}

function renderCalendar() {
  document.getElementById("cal-month-label").textContent =
    monthNames[calMonth] + " " + calYear;
  const grid = document.getElementById("cal-grid");
  grid.innerHTML = "";
  dayNames.forEach((d) => {
    const el = document.createElement("div");
    el.className = "cal-day-name";
    el.textContent = d;
    grid.appendChild(el);
  });
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement("div");
    el.className = "cal-day empty";
    grid.appendChild(el);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement("div");
    el.className = "cal-day" + (d === selectedDay ? " selected" : "");
    el.textContent = d;
    el.onclick = () => {
      document
        .querySelectorAll(".cal-day")
        .forEach((x) => x.classList.remove("selected"));
      el.classList.add("selected");
      selectedDay = d;
    };
    grid.appendChild(el);
  }
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }
  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }
  selectedDay = null;
  renderCalendar();
}

function openCalendar(field) {
  currentField = field;
  const src = field === "arrivee-date" ? arriveeDate : departDate;
  calYear = src.y;
  calMonth = src.m - 1;
  selectedDay = src.d;
  renderCalendar();
  document.getElementById("overlay-calendar").classList.add("show");
}

function confirmDate() {
  if (selectedDay && currentField) {
    const mm = String(calMonth + 1).padStart(2, "0");
    const dd = String(selectedDay).padStart(2, "0");
    const yy = String(calYear).slice(2);
    document.getElementById(currentField + "-val").textContent =
      dd + "/" + mm + "/" + yy;
    if (currentField === "arrivee-date")
      arriveeDate = { d: selectedDay, m: calMonth + 1, y: calYear };
    else departDate = { d: selectedDay, m: calMonth + 1, y: calYear };
    if (summaryVisible) computeSummary();
  }
  closeOverlay("overlay-calendar");
}

function buildScrollList(containerId, values, selected) {
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  ["", ""].forEach(() => {
    const pad = document.createElement("div");
    pad.className = "time-item";
    pad.style.visibility = "hidden";
    pad.textContent = "00";
    el.appendChild(pad);
  });
  values.forEach((v) => {
    const item = document.createElement("div");
    item.className = "time-item" + (v === selected ? " active" : "");
    item.textContent = String(v).padStart(2, "0");
    item.onclick = () => {
      el.querySelectorAll(".time-item").forEach((i) =>
        i.classList.remove("active"),
      );
      item.classList.add("active");
      if (containerId === "hour-scroll") selectedHour = v;
      else selectedMin = v;
    };
    el.appendChild(item);
  });
  ["", ""].forEach(() => {
    const pad = document.createElement("div");
    pad.className = "time-item";
    pad.style.visibility = "hidden";
    pad.textContent = "00";
    el.appendChild(pad);
  });
  const idx = values.indexOf(selected);
  if (idx >= 0)
    setTimeout(() => {
      el.scrollTop = idx * 44;
    }, 50);
}

function openTimePicker(field) {
  currentTimeField = field;
  const src = field === "arrivee-time" ? arriveeTime : departTime;
  selectedHour = src.h;
  selectedMin = src.min;
  document.getElementById("time-sheet-title").textContent =
    field === "arrivee-time" ? "Heure d'arrivée" : "Heure de départ";
  buildScrollList(
    "hour-scroll",
    Array.from({ length: 24 }, (_, i) => i),
    selectedHour,
  );
  buildScrollList(
    "min-scroll",
    Array.from({ length: 60 }, (_, i) => i),
    selectedMin,
  );
  document.getElementById("overlay-time").classList.add("show");
}

function confirmTime() {
  const fmt = (n) => String(n).padStart(2, "0");
  document.getElementById(currentTimeField + "-val").textContent =
    fmt(selectedHour) + " : " + fmt(selectedMin);
  if (currentTimeField === "arrivee-time")
    arriveeTime = { h: selectedHour, min: selectedMin };
  else departTime = { h: selectedHour, min: selectedMin };
  if (summaryVisible) computeSummary();
  closeOverlay("overlay-time");
}

function openOffers() {
  document.getElementById("overlay-offers").classList.add("show");
}

function selectOffer(card, price) {
  document
    .querySelectorAll(".offer-card")
    .forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");
  selectedOfferPrice = price;
}

function confirmOffer() {
  if (summaryVisible) computeSummary();
  closeOverlay("overlay-offers");
}

function closeOverlay(id) {
  document.getElementById(id).classList.remove("show");
}

document.querySelectorAll(".overlay").forEach((ov) => {
  ov.addEventListener("click", function (e) {
    if (e.target === ov) ov.classList.remove("show");
  });
});
