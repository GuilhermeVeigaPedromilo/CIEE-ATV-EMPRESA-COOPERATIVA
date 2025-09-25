// src/js/productsCarousel.js
export function initCarousel(products) {
  const track = document.getElementById("productCarousel");

  // === Gerar cards ===
  products.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-slide";
    card.style.cursor = "pointer";
    
    // Criar estrutura do card melhorada
    card.innerHTML = `
      <div class="slide-image" style="background-image:url('${prod.image}')">
        ${prod.discount ? `<div class="discount-badge">-${prod.discount}%</div>` : ''}
        ${!prod.inStock ? '<div class="stock-badge out-of-stock">Indisponível</div>' : '<div class="stock-badge in-stock">Em estoque</div>'}
      </div>
      <div class="slide-content">
        <div class="product-category">${prod.category}</div>
        <h3>${prod.name}</h3>
        <p>${prod.description}</p>
        <div class="price-container">
          ${prod.originalPrice ? `<span class="original-price">${prod.originalPrice}</span>` : ''}
          <span class="slide-price">${prod.price}</span>
        </div>
        <div class="product-features">
          ${prod.features.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
        </div>
        <button class="view-details-btn ${!prod.inStock ? 'disabled' : ''}" ${!prod.inStock ? 'disabled' : ''}>
          ${prod.inStock ? 'Ver Detalhes' : 'Produto Indisponível'}
        </button>
      </div>`;
    
    // Adicionar evento de clique no card
    card.addEventListener('click', (e) => {
      // Evitar duplo clique se clicar no botão
      if (e.target.classList.contains('view-details-btn')) return;
      
      if (prod.inStock) {
        // Navegar na mesma guia usando parâmetros de URL
        window.location.href = `produto.html?id=${prod.id}`;
      }
    });
    
    // Evento específico do botão
    const viewBtn = card.querySelector('.view-details-btn');
    if (viewBtn && prod.inStock) {
      viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `produto.html?id=${prod.id}`;
      });
    }
    
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