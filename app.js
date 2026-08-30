(function () {
  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var btn = qs('button[aria-controls="mobile-nav"]');
  var nav = qs("#mobile-nav");
  if (btn && nav) {
    function setOpen(open) {
      nav.style.display = open ? "block" : "none";
      nav.style.position = "fixed";
      nav.style.left = "0";
      nav.style.right = "0";
      nav.style.top = "64px";
      nav.style.bottom = "0";
      nav.style.zIndex = "70";
      nav.style.background = "#fafaf8";
      nav.style.overflowY = "auto";
      nav.classList.toggle("invisible", !open);
      nav.classList.toggle("opacity-0", !open);
      nav.classList.toggle("pointer-events-none", !open);
      document.body.style.overflow = open ? "hidden" : "";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Zatvori izbornik" : "Otvori izbornik");
    }
    btn.addEventListener("click", function () {
      var closed = nav.style.display === "none" || !nav.style.display || nav.classList.contains("invisible");
      setOpen(closed);
    });
    qsa("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
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

  qsa(".js-lightbox").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var img = btn.querySelector("img");
      var cap = btn.querySelector("figcaption");
      if (!img) return;
      var overlay = document.createElement("div");
      overlay.setAttribute("style", "position:fixed;inset:0;z-index:80;background:rgba(17,17,17,.92);display:flex;flex-direction:column;padding:24px;");
      overlay.innerHTML =
        '<div style="display:flex;justify-content:space-between;color:#fff;font-size:11px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:12px">' +
        "<span>" + (cap ? cap.textContent : "") + "</span><button type='button' style='color:#fff'>Zatvori</button></div>" +
        '<img src="' + img.getAttribute("src") + '" alt="" style="max-width:100%;max-height:100%;object-fit:contain;margin:auto">';
      overlay.addEventListener("click", function () { overlay.remove(); document.body.style.overflow = ""; });
      document.body.style.overflow = "hidden";
      document.body.appendChild(overlay);
    });
  });

  var form = qs("form");
  if (form && qs("#ime", form)) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      data.set("_subject", "Novi upit — DESCO");
      data.set("_template", "table");
      data.set("_captcha", "false");
      var btn = qs("button[type='submit']", form);
      if (btn) { btn.disabled = true; btn.textContent = "Šaljem…"; }
      fetch("https://formsubmit.co/ajax/alex.kksrdoci@gmail.com", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      }).then(function (r) {
        if (!r.ok) throw new Error("fail");
        form.innerHTML =
          '<div class="border border-line bg-canvas px-8 py-14 text-center">' +
          '<p class="text-[11px] tracking-[0.28em] text-mute uppercase">Upit zaprimljen</p>' +
          '<h2 class="mt-4 text-2xl font-medium tracking-[0.06em] uppercase">Hvala na poruci.</h2>' +
          '<p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">Vaš upit je poslan. Javit ćemo se čim pregledamo podloge i zahtjev.</p>' +
          "</div>";
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = "Pošalji upit"; }
        alert("Slanje nije uspjelo. Pišite na alex.kksrdoci@gmail.com");
      });
    });
  }
})();
