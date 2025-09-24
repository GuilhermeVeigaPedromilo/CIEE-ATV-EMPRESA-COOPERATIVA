 const path = './src/assets/images/';
        
        class ImageSlideshow {
            constructor() {
                this.currentSlide = 0;
                this.path = path;
                this.images = [
                    'picture-apresentation-1.svg',
                    'picture-apresentation-2.svg',
                    'picture-apresentation-3.svg'
                ];
                this.section = document.getElementById('section-apresentation');
                this.indicators = document.querySelectorAll('.indicator');
                this.intervalTime = 3000;
                this.intervalId = null;
                
                this.init();
            }

            init() {
                // Adiciona event listeners aos indicadores
                this.indicators.forEach((indicator, index) => {
                    indicator.addEventListener('click', () => {
                        this.goToSlide(index);
                        this.resetInterval();
                    });
                });

                // Inicia o slideshow automático
                this.startSlideshow();
            }

            goToSlide(slideIndex) {
                // Remove classe active do indicador atual
                this.indicators[this.currentSlide].classList.remove('active');
                
                // Atualiza o slide atual
                this.currentSlide = slideIndex;
                
                // Adiciona efeito de transição suave
                this.section.style.backgroundImage = `url('${this.path}${this.images[this.currentSlide]}')`;
                
                // Adiciona classe active ao novo indicador
                this.indicators[this.currentSlide].classList.add('active');
            }

            nextSlide() {
                const nextIndex = (this.currentSlide + 1) % this.images.length;
                this.goToSlide(nextIndex);
            }

            startSlideshow() {
                this.intervalId = setInterval(() => {
                    this.nextSlide();
                }, this.intervalTime);
            }

            stopSlideshow() {
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
            }

            resetInterval() {
                this.stopSlideshow();
                this.startSlideshow();
            }
        }

        // Inicializa o slideshow quando a página carregar
        document.addEventListener('DOMContentLoaded', () => {
            const slideshow = new ImageSlideshow();

            // Pausa o slideshow quando o mouse está sobre a section
            const section = document.getElementById('section-apresentation');
            section.addEventListener('mouseenter', () => {
                slideshow.stopSlideshow();
            });

            section.addEventListener('mouseleave', () => {
                slideshow.startSlideshow();
            });
        });