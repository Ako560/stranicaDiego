(function () {
  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var btn = qs('button[aria-controls="mobile-nav"]');
  var nav = qs("#mobile-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var closed = nav.classList.contains("invisible");
      nav.classList.toggle("invisible", !closed);
      nav.classList.toggle("opacity-0", !closed);
      document.body.style.overflow = closed ? "hidden" : "";
      btn.setAttribute("aria-expanded", closed ? "true" : "false");
    });
    qsa("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.add("invisible", "opacity-0");
        document.body.style.overflow = "";
      });
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("reveal-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    qsa(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    qsa(".reveal").forEach(function (el) { el.classList.add("reveal-in"); });
  }

  var tabs = qsa('[role="tab"]');
  if (tabs.length) {
    var cards = qsa(".js-project");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var filter = tab.getAttribute("data-filter") || tab.textContent.trim();
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.classList.toggle("border-ink", on);
          t.classList.toggle("bg-ink", on);
          t.classList.toggle("text-paper", on);
          t.classList.toggle("border-line", !on);
          t.classList.toggle("text-mute", !on);
        });
        cards.forEach(function (card) {
          var cat = card.getAttribute("data-category") || "";
          card.style.display = (filter === "Svi" || cat === filter) ? "" : "none";
        });
      });
    });
  }

  var form = qs("form");
  if (form && qs("#ime", form)) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.innerHTML =
        '<div class="border border-line bg-canvas px-8 py-14 text-center">' +
        '<p class="text-[11px] tracking-[0.28em] text-mute uppercase">Upit zaprimljen</p>' +
        '<h2 class="mt-4 text-2xl font-medium tracking-[0.06em] uppercase">Hvala na poruci.</h2>' +
        '<p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">Vaš upit je zabilježen. Javit ćemo se čim pregledamo podloge i zahtjev.</p>' +
        "</div>";
    });
  }
})();
