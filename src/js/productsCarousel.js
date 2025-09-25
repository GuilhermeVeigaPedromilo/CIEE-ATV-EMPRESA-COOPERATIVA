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

  // === Selecionar botões (desktop e mobile) ===
  const desktopPrevBtn = document.querySelector(".carousel-wrapper .carousel-btn.prev");
  const desktopNextBtn = document.querySelector(".carousel-wrapper .carousel-btn.next");
  const mobilePrevBtn = document.querySelector(".mobile-carousel-controls .carousel-btn.prev");
  const mobileNextBtn = document.querySelector(".mobile-carousel-controls .carousel-btn.next");
  const slides = document.querySelectorAll(".product-slide");

  // === Cálculos de movimento ===
  let index = 0;
  const isMobile = () => window.innerWidth <= 768;

  function calcVisibleSlides() {
    if (isMobile()) {
      return 1; // Mobile sempre 1 slide por vez para scroll lateral
    }
    const containerWidth = document.querySelector(".carousel-wrapper").offsetWidth - 200; // padding dos botões
    const slideWidth = slides[0].offsetWidth + parseFloat(getComputedStyle(track).gap || 0);
    return Math.floor(containerWidth / slideWidth);
  }

  // === Atualizar carrossel ===
  function updateCarousel() {
    if (isMobile()) {
      // Mobile: usar scroll smooth do browser
      const slideWidth = slides[0].offsetWidth + 16; // largura + gap
      track.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    } else {
      // Desktop: transform tradicional
      const slideWidth = slides[0].offsetWidth + 32;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    }
    checkButtons();
  }

  function checkButtons() {
    const visible = calcVisibleSlides();
    const maxIndex = Math.max(0, slides.length - visible);
    
    // Atualizar botões desktop
    if (desktopPrevBtn && desktopNextBtn) {
      desktopPrevBtn.disabled = index === 0;
      desktopNextBtn.disabled = index >= maxIndex;
      desktopPrevBtn.classList.toggle("disabled", desktopPrevBtn.disabled);
      desktopNextBtn.classList.toggle("disabled", desktopNextBtn.disabled);
    }
    
    // Atualizar botões mobile
    if (mobilePrevBtn && mobileNextBtn) {
      mobilePrevBtn.disabled = index === 0;
      mobileNextBtn.disabled = index >= maxIndex;
      mobilePrevBtn.classList.toggle("disabled", mobilePrevBtn.disabled);
      mobileNextBtn.classList.toggle("disabled", mobileNextBtn.disabled);
    }
  }

  // === Função para ir para o próximo ===
  function goNext() {
    const visible = calcVisibleSlides();
    const maxIndex = Math.max(0, slides.length - visible);
    
    if (index < maxIndex) {
      index++;
      updateCarousel();
    }
  }

  // === Função para ir para o anterior ===
  function goPrev() {
    if (index > 0) {
      index--;
      updateCarousel();
    }
  }

  // === Eventos dos botões desktop ===
  if (desktopNextBtn) {
    desktopNextBtn.addEventListener("click", goNext);
  }
  
  if (desktopPrevBtn) {
    desktopPrevBtn.addEventListener("click", goPrev);
  }

  // === Eventos dos botões mobile ===
  if (mobileNextBtn) {
    mobileNextBtn.addEventListener("click", goNext);
  }
  
  if (mobilePrevBtn) {
    mobilePrevBtn.addEventListener("click", goPrev);
  }

  // === Touch/Swipe para mobile ===
  let startX = 0;
  track.addEventListener("touchstart", e => startX = e.touches[0].clientX, { passive: true });
  track.addEventListener("touchend", e => {
    if (!isMobile()) return;
    
    let endX = e.changedTouches[0].clientX;
    let deltaX = startX - endX;
    
    // Mínimo de movimento para considerar swipe
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) { 
        goNext(); 
      } else { 
        goPrev(); 
      }
    }
  }, { passive: true });

  // === Resize handler ===
  window.addEventListener("resize", () => {
    // Reset para evitar problemas de layout
    index = 0;
    updateCarousel();
  });

  // === Inicialização ===
  updateCarousel();
}