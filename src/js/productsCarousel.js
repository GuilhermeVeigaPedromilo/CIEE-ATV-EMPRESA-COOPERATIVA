// src/js/productsCarousel.js
export function initCarousel(products) {
  const track = document.getElementById("productCarousel");

  // === Gerar cards ===
  products.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-slide";
    card.innerHTML = `
      <div class="slide-image" style="background-image:url('${prod.image}')"></div>
      <div class="slide-content">
        <h3>${prod.name}</h3>
        <p>${prod.description}</p>
        <span class="slide-price">${prod.price}</span>
      </div>`;
    track.appendChild(card);
  });

  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const slides = document.querySelectorAll(".product-slide");

  // === Cálculos de movimento ===
  let index = 0;                       // posição atual
  const visible = calcVisibleSlides();  // quantos cabem na tela

  function calcVisibleSlides() {
    const containerWidth = document.querySelector(".carousel-wrapper").offsetWidth;
    const slideWidth = slides[0].offsetWidth + parseFloat(getComputedStyle(track).gap || 0);
    return Math.floor(containerWidth / slideWidth);
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${index * (slides[0].offsetWidth + 32)}px)`;
    checkButtons();
  }

  function checkButtons() {
    // desativa quando não pode mais ir
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= slides.length - visible;
    prevBtn.classList.toggle("disabled", prevBtn.disabled);
    nextBtn.classList.toggle("disabled", nextBtn.disabled);
  }

  // === Eventos ===
  nextBtn.addEventListener("click", () => {
    if (index < slides.length - visible) {
      index++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateCarousel();
    }
  });

  // Swipe em mobile
  let startX = 0;
  track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  track.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50 && index < slides.length - visible) { index++; updateCarousel(); }
    if (endX - startX > 50 && index > 0) { index--; updateCarousel(); }
  });

  // Ajusta em resize
  window.addEventListener("resize", () => {
    index = 0;
    updateCarousel();
  });

  // inicial
  updateCarousel();
}