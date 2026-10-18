/* Sea2Sky Traders - shared store settings (used by every page)
   - PAYMENT: fill in the details and the cart shows them automatically.
   - RATES: approximate exchange rates for showing prices in other currencies.
     Orders are always charged in USD. AED and SAR are fixed to the US dollar;
     update GBP, EUR and JPY from time to time. */
(function () {
  var PAYMENT = {
    paypalMe: "",   // PayPal.me name only, for example "sea2skytraders" from paypal.me/sea2skytraders
    bank: "",       // for example "Meezan Bank, Account title: ..., IBAN: PK.."
    wallet: ""      // for example "JazzCash 0300 1234567 (Account title)"
  };

  var RATES = { USD: 1, AED: 3.6725, SAR: 3.75, GBP: 0.75, EUR: 0.889, JPY: 158 };
  var KEY = "s2sCurrency";

  function currency() {
    var c = "USD";
    try { c = localStorage.getItem(KEY) || "USD"; } catch (e) {}
    return RATES[c] ? c : "USD";
  }

  function fmt(usd, cur) {
    cur = cur || currency();
    var v = usd * RATES[cur];
    if (cur === "JPY") { return "¥" + Math.round(v).toLocaleString("en-US"); }
    var s = v.toFixed(2);
    if (cur === "USD") { return "$" + (usd % 1 === 0 ? String(usd) : usd.toFixed(2)); }
    if (cur === "GBP") { return "£" + s; }
    if (cur === "EUR") { return "€" + s; }
    return cur + " " + s;
  }

  function apply() {
    var cur = currency();
    var els = document.querySelectorAll(".money[data-usd]");
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = fmt(parseFloat(els[i].getAttribute("data-usd")), cur);
    }
    var sel = document.getElementById("curSel");
    if (sel) { sel.value = cur; }
    var ev;
    try { ev = new CustomEvent("s2s:currency", { detail: cur }); }
    catch (e) { ev = document.createEvent("Event"); ev.initEvent("s2s:currency", true, true); }
    window.dispatchEvent(ev);
  }

  window.S2S = { payment: PAYMENT, rates: RATES, currency: currency, fmt: fmt, apply: apply };

  var sel = document.getElementById("curSel");
  if (sel) {
    sel.addEventListener("change", function () {
      try { localStorage.setItem(KEY, sel.value); } catch (e) {}
      apply();
    });
  }
  window.addEventListener("storage", function (e) { if (e.key === KEY) { apply(); } });
  apply();
})();
