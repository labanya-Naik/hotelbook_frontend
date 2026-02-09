
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://hotelbook-backend-zonm.onrender.com";

/* ============================
   ✅ HERO SLIDER (HOME)
============================ */
const heroSlides = document.querySelectorAll(".hero-slide");
const prevHero = document.getElementById("prevHero");
const nextHero = document.getElementById("nextHero");

let heroIndex = 0;

function showHeroSlide(index) {
  heroSlides.forEach(slide => slide.classList.remove("active"));
  heroSlides[index].classList.add("active");
}

if (heroSlides.length) {
  showHeroSlide(heroIndex);

  nextHero?.addEventListener("click", () => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
  });

  prevHero?.addEventListener("click", () => {
    heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
    showHeroSlide(heroIndex);
  });

  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
  }, 3500);
}

/* ============================
   🔍 HOTEL SEARCH (HOME)
============================ */
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const noResult = document.getElementById("noResult");

searchBtn?.addEventListener("click", () => {
  const value = searchInput.value.toLowerCase().trim();
  let found = false;

  document.querySelectorAll(".hotel-card").forEach(hotel => {
    const name = hotel.dataset.name.toLowerCase();
    hotel.style.display = name.includes(value) || !value ? "block" : "none";
    if (name.includes(value)) found = true;
  });

  if (noResult) {
    noResult.textContent = found ? "" : "❌ No hotels found!";
  }
});

/* ============================
   🪟 HOTEL DETAILS MODAL
============================ */
const modal = document.getElementById("hotelModal");
const closeModal = document.getElementById("closeModal");

document.querySelectorAll(".details-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    modal.querySelector("#modalTitle").textContent = btn.dataset.hotel;
    modal.querySelector("#modalRating").textContent = btn.dataset.rating;
    modal.querySelector("#modalLocation").textContent = btn.dataset.location;
    modal.querySelector("#modalPrice").textContent = btn.dataset.price;
    modal.querySelector("#modalAbout").textContent = btn.dataset.about;
    modal.querySelector("#modalFacilities").textContent = btn.dataset.facilities;
    modal.style.display = "flex";
  });
});

closeModal?.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

/* ============================
   📝 BOOKING FORM
============================ */
const form = document.getElementById("hotelForm");

if (form) {
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const hotelName = document.getElementById("hotelName");
  const roomType = document.getElementById("roomType");
  const adults = document.getElementById("adults");
  const children = document.getElementById("children");
  const email = document.getElementById("email");
  const mobile = document.getElementById("mobile");
  const requests = document.getElementById("requests");

  const checkinError = document.getElementById("checkinError");
  const checkoutError = document.getElementById("checkoutError");
  const hotelError = document.getElementById("hotelError");
  const roomError = document.getElementById("roomError");
  const guestError = document.getElementById("guestError");
  const emailError = document.getElementById("emailError");
  const mobileError = document.getElementById("mobileError");
  const successMsg = document.getElementById("successMsg");

  const today = new Date().toISOString().split("T")[0];
  checkin.min = checkout.min = today;

  checkin.addEventListener("change", () => {
    checkout.value = "";
    checkout.min = checkin.value;
  });

  function clearErrors() {
    [
      checkinError,
      checkoutError,
      hotelError,
      roomError,
      guestError,
      emailError,
      mobileError,
      successMsg,
    ].forEach(el => el && (el.textContent = ""));
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    clearErrors();

    let valid = true;

    if (!checkin.value) valid = checkinError.textContent = "Select check-in date.";
    if (!checkout.value || new Date(checkout.value) <= new Date(checkin.value))
      valid = checkoutError.textContent = "Invalid check-out date.";

    if (!hotelName.value) valid = hotelError.textContent = "Select hotel.";
    if (!roomType.value) valid = roomError.textContent = "Select room type.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
      valid = emailError.textContent = "Invalid email.";

    if (!/^[6-9]\d{9}$/.test(mobile.value))
      valid = mobileError.textContent = "Invalid mobile number.";

    const a = +adults.value;
    const c = +children.value;
    if (a < 1 || a + c > 10)
      valid = guestError.textContent = "Guests must be 1–10.";

    if (!valid) return;

    try {
      const res = await fetch(`${API_BASE}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelName: hotelName.value,
          roomType: roomType.value,
          checkin: checkin.value,
          checkout: checkout.value,
          adults: a,
          children: c,
          email: email.value,
          mobile: mobile.value,
          requests: requests.value,
        }),
      });

      const data = await res.json();

      successMsg.style.color = res.ok ? "green" : "red";
      successMsg.textContent = res.ok
        ? "✅ Booking submitted successfully!"
        : data.message || "❌ Booking failed!";
      if (res.ok) form.reset();
    } catch {
      successMsg.style.color = "red";
      successMsg.textContent = "❌ Server error. Try again.";
    }
  });
}
