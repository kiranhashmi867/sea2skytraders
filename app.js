/* Sea2Sky Traders - "Install app" button.
   Shows a small button in the bottom left corner when the browser can install the app.
   It is hidden inside the installed app and after installing. */
(function () {
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (standalone) { return; }

  var promptEvent = null;
  var buttons = [];

  var style = document.createElement("style");
  style.textContent =
    ".app-install{display:none;align-items:center;justify-content:center;gap:10px;border:0;cursor:pointer;font-family:inherit;font-weight:700;font-size:.95rem;line-height:1;color:#fff;background:#b8904a;border-radius:999px;padding:12px 18px;font-size:.85rem;box-shadow:0 14px 30px -12px rgba(8,42,32,.6)}" +
    ".app-install.show{display:inline-flex}" +
    ".app-install-float{position:fixed;left:14px;bottom:20px;z-index:9998}" ;
  document.head.appendChild(style);

  function makeButton(extraClass) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "app-install " + extraClass;
    b.innerHTML = '<i class="fas fa-download"></i><span>Install our app</span>';
    b.addEventListener("click", function () {
      if (!promptEvent) { return; }
      promptEvent.prompt();
      promptEvent = null;
      setShown(false);
    });
    buttons.push(b);
    return b;
  }

  function setShown(on) {
    buttons.forEach(function (b) { b.classList.toggle("show", on); });
  }

  document.body.appendChild(makeButton("app-install-float"));

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    promptEvent = e;
    setShown(true);
  });
  window.addEventListener("appinstalled", function () {
    promptEvent = null;
    setShown(false);
  });
})();
