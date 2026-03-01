// assets/js/app.js
import { BRAND, REGIONS, PACKAGES, GUIDES } from "./data.js";

/* ========== Helpers ========== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  $$('a[data-nav]').forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === path);
  });
}

function formatSAR(n) {
  return new Intl.NumberFormat("ar-SA").format(n) + " ر.س";
}

function getQueryParam(key) {
  const url = new URL(location.href);
  return url.searchParams.get(key);
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 250);
  }, 2200);
}

/* ========== Global init (Header) ========== */
function initHeader() {
  const brandEls = $$(".brandName");
  brandEls.forEach((el) => (el.textContent = BRAND.name));

  const tag = $(".brandTagline");
  if (tag) tag.textContent = BRAND.tagline;

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  setActiveNav();

  const menuBtn = $("#menuBtn");
  const mobileNav = $("#mobileNav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => mobileNav.classList.toggle("open"));
  }
}

/* ========== Destinations (Map) ========== */
function initDestinations() {
  const list = $("#regionList");
  const cityList = $("#cityList");
  const regionTitle = $("#regionTitle");
  const regionHint = $("#regionHint");
  const packagesBox = $("#packagesBox"); // اختياري

  // إذا الصفحة مو صفحة وجهاتنا، طلع
  if (!list || !cityList || !regionTitle || !regionHint) return;

  // Render region chips
  list.innerHTML = REGIONS.map(
    (r) => `<button class="chip" type="button" data-region="${r.id}">${r.name}</button>`
  ).join("");

  function renderPackagesForCity(city) {
    if (!packagesBox) return;

    const pkgs = PACKAGES.filter((p) => p.city === city);

    if (!pkgs.length) {
      packagesBox.innerHTML = `<div class="empty muted">لا توجد باقات حالياً لهذه المدينة.</div>`;
      return;
    }

    packagesBox.innerHTML = pkgs
      .map(
        (p) => `
        <article class="pkgMini">
          <div class="pkgMiniTop">
            <h4>${p.title}</h4>
            <span class="badge">${p.level}</span>
          </div>
          <p class="muted">${p.city} • ${p.duration}</p>
          <p>${p.activity}</p>
          <ul class="bullets">
            ${(p.includes || []).map((x) => `<li>${x}</li>`).join("")}
          </ul>
          <div class="miniBottom">
            <div class="price">${formatSAR(p.price)}</div>
            <button class="btn small" type="button" data-book="${p.id}">حجز تجريبي</button>
          </div>
        </article>
      `
      )
      .join("");

    // bind book buttons
    $$(".btn.small[data-book]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pkg = PACKAGES.find((x) => x.id === btn.dataset.book);
        localStorage.setItem("demo_booking", JSON.stringify(pkg));
        toast("تم تجهيز الحجز التجريبي — انتقل للتواصل لإكماله");
        setTimeout(() => (location.href = "contact.html#booking"), 450);
      });
    });
  }

  function renderCities(regionId) {
    const region = REGIONS.find((r) => r.id === regionId);
    if (!region) return;

    regionTitle.textContent = region.name;
    regionHint.textContent = "اضغطي على مدينة لعرض الباقات.";

    cityList.innerHTML = region.cities
      .map((c) => {
        const count = PACKAGES.filter((p) => p.city === c).length;
        return `
          <button class="cityBtn" type="button" data-city="${c}">
            <span>${c}</span>
            <small>${count || 0} باقات</small>
          </button>
        `;
      })
      .join("");

    // packagesBox placeholder
    if (packagesBox) {
      packagesBox.innerHTML = `<div class="empty muted">اختاري مدينة لعرض الباقات هنا.</div>`;
    }

    // chip active
    $$(".chip").forEach((b) => b.classList.toggle("active", b.dataset.region === regionId));

    // hotspot active (على الصورة)
    $$(".hotspotBtn").forEach((s) => s.classList.remove("active"));
    const activeSpot = document.querySelector(`.hotspotBtn[data-region="${regionId}"]`);
    if (activeSpot) activeSpot.classList.add("active");
  }

  // ✅ chips click (مرة وحدة فقط)
  list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-region]");
    if (!btn) return;
    renderCities(btn.dataset.region);
  });

  // ✅ hotspots فوق الصورة (مرة وحدة فقط)
  $$(".hotspotBtn").forEach((btn) => {
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      renderCities(btn.dataset.region);
      $("#destPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ✅ city click => show packages
  cityList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-city]");
    if (!btn) return;
    renderPackagesForCity(btn.dataset.city);
  });

  // ✅ default
  renderCities("riyadh");
}
/* ========== Packages Page ========== */
function initPackages() {
  const grid = $("#packagesGrid");
  const cityFilter = $("#cityFilter");
  const levelFilter = $("#levelFilter");
  const searchInput = $("#searchInput");
  const countEl = $("#pkgCount");

  if (!grid) return;

  const cities = [...new Set(PACKAGES.map((p) => p.city))].sort((a, b) =>
    a.localeCompare(b, "ar")
  );

  if (cityFilter) {
    cityFilter.innerHTML = `
      <option value="">كل المدن</option>
      ${cities.map((c) => `<option value="${c}">${c}</option>`).join("")}
    `;
  }

  const cityFromUrl = getQueryParam("city");
  if (cityFromUrl && cityFilter) cityFilter.value = cityFromUrl;

  function render() {
    const cityVal = cityFilter?.value || "";
    const levelVal = levelFilter?.value || "";
    const q = (searchInput?.value || "").trim();

    const filtered = PACKAGES.filter((p) => {
      const okCity = !cityVal || p.city === cityVal;
      const okLevel = !levelVal || p.level === levelVal;
      const okSearch = !q || (p.title + " " + p.activity + " " + p.city).includes(q);
      return okCity && okLevel && okSearch;
    });

    if (countEl) countEl.textContent = `عدد الباقات: ${filtered.length}`;

    grid.innerHTML = filtered
      .map(
        (p) => `
      <article class="card pkgCard">
        <div class="cardTop">
          <h3>${p.title}</h3>
          <span class="badge">${p.level}</span>
        </div>
        <p class="muted">${p.city} • ${p.duration}</p>
        <p>${p.activity}</p>
        <ul class="bullets">
          ${(p.includes || []).map((x) => `<li>${x}</li>`).join("")}
        </ul>
        <div class="cardBottom">
          <div class="price">${formatSAR(p.price)}</div>
          <button class="btn" data-book="${p.id}">حجز تجريبي</button>
        </div>
      </article>
    `
      )
      .join("");

    $$(".btn[data-book]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pkg = PACKAGES.find((x) => x.id === btn.dataset.book);
        localStorage.setItem("demo_booking", JSON.stringify(pkg));
        toast("تم تجهيز الحجز التجريبي — انتقل للتواصل لإكماله");
        setTimeout(() => (location.href = "contact.html#booking"), 450);
      });
    });
  }

  [cityFilter, levelFilter, searchInput].forEach((el) => el?.addEventListener("input", render));
  render();
}

