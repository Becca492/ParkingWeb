let current = "mobile";

const radios = {
  mobile: document.getElementById("radio-mobile"),
  visa: document.getElementById("radio-visa"),
  mastercard: document.getElementById("radio-mastercard"),
  paypal: document.getElementById("radio-paypal"),
  applepay: document.getElementById("radio-applepay"),
};

const options = {
  visa: document.getElementById("opt-visa"),
  mastercard: document.getElementById("opt-mastercard"),
  paypal: document.getElementById("opt-paypal"),
  applepay: document.getElementById("opt-applepay"),
};

const mobileBox = document.getElementById("mobile-section");

function selectMethod(method) {
  Object.values(radios).forEach((r) => {
    r.className = "radio-empty";
    r.removeAttribute("style");
  });
  Object.values(options).forEach((o) => o.classList.remove("active"));
  mobileBox.style.borderColor = "var(--border)";

  if (method === "mobile") {
    radios.mobile.className = "radio-dot";
    mobileBox.style.borderColor = "var(--accent)";
  } else {
    radios[method].style.cssText =
      "width:18px;height:18px;border-radius:50%;background:var(--accent);border:2px solid var(--accent);flex-shrink:0;";
    options[method]?.classList.add("active");
  }
  current = method;
}

document.getElementById("cta-btn").addEventListener("click", function () {
  this.textContent = "✓ Paiement confirmé !";
  this.style.background = "#8ab800";
  this.style.color = "#fff";
  setTimeout(() => {
    this.textContent = "Confirmer";
    this.style.background = "";
    this.style.color = "";
  }, 2000);
});
