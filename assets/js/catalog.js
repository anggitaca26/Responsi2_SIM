document.addEventListener("DOMContentLoaded", () => {
  const categoryLinks = document.querySelectorAll(".category-link");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // =========================
  // 1) GABUNG SECTION BROWNIES (kalau id="brownies" dobel)
  // =========================
  function mergeDuplicateBrowniesSections() {
    const browniesSections = Array.from(document.querySelectorAll("#brownies"));
    if (browniesSections.length <= 1) return;

    const first = browniesSections[0];
    const firstRow = first.querySelector(".row");
    if (!firstRow) return;

    // ambil semua section brownies sisanya, pindahkan semua card ke firstRow
    browniesSections.slice(1).forEach((sec) => {
      const row = sec.querySelector(".row");
      if (row) {
        Array.from(row.children).forEach((col) => firstRow.appendChild(col));
      }
      // sembunyikan section duplikat (jangan remove biar aman kalau ada layout lain)
      sec.style.display = "none";
      sec.setAttribute("data-merged-hidden", "true");
    });
  }

  mergeDuplicateBrowniesSections();

  // =========================
  // 2) AMBIL SECTION SETELAH DIGABUNG
  // =========================
  const secAllAnchor = document.querySelector("#all"); // kalau ada
  const secBirthday = document.querySelector("#birthday");
  const secBrownies = document.querySelector("#brownies"); // sekarang sudah tinggal 1 yang tampil
  const secCheesecake = document.querySelector("#cheesecake");

  const sectionsByCategory = {
    all: [secBirthday, secBrownies, secCheesecake].filter(Boolean),
    birthday: secBirthday ? [secBirthday] : [],
    brownies: secBrownies ? [secBrownies] : [],
    cheesecake: secCheesecake ? [secCheesecake] : [],
  };

  let activeCategory = "all"; // default: Semua Menu
  let activePrice = "all";

  function categoryKeyFromHref(href) {
    if (href === "#all") return "all";
    if (href === "#birthday") return "birthday";
    if (href === "#brownies") return "brownies";
    if (href === "#cheesecake") return "cheesecake";
    return "all";
  }

  function setActiveCategoryLink(href) {
    categoryLinks.forEach((l) => l.classList.remove("active"));
    const el = document.querySelector(`.category-link[href="${href}"]`);
    if (el) el.classList.add("active");
  }

  function setActivePriceButton(key) {
    filterBtns.forEach((b) => b.classList.remove("active"));
    const el = document.querySelector(`.filter-btn[data-filter="${key}"]`);
    if (el) el.classList.add("active");
  }

  function ensureEmptyMessage(sectionEl) {
    let msg = sectionEl.querySelector(".empty-message");
    if (!msg) {
      msg = document.createElement("div");
      msg.className = "empty-message alert alert-light border mt-3";
      msg.innerHTML =
        '<i class="fas fa-info-circle me-2 text-danger"></i>Tidak ada menu yang sesuai dengan filter harga.';
      const h2 = sectionEl.querySelector("h2");
      if (h2) h2.insertAdjacentElement("afterend", msg);
      else sectionEl.insertAdjacentElement("afterbegin", msg);
    }
    return msg;
  }

  function hideEmptyMessage(sectionEl) {
    const msg = sectionEl.querySelector(".empty-message");
    if (msg) msg.style.display = "none";
  }

  function hideAllSectionsAndItems() {
    // hide semua section yang dipakai sistem
    Object.values(sectionsByCategory).flat().forEach((sec) => {
      sec.style.display = "none";
      hideEmptyMessage(sec);
    });

    // hide semua item
    document.querySelectorAll("[data-price]").forEach((item) => {
      item.style.display = "none";
    });
  }

  function filterSectionItems(sectionEl) {
    const items = sectionEl.querySelectorAll("[data-price]");
    let visibleCount = 0;

    items.forEach((item) => {
      const p = item.getAttribute("data-price"); // low / medium
      const show = activePrice === "all" ? true : p === activePrice;
      item.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });

    return visibleCount;
  }

  function render() {
    hideAllSectionsAndItems();

    const activeSections = sectionsByCategory[activeCategory] || [];
    if (!activeSections.length) return;

    // tampilkan section kategori aktif
    activeSections.forEach((sec) => (sec.style.display = ""));

    // filter item dalam setiap section
    activeSections.forEach((sec) => {
      const visible = filterSectionItems(sec);
      const msg = ensureEmptyMessage(sec);
      msg.style.display = visible === 0 ? "" : "none";
    });

    // catatan: karena brownies sudah digabung, pesan kosong brownies juga otomatis 1 saja.
  }

  // Klik kategori
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");

      activeCategory = categoryKeyFromHref(href);
      setActiveCategoryLink(href);
      render();

      // scroll
      if (href === "#all") {
        // scroll ke anchor #all kalau ada, kalau tidak ke birthday
        const target = secAllAnchor || secBirthday || (sectionsByCategory.all || [])[0];
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        }
      } else {
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        }
      }
    });
  });

  // Klik filter harga
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      activePrice = btn.getAttribute("data-filter") || "all";
      setActivePriceButton(activePrice);
      render();
    });
  });

  // INIT
  setActiveCategoryLink("#all");
  setActivePriceButton("all");
  render();
});
