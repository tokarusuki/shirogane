/* =========================================================
   Kaoru Shirogane — Official Site
   Shared behaviour. The site works fully without this file;
   it only layers on convenience and polish.
   ========================================================= */
(function () {
  "use strict";

  /* ---- Current-page nav highlighting ------------------- */
  function highlightNav() {
    var current = document.body.getAttribute("data-page");
    if (!current) return;
    document.querySelectorAll(".nav-links a[data-page]").forEach(function (link) {
      if (link.getAttribute("data-page") === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---- Mobile menu toggle -------------------------------- */
  function setupMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Scroll-reveal -------------------------------------- */
  function setupFadeIn() {
    var items = document.querySelectorAll(".fade-in");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Audio demo players --------------------------------- */
  function formatTime(seconds) {
    if (!isFinite(seconds)) return "0:00";
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function setupPlayers() {
    document.querySelectorAll(".player").forEach(function (player) {
      var src = player.getAttribute("data-src");
      var audio = new Audio(src);
      var btn = player.querySelector(".player-btn");
      var bar = player.querySelector(".player-bar");
      var fill = player.querySelector(".player-bar-fill");
      var time = player.querySelector(".player-time");
      var playing = false;

      btn.addEventListener("click", function () {
        // Pause any other playing track so demos don't overlap.
        document.querySelectorAll("audio").forEach(function (a) {
          if (a !== audio) a.pause();
        });
        document.querySelectorAll(".player-btn").forEach(function (b) {
          if (b !== btn) b.textContent = "▶";
        });

        if (playing) {
          audio.pause();
        } else {
          audio.play().catch(function () {
            time.textContent = "Demo audio not available yet";
          });
        }
      });

      audio.addEventListener("play", function () { playing = true; btn.textContent = "❚❚"; });
      audio.addEventListener("pause", function () { playing = false; btn.textContent = "▶"; });
      audio.addEventListener("ended", function () { playing = false; btn.textContent = "▶"; fill.style.width = "0%"; });

      audio.addEventListener("timeupdate", function () {
        if (!audio.duration) return;
        var pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = pct + "%";
        time.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
      });

      audio.addEventListener("loadedmetadata", function () {
        time.textContent = "0:00 / " + formatTime(audio.duration);
      });

      audio.addEventListener("error", function () {
        time.textContent = "Demo audio not available yet";
        btn.setAttribute("disabled", "true");
      });

      bar.addEventListener("click", function (e) {
        if (!audio.duration) return;
        var rect = bar.getBoundingClientRect();
        var ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * audio.duration;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    highlightNav();
    setupMobileNav();
    setupFadeIn();
    setupPlayers();
  });
})();
