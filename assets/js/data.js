// assets/js/data.js
export const BRAND = {
  name: "آفاق السفر",
  tagline: "تجربة سياحية سعودية بمعايير أكاديمية وخدمة احترافية."
};

// المناطق والمدن
export const REGIONS = [
  {
    id: "makkah",
    name: "منطقة مكة",
    cities: ["مكة المكرمة", "جدة", "الطائف"]
  },
  {
    id: "riyadh",
    name: "منطقة الرياض",
    cities: ["الرياض", "الدرعية", "وادي الدواسر"]
  },
  {
    id: "asir",
    name: "منطقة عسير",
    cities: ["أبها", "خميس مشيط", "رجال ألمع"]
  },
  {
    id: "eastern",
    name: "المنطقة الشرقية",
    cities: ["الدمام", "الخبر", "الأحساء"]
  }
];

// باقات (أسعار متفاوتة)
export const PACKAGES = [
  // مكة
  {
    id: "pkg-makkah-1",
    city: "مكة المكرمة",
    title: "مكة الروحانية (نصف يوم)",
    activity: "زيارة معالم تاريخية + تجربة ثقافية",
    price: 199,
    duration: "4 ساعات",
    level: "اقتصادية",
    includes: ["مرشد سياحي", "تنقلات داخلية", "مياه وهدايا بسيطة"]
  },
  {
    id: "pkg-makkah-2",
    city: "مكة المكرمة",
    title: "مكة الكاملة (يوم كامل)",
    activity: "معالم + متاحف + تجربة طعام",
    price: 499,
    duration: "8 ساعات",
    level: "متوسطة",
    includes: ["مرشد معتمد", "تنقلات", "تذاكر موقع واحد", "تصوير تذكاري"]
  },
  // جدة
  {
    id: "pkg-jeddah-1",
    city: "جدة",
    title: "جدة التاريخية (البلد) — اقتصادي",
    activity: "جولة البلدة القديمة + أسواق",
    price: 179,
    duration: "3.5 ساعات",
    level: "اقتصادية",
    includes: ["مرشد", "خريطة رقمية", "نقاط تصوير مقترحة"]
  },
  {
    id: "pkg-jeddah-2",
    city: "جدة",
    title: "واجهة جدة البحرية — بريميوم",
    activity: "البحر + فعاليات + تجربة مطعم",
    price: 799,
    duration: "6 ساعات",
    level: "فاخرة",
    includes: ["سيارة خاصة", "مرشد", "حجز فعالية واحدة", "توصيات مطاعم"]
  },
  // الطائف
  {
    id: "pkg-taif-1",
    city: "الطائف",
    title: "الطائف والورد (نصف يوم)",
    activity: "مزارع ورد + إطلالات",
    price: 249,
    duration: "4.5 ساعات",
    level: "اقتصادية",
    includes: ["مرشد", "تنقلات قصيرة", "هدايا وردية"]
  },

  // الرياض
  {
    id: "pkg-riyadh-1",
    city: "الرياض",
    title: "رياض كلاسيك (يوم واحد)",
    activity: "الدرعية + بوليفارد + كافيهات",
    price: 399,
    duration: "7 ساعات",
    level: "متوسطة",
    includes: ["مرشد", "تنقل داخل المدينة", "تذكرة فعالية واحدة"]
  },
  {
    id: "pkg-riyadh-2",
    city: "الرياض",
    title: "رياض VIP (يوم كامل)",
    activity: "جلسات خاصة + تصوير + فعالية مميزة",
    price: 1199,
    duration: "8 ساعات",
    level: "فاخرة",
    includes: ["سيارة خاصة", "مرشد", "تصوير احترافي", "تنظيم حجوزات"]
  },
  // الدرعية
  {
    id: "pkg-diriyah-1",
    city: "الدرعية",
    title: "الدرعية التراثية (اقتصادي)",
    activity: "طريف + سرد تاريخي + نقاط تصوير",
    price: 220,
    duration: "4 ساعات",
    level: "اقتصادية",
    includes: ["مرشد", "معلومات تاريخية موثقة", "خطة جولة"]
  },

  // عسير
  {
    id: "pkg-abha-1",
    city: "أبها",
    title: "أبها السحاب (يوم)",
    activity: "إطلالات + قرى تراثية",
    price: 459,
    duration: "8 ساعات",
    level: "متوسطة",
    includes: ["مرشد", "تنقلات", "محطات تصوير", "توصيات محلية"]
  },
  {
    id: "pkg-rijal-1",
    city: "رجال ألمع",
    title: "رجال ألمع (نصف يوم)",
    activity: "قرية تراثية + متحف",
    price: 289,
    duration: "5 ساعات",
    level: "اقتصادية",
    includes: ["مرشد", "إرشاد ثقافي", "تنظيم وقت الزيارة"]
  },

  // الشرقية
  {
    id: "pkg-khobar-1",
    city: "الخبر",
    title: "كورنيش الخبر (اقتصادي)",
    activity: "كورنيش + تجربة قهوة + جلسة تصوير",
    price: 199,
    duration: "4 ساعات",
    level: "اقتصادية",
    includes: ["مرشد", "توصيات مقاهي", "أماكن تصوير"]
  },
  {
    id: "pkg-ahsa-1",
    city: "الأحساء",
    title: "الأحساء الواحة (يوم)",
    activity: "واحة + معالم + سوق شعبي",
    price: 549,
    duration: "8 ساعات",
    level: "متوسطة",
    includes: ["مرشد", "تنقلات", "محطات رئيسية", "اقتراحات طعام"]
  }
];

