/* Sea2Sky Traders - Google Analytics 4.
   Paste the Measurement ID from Google Analytics (it starts with "G-") between the quotes.
   While it is empty, nothing is loaded and nothing is tracked. */
(function () {
  var GA_ID = "G-9DVM31YPVE";
  if (!GA_ID) { return; }
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });

  // Count WhatsApp and email orders as events, so sales show up in reports.
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a, button") : null;
    if (!a) { return; }
    var href = a.getAttribute("href") || "";
    if (a.id === "checkoutWa" || a.id === "checkoutMail") {
      window.gtag("event", "begin_checkout", { method: a.id === "checkoutWa" ? "whatsapp" : "email" });
    } else if (href.indexOf("wa.me") !== -1) {
      window.gtag("event", "contact_whatsapp");
    } else if (href.indexOf("mailto:") === 0) {
      window.gtag("event", "contact_email");
    } else if (a.classList && a.classList.contains("btn-add")) {
      window.gtag("event", "add_to_cart", { item_name: a.getAttribute("data-add") || "" });
    }
  }, true);
})();
