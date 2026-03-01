// assets/js/app.js
import { BRAND, REGIONS, PACKAGES, GUIDES } from "./data.js";

/* ========== Helpers ========== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  $$('a[data-nav]').forEach(a => {
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
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 250); }, 2200);
}

/* ========== Global init ========== */
function initHeader() {
  const brandEls = $$(".brandName");
  brandEls.forEach(el => (el.textContent = BRAND.name));
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

  if (!list || !cityList) return;

  // Render region buttons
  list.innerHTML = REGIONS.map(r => `
    <button class="chip" data-region="${r.id}">
      ${r.name}
    </button>
  `).join("");

  function renderCities(regionId) {
    const region = REGIONS.find(r => r.id === regionId);
    if (!region) return;

    regionTitle.textContent = region.name;
    regionHint.textContent = "اضغطي على مدينة لعرض الباقات المرتبطة بها.";
    cityList.innerHTML = region.cities.map(c => `
      <button class="cityBtn" data-city="${c}">
        <span>${c}</span>
        <small>${PACKAGES.filter(p => p.city === c).length || "0"} باقات</small>
      </button>
    `).join("");

    // highlight svg region
    $$(".ksa-region").forEach(el => el.classList.remove("selected"));
    const svgTarget = $(`.ksa-region[data-region="${regionId}"]`);
    if (svgTarget) svgTarget.classList.add("selected");
  }

  // Chips click
  list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-region]");
    if (!btn) return;
    renderCities(btn.dataset.region);
  });

  // SVG click
  $$(".ksa-region").forEach(path => {
    path.addEventListener("click", () => {
      renderCities(path.dataset.region);
      // scroll to panel on mobile
      $("#destPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // City click => go to packages filtered
  cityList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-city]");
    if (!btn) return;
    const city = btn.dataset.city;
    location.href = `packages.html?city=${encodeURIComponent(city)}`;
  });

  // default pick
  renderCities("riyadh");
}

/* ========== Packages ========== */
function initPackages() {
  const grid = $("#packagesGrid");
  const cityFilter = $("#cityFilter");
  const levelFilter = $("#levelFilter");
  const searchInput = $("#searchInput");
  const countEl = $("#pkgCount");

  if (!grid) return;

  const cities = [...new Set(PACKAGES.map(p => p.city))].sort((a,b)=>a.localeCompare(b,"ar"));
  if (cityFilter) {
    cityFilter.innerHTML = `
      <option value="">كل المدن</option>
      ${cities.map(c => `<option value="${c}">${c}</option>`).join("")}
    `;
  }

  const cityFromUrl = getQueryParam("city");
  if (cityFromUrl && cityFilter) cityFilter.value = cityFromUrl;

  function render() {
    const cityVal = cityFilter?.value || "";
    const levelVal = levelFilter?.value || "";
    const q = (searchInput?.value || "").trim();

    const filtered = PACKAGES.filter(p => {
      const okCity = !cityVal || p.city === cityVal;
      const okLevel = !levelVal || p.level === levelVal;
      const okSearch = !q || (p.title + " " + p.activity + " " + p.city).includes(q);
      return okCity && okLevel && okSearch;
    });

    if (countEl) countEl.textContent = `عدد الباقات: ${filtered.length}`;

    grid.innerHTML = filtered.map(p => `
      <article class="card pkgCard">
        <div class="cardTop">
          <h3>${p.title}</h3>
          <span class="badge">${p.level}</span>
        </div>
        <p class="muted">${p.city} • ${p.duration}</p>
        <p>${p.activity}</p>
        <ul class="bullets">
          ${p.includes.map(x => `<li>${x}</li>`).join("")}
        </ul>
        <div class="cardBottom">
          <div class="price">${formatSAR(p.price)}</div>
          <button class="btn" data-book="${p.id}">حجز تجريبي</button>
        </div>
      </article>
    `).join("");

    // bind book buttons
    $$(".btn[data-book]").forEach(btn => {
      btn.addEventListener("click", () => {
        const pkg = PACKAGES.find(x => x.id === btn.dataset.book);
        localStorage.setItem("demo_booking", JSON.stringify(pkg));
        toast("تم تجهيز الحجز التجريبي — انتقل للتواصل لإكماله");
        setTimeout(() => (location.href = "contact.html#booking"), 450);
      });
    });
  }

  [cityFilter, levelFilter, searchInput].forEach(el => el?.addEventListener("input", render));
  render();
}

/* ========== Guides ========== */
function initGuides() {
  const grid = $("#guidesGrid");
  if (!grid) return;

  grid.innerHTML = GUIDES.map(g => `
    <article class="card guideCard">
      <div class="guideHeader">
        <div class="avatar" aria-hidden="true">${g.name.trim().slice(0,1)}</div>
        <div>
          <h3>${g.name}</h3>
          <p class="muted">${g.role}</p>
        </div>
      </div>

      <h4>أبرز الخبرات</h4>
      <ul class="bullets">${g.highlights.map(x=>`<li>${x}</li>`).join("")}</ul>

      <h4>شهادات ودورات</h4>
      <ul class="bullets">${g.certs.map(x=>`<li>${x}</li>`).join("")}</ul>

      <div class="metaRow">
        <span class="pill">اللغات: ${g.languages.join("، ")}</span>
      </div>
    </article>
  `).join("");
}

/* ========== Contact / Auth / Booking ========== */
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
      // prefill booking
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

      // demo storage
      const users = JSON.parse(localStorage.getItem("demo_users") || "[]");
      if (users.some(u => u.email === email)) {
        toast("هذا الإيميل مسجل مسبقاً (تجريبي).");
        return;
      }
      users.push({ name, email, pass, createdAt: new Date().toISOString() });
      localStorage.setItem("demo_users", JSON.stringify(users));
      localStorage.setItem("demo_current_user", JSON.stringify({ name, email }));
      toast("تم إنشاء الحساب (تجريبي) ✅");
      $("#currentUser").textContent = `مرحباً، ${name}`;
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
        createdAt: new Date().toISOString()
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

  // show current user if exists
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
});
// يفترض أن REGIONS موجودة في data.js
window.selectRegion = function(key){
  const region = (window.REGIONS || []).find(r => r.key === key);
  const titleEl = document.getElementById("regionTitle");
  const listEl  = document.getElementById("cityList");

  if (!region || !titleEl || !listEl) return;

  titleEl.textContent = region.name;
  listEl.innerHTML = region.cities.map(c => `
    <button class="cityBtn" data-city="${c}">
      <span>${c}</span>
      <small>عرض الباقات</small>
    </button>
  `).join("");
};