// المرشدات
export const GUIDES = [
  {
    name: "لينا خالد",
    role: "مرشدة سياحية — تصميم تجارب حضرية",
    highlights: [
      "تخطيط مسارات داخل المدن وفق الزمن والازدحام",
      "إدارة جولات المجموعات الصغيرة بأسلوب احترافي"
    ],
    certs: [
      "دورة أساسيات الإرشاد السياحي",
      "دورة خدمة العملاء في القطاع السياحي",
      "دورة إسعافات أولية (مستوى أساسي)"
    ],
    languages: ["العربية", "الإنجليزية"]
  },
  {
    name: "تالا خالد",
    role: "مرشدة سياحية — محتوى ثقافي وتراثي",
    highlights: [
      "سرد قصصي للتراث والمعالم بطريقة جذابة",
      "خبرة في تنظيم جولات البلد والقرى التراثية"
    ],
    certs: [
      "دورة تفسير التراث الثقافي",
      "دورة إدارة الفعاليات السياحية",
      "ورشة تصوير سياحي للمبتدئين"
    ],
    languages: ["العربية", "الإنجليزية"]
  },
  {
    name: "رغد عبدالله",
    role: "مرشدة سياحية — جودة التجربة وحجوزات",
    highlights: [
      "تنسيق حجوزات وتجارب حسب الميزانية",
      "تحسين تجربة العميل عبر خطط واضحة ومتابعة"
    ],
    certs: [
      "دورة إدارة تجربة العميل",
      "دورة السلامة في الرحلات الداخلية",
      "دورة مهارات التواصل المهني"
    ],
    languages: ["العربية"]
  }
];
function initKsaMap() {
  const map = document.getElementById("ksaMap");
  if (!map) return;

  const spots = map.querySelectorAll(".hotspot");

  spots.forEach((spot) => {
    spot.addEventListener("click", () => {
      const key = spot.dataset.region;

      // تفعيل شكل النقطة المختارة
      spots.forEach(s => s.classList.remove("active"));
      spot.classList.add("active");

      // هذا يستدعي نفس منطقك الحالي لعرض المدن
      // إذا عندك دالة اسمها setRegion أو renderCities استبدليها هنا
      if (typeof selectRegion === "function") {
        selectRegion(key);
      } else if (typeof window.selectRegion === "function") {
        window.selectRegion(key);
      } else {
        // fallback بسيط: نرسل حدث
        document.dispatchEvent(new CustomEvent("region:selected", { detail: { key } }));
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initKsaMap);