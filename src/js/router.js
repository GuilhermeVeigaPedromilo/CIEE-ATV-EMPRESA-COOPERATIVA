// src/js/router.js
class SimpleRouter {
    constructor() {
        this.routes = new Map();
        this.init();
    }

    // Definir rotas
    addRoute(pattern, handler) {
        this.routes.set(pattern, handler);
    }

    // Inicializar roteador
    init() {
        // Interceptar cliques em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"]');
            if (link && !link.hasAttribute('target')) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });

        // Interceptar botão voltar/avançar do navegador
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });

        // Processar rota inicial
        this.handleRoute(window.location.pathname);
    }

    // Navegar para uma rota
    navigate(path) {
        if (path !== window.location.pathname) {
            history.pushState(null, '', path);
            this.handleRoute(path);
        }
    }

    // Processar rota
    handleRoute(path) {
        // Rota para página de produto
        const productMatch = path.match(/^\/produto\/(\d+)$/);
        if (productMatch) {
            this.loadProductPage(parseInt(productMatch[1]));
            return;
        }

        // Rota para home ou outras páginas
        switch (path) {
            case '/':
                this.loadHomePage();
                break;
            default:
                this.loadNotFound();
                break;
        }
    }

    // Carregar página do produto
    async loadProductPage(productId) {
        try {
            // Verificar se já estamos na página correta
            if (window.location.pathname === `/produto/${productId}`) {
                return;
            }

            // Carregar a página de produto
            const response = await fetch('/produto.html');
            if (!response.ok) {
                // Se não houver arquivo produto.html, redirecionar para home
                this.navigate('/');
                return;
            }

            const html = await response.text();
            document.documentElement.innerHTML = html;

            // Executar scripts da página
            this.executePageScripts();
        } catch (error) {
            console.error('Erro ao carregar página do produto:', error);
            this.navigate('/');
        }
    }

    // Carregar página inicial
    loadHomePage() {
        if (window.location.pathname === '/') {
            return;
        }
        window.location.href = '/';
    }

    // Página não encontrada
    loadNotFound() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                text-align: center;
                padding: 2rem;
                background: #f8fafc;
                color: #2d3748;
            ">
                <h1 style="font-size: 4rem; margin-bottom: 1rem; color: #8a7258;">404</h1>
                <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Página não encontrada</h2>
                <p style="margin-bottom: 2rem; color: #718096;">A página que você está procurando não existe.</p>
                <a href="/" style="
                    background: linear-gradient(135deg, #8a7258, #6d5a46);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: transform 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    Voltar ao início
                </a>
            </div>
        `;
    }

    // Executar scripts da página
    executePageScripts() {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.type = script.type || 'text/javascript';
                document.head.appendChild(newScript);
            } else if (script.textContent) {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                newScript.type = script.type || 'text/javascript';
                document.head.appendChild(newScript);
            }
        });
    }
}

// Inicializar roteador quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SimpleRouter();
    });
} else {
    new SimpleRouter();
}

export default SimpleRouter;