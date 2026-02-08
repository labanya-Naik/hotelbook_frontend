/* ===========================================
   ✅ ONE SCRIPT FILE FOR ALL PAGES
   - Home Page: Banner Slider + Search + Popup Modal
   - Booking Page: Form Validation + Save Booking to MongoDB
=========================================== */

/* ============================
   ✅ FULL HERO BANNER SLIDER (HOME)
============================ */
const heroSlides = document.querySelectorAll(".hero-slide");
const prevHero = document.getElementById("prevHero");
const nextHero = document.getElementById("nextHero");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");

const emailError = document.getElementById("emailError");
const mobileError = document.getElementById("mobileError");


let heroIndex = 0;

function showHeroSlide(index) {
  heroSlides.forEach((slide) => slide.classList.remove("active"));
  heroSlides[index].classList.add("active");
}

if (heroSlides.length > 0) {
  showHeroSlide(heroIndex);

  // Next
  if (nextHero) {
    nextHero.addEventListener("click", () => {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      showHeroSlide(heroIndex);
    });
  }

  // Prev
  if (prevHero) {
    prevHero.addEventListener("click", () => {
      heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
      showHeroSlide(heroIndex);
    });
  }

  // Auto Slide
  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
  }, 3500);
}

/* ============================
   ✅ HOTEL SEARCH (HOME)
============================ */
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const noResult = document.getElementById("noResult");

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", () => {
    const value = searchInput.value.toLowerCase().trim();
    const hotels = document.querySelectorAll(".hotel-card");

    let found = false;

    hotels.forEach((hotel) => {
      const hotelName = hotel.getAttribute("data-name").toLowerCase();

      if (hotelName.includes(value) || value === "") {
        hotel.style.display = "block";
        found = true;
      } else {
        hotel.style.display = "none";
      }
    });

    if (noResult) {
      noResult.textContent = found ? "" : "❌ No hotels found!";
    }
  });
}

/* ============================
   ✅ HOTEL DETAILS POPUP MODAL (HOME)
============================ */
const modal = document.getElementById("hotelModal");
const closeModal = document.getElementById("closeModal");

const modalTitle = document.getElementById("modalTitle");
const modalRating = document.getElementById("modalRating");
const modalLocation = document.getElementById("modalLocation");
const modalPrice = document.getElementById("modalPrice");
const modalAbout = document.getElementById("modalAbout");
const modalFacilities = document.getElementById("modalFacilities");

const detailsButtons = document.querySelectorAll(".details-btn");

if (detailsButtons.length > 0 && modal) {
  detailsButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (modalTitle) modalTitle.textContent = btn.dataset.hotel || "";
      if (modalRating) modalRating.textContent = btn.dataset.rating || "";
      if (modalLocation) modalLocation.textContent = btn.dataset.location || "";
      if (modalPrice) modalPrice.textContent = btn.dataset.price || "";
      if (modalAbout) modalAbout.textContent = btn.dataset.about || "";
      if (modalFacilities) modalFacilities.textContent = btn.dataset.facilities || "";

      modal.style.display = "flex";
    });
  });
}

// ✅ Close modal on X click
if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// ✅ Close modal if click outside modal
window.addEventListener("click", (e) => {
  if (modal && e.target === modal) {
    modal.style.display = "none";
  }
});

/* ============================
   ✅ BOOKING FORM (VALIDATION + MONGODB SAVE)
============================ */
const form = document.getElementById("hotelForm");

if (form) {
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const hotelName = document.getElementById("hotelName");
  const roomType = document.getElementById("roomType");

  const adults = document.getElementById("adults");
  const children = document.getElementById("children");
  const requests = document.getElementById("requests");

  
  const checkinError = document.getElementById("checkinError");
  const checkoutError = document.getElementById("checkoutError");
  const hotelError = document.getElementById("hotelError");
  const roomError = document.getElementById("roomError");
  const guestError = document.getElementById("guestError");

  const successMsg = document.getElementById("successMsg");

  // ✅ Restrict past dates
  const today = new Date().toISOString().split("T")[0];
  if (checkin) checkin.min = today;
  if (checkout) checkout.min = today;

  // ✅ When check-in changes, set checkout min date
  if (checkin && checkout) {
    checkin.addEventListener("change", () => {
      checkout.value = "";
      checkout.min = checkin.value;
    });
  }

  function clearErrors() {
  if (checkinError) checkinError.textContent = "";
  if (checkoutError) checkoutError.textContent = "";
  if (hotelError) hotelError.textContent = "";
  if (roomError) roomError.textContent = "";
  if (guestError) guestError.textContent = "";
  if (emailError) emailError.textContent = "";
  if (mobileError) mobileError.textContent = "";
  if (successMsg) successMsg.textContent = "";
}


  function isCheckoutValid(checkinDate, checkoutDate) {
    return new Date(checkoutDate) > new Date(checkinDate);
  }

  form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  let valid = true;

  /* =====================
     DATE VALIDATION
  ====================== */
  if (!checkin.value) {
    checkinError.textContent = "Please select check-in date.";
    valid = false;
  }

  if (!checkout.value) {
    checkoutError.textContent = "Please select check-out date.";
    valid = false;
  } else if (
    checkin.value &&
    new Date(checkout.value) <= new Date(checkin.value)
  ) {
    checkoutError.textContent = "Check-out must be after check-in date.";
    valid = false;
  }

  /* =====================
     HOTEL & ROOM
  ====================== */
  if (!hotelName.value) {
    hotelError.textContent = "Please select a hotel.";
    valid = false;
  }

  if (!roomType.value) {
    roomError.textContent = "Please select a room type.";
    valid = false;
  }

  /* =====================
     EMAIL VALIDATION
  ====================== */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    emailError.textContent = "Email is required.";
    valid = false;
  } else if (!emailPattern.test(email.value)) {
    emailError.textContent = "Enter a valid email.";
    valid = false;
  }

  /* =====================
     MOBILE VALIDATION
  ====================== */
  const mobilePattern = /^[6-9]\d{9}$/;
  if (!mobile.value) {
    mobileError.textContent = "Mobile number is required.";
    valid = false;
  } else if (!mobilePattern.test(mobile.value)) {
    mobileError.textContent = "Enter valid 10-digit mobile number.";
    valid = false;
  }

  /* =====================
     GUEST VALIDATION
  ====================== */
  const a = parseInt(adults.value || "0", 10);
  const c = parseInt(children.value || "0", 10);
  const totalGuests = a + c;

  if (a < 1) {
    guestError.textContent = "At least 1 adult is required.";
    valid = false;
  } else if (totalGuests > 10) {
    guestError.textContent = "Maximum 10 guests allowed.";
    valid = false;
  }

  /* =====================
     STOP SUBMIT IF INVALID
  ====================== */
  if (!valid) {
    return; // ❌ DO NOT submit
  }

  /* =====================
     SUBMIT TO BACKEND
  ====================== */
  const bookingData = {
    hotelName: hotelName.value,
    roomType: roomType.value,
    checkin: checkin.value,
    checkout: checkout.value,
    adults: a,
    children: c,
    email: email.value,
    mobile: mobile.value,
    requests: requests.value,
  };

  try {
    const response = await fetch("http://localhost:5000/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (response.ok) {
      successMsg.style.color = "green";
      successMsg.textContent = "✅ Booking submitted successfully!";
      form.reset();
    } else {
      successMsg.style.color = "red";
      successMsg.textContent = data.message || "❌ Booking failed!";
    }
  } catch (error) {
    successMsg.style.color = "red";
    successMsg.textContent = "❌ Server error. Try again.";
  }
});
}