/* ========== Guides Page ========== */
function initGuides() {
  const grid = $("#guidesGrid");
  if (!grid) return;

  grid.innerHTML = GUIDES.map(
    (g) => `
    <article class="card guideCard">
      <div class="guideHeader">
        <div class="avatar" aria-hidden="true">${g.name.trim().slice(0, 1)}</div>
        <div>
          <h3>${g.name}</h3>
          <p class="muted">${g.role}</p>
        </div>
      </div>

      <h4>أبرز الخبرات</h4>
      <ul class="bullets">${(g.highlights || []).map((x) => `<li>${x}</li>`).join("")}</ul>

      <h4>شهادات ودورات</h4>
      <ul class="bullets">${(g.certs || []).map((x) => `<li>${x}</li>`).join("")}</ul>

      <div class="metaRow">
        <span class="pill">اللغات: ${(g.languages || []).join("، ")}</span>
      </div>
    </article>
  `
  ).join("");
}

/* ========== Contact / Auth / Booking Page ========== */
function initContact() {
  const signupForm = $("#signupForm");
  const bookingForm = $("#bookingForm");
  const demoBox = $("#demoBookingBox");

  if (demoBox) {
    const demo = localStorage.getItem("demo_booking");
    if (demo) {
      const pkg = JSON.parse(demo);
      demoBox.innerHTML = `
        <div class="notice">
          <strong>حجز تجريبي مُجهّز:</strong>
          <div class="noticeGrid">
            <div><span class="muted">الباقة</span><div>${pkg.title}</div></div>
            <div><span class="muted">المدينة</span><div>${pkg.city}</div></div>
            <div><span class="muted">السعر</span><div>${formatSAR(pkg.price)}</div></div>
          </div>
          <small class="muted">يمكنك تعديل التفاصيل قبل الإرسال.</small>
        </div>
      `;
      $("#bkPackage") && ($("#bkPackage").value = pkg.title);
      $("#bkCity") && ($("#bkCity").value = pkg.city);
    } else {
      demoBox.innerHTML = `<p class="muted">اختاري باقة من صفحة “الباقات” ليظهر الحجز التجريبي هنا تلقائياً.</p>`;
    }
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#suName").value.trim();
      const email = $("#suEmail").value.trim();
      const pass = $("#suPass").value;

      if (!name || !email || pass.length < 6) {
        toast("تأكد من الاسم/الإيميل، وكلمة المرور 6 أحرف على الأقل.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("demo_users") || "[]");
      if (users.some((u) => u.email === email)) {
        toast("هذا الإيميل مسجل مسبقاً (تجريبي).");
        return;
      }
      users.push({ name, email, pass, createdAt: new Date().toISOString() });
      localStorage.setItem("demo_users", JSON.stringify(users));
      localStorage.setItem("demo_current_user", JSON.stringify({ name, email }));
      toast("تم إنشاء الحساب (تجريبي) ✅");
      $("#currentUser") && ($("#currentUser").textContent = `مرحباً، ${name}`);
      signupForm.reset();
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem("demo_current_user") || "null");
      if (!user) {
        toast("أنشئي حساباً تجريبياً أولاً ثم احجزي.");
        return;
      }

      const booking = {
        user,
        package: $("#bkPackage").value.trim(),
        city: $("#bkCity").value.trim(),
        date: $("#bkDate").value,
        people: $("#bkPeople").value,
        notes: $("#bkNotes").value.trim(),
        createdAt: new Date().toISOString(),
      };

      const all = JSON.parse(localStorage.getItem("demo_bookings") || "[]");
      all.push(booking);
      localStorage.setItem("demo_bookings", JSON.stringify(all));
      toast("تم إرسال الحجز التجريبي ✅");
      bookingForm.reset();
      localStorage.removeItem("demo_booking");
      demoBox && (demoBox.innerHTML = `<p class="muted">تم إرسال الحجز التجريبي. يمكنك اختيار باقة أخرى.</p>`);
    });
  }

  const user = JSON.parse(localStorage.getItem("demo_current_user") || "null");
  const current = $("#currentUser");
  if (current) current.textContent = user ? `مرحباً، ${user.name}` : "لم يتم تسجيل حساب تجريبي بعد.";
}

/* ========== Run ========== */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initDestinations();
  initPackages();
  initGuides();
  initContact();
})