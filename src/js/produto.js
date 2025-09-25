// Importar dados dos produtos
import { products } from './src/js/productsData.js';

// Função para obter ID do produto da URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

// Função para encontrar produto pelo ID
function findProductById(id) {
    return products.find(product => product.id === id);
}

// Função para renderizar o produto
function renderProduct(product) {
    const breadcrumb = document.getElementById('breadcrumb-product');
    breadcrumb.textContent = product.name;

    const content = document.getElementById('product-content');

    const savings = product.originalPrice ?
        Math.round(((parseFloat(product.originalPrice.replace('R$ ', '').replace('.', '').replace(',', '.')) -
            parseFloat(product.price.replace('R$ ', '').replace('.', '').replace(',', '.'))) /
            parseFloat(product.originalPrice.replace('R$ ', '').replace('.', '').replace(',', '.'))) * 100) : 0;

    content.innerHTML = `
                <div class="product-detail">
                    <div class="product-header">
                        <div class="product-gallery">
                            <div class="main-image" style="background-image: url('${product.image}')">
                                <div class="status-badges">
                                    ${product.discount ? `<div class="badge discount-badge">-${product.discount}%</div>` : ''}
                                    <div class="badge stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                                        ${product.inStock ? 'Em estoque' : 'Indisponível'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="product-info">
                            <div class="category-tag">${product.category}</div>
                            <h1 class="product-title">${product.name}</h1>
                            <p class="product-description">${product.description}</p>
                            
                            <div class="price-section">
                                <div class="price-container">
                                    <span class="current-price">${product.price}</span>
                                    ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                                    ${savings > 0 ? `<span class="savings">Economize ${savings}%</span>` : ''}
                                </div>
                            </div>

                            <div class="features-section">
                                <h3 class="features-title">Principais características</h3>
                                <div class="features-grid">
                                    ${product.features.map(feature => `
                                        <div class="feature-item">
                                            <div class="feature-icon">✓</div>
                                            <div class="feature-text">${feature}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="action-buttons">
                                <button class="btn btn-primary" ${!product.inStock ? 'disabled' : ''} onclick="handlePurchase('${product.id}')">
                                    ${product.inStock ? '🛒 Solicitar Orçamento' : '❌ Produto Indisponível'}
                                </button>
                                <button class="btn btn-secondary" onclick="handleContact('${product.id}')">
                                    💬 Falar com Vendedor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="specifications">
                    <h2 class="spec-title">Especificações Técnicas</h2>
                    <div class="spec-grid">
                        <div class="spec-item">
                            <span class="spec-label">Dimensões:</span>
                            <span class="spec-value">${product.dimensions}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Material:</span>
                            <span class="spec-value">${product.material}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Garantia:</span>
                            <span class="spec-value">${product.warranty}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Categoria:</span>
                            <span class="spec-value">${product.category}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Disponibilidade:</span>
                            <span class="spec-value">${product.inStock ? 'Em estoque' : 'Sob encomenda'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Código:</span>
                            <span class="spec-value">ECO-${String(product.id).padStart(3, '0')}</span>
                        </div>
                    </div>
                </div>
            `;
}

// Função para renderizar erro
function renderError() {
    const content = document.getElementById('product-content');
    content.innerHTML = `
                <div class="error">
                    <h2>Produto não encontrado</h2>
                    <p>O produto que você está procurando não existe ou foi removido.</p>
                    <a href="./index.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">
                        Voltar ao catálogo
                    </a>
                </div>
            `;
}

// Funções de ação
window.handlePurchase = function (productId) {
    alert('Funcionalidade de orçamento será implementada em breve!\nEntre em contato conosco pelo WhatsApp para mais informações.');
};

window.handleContact = function (productId) {
    const product = findProductById(parseInt(productId));
    const message = `Olá! Tenho interesse no produto: ${product.name} (Código: ECO-${String(product.id).padStart(3, '0')})`;
    const whatsappUrl = `https://wa.me/5519981617022?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    console.log('Página carregada, iniciando busca do produto...');

    const productId = getProductIdFromURL();
    console.log('ID do produto extraído da URL:', productId);

    if (!productId) {
        console.error('ID do produto não encontrado na URL');
        renderError();
        return;
    }

    console.log('Produtos disponíveis:', products);
    const product = findProductById(productId);
    console.log('Produto encontrado:', product);

    if (!product) {
        console.error('Produto não encontrado com ID:', productId);
        renderError();
        return;
    }

    renderProduct(product);

    // Atualizar título da página
    document.title = `${product.name} - EcoMadeiras`;
});