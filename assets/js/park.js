const CHECK = `<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const IMG_GRAY = `<img src="assets/img/15.svg" class="car-img" alt=""/>`;
const IMG_ORANGE = `<img src="assets/img/15.svg" class="car-img orange" alt=""/>`;

let currentSelected = document.getElementById("spot-preselected");

function deselect(el) {
  el.classList.remove("selected");
  el.querySelector(".selected-bar")?.remove();
  el.querySelector(".check-badge")?.remove();
  el.querySelector(".selected-label")?.remove();
  const img = el.querySelector("img");
  if (img) img.classList.remove("orange");
}

function doSelect(el) {
  el.classList.add("selected");

  const bar = document.createElement("div");
  bar.className = "selected-bar";
  el.prepend(bar);

  const badge = document.createElement("div");
  badge.className = "check-badge";
  badge.innerHTML = CHECK;
  el.appendChild(badge);

  const img = el.querySelector("img");
  if (img) img.classList.add("orange");

  const label = document.createElement("div");
  label.className = "selected-label";
  label.innerHTML = CHECK + " Place Sélectionnée";
  el.appendChild(label);
}

function selectSpot(el) {
  if (el.classList.contains("empty-spot") || el === currentSelected) return;
  if (currentSelected) deselect(currentSelected);
  doSelect(el);
  currentSelected = el;
}
function setTab(el) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
}

document.getElementById("cta-btn").addEventListener("click", function () {
  this.textContent = "✓ Confirmé !";
  this.style.background = "#8ab800";
  this.style.color = "#fff";
  setTimeout(() => {
    this.textContent = "Continuer";
    this.style.background = "";
    this.style.color = "";
  }, 2000);
});
