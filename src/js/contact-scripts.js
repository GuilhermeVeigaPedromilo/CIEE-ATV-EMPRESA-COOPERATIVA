// Script para o formulário de contato
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const interest = formData.get('interest');
            const message = formData.get('message');
            
            // Criar mensagem para WhatsApp
            let whatsappMessage = `*Nova solicitação de orçamento - EcoMadeiras*\n\n`;
            whatsappMessage += `👤 *Nome:* ${name}\n`;
            whatsappMessage += `📧 *E-mail:* ${email}\n`;
            whatsappMessage += `📱 *Telefone:* ${phone}\n`;
            if (interest) {
                whatsappMessage += `🎯 *Interesse:* ${interest}\n`;
            }
            whatsappMessage += `💬 *Mensagem:* ${message}\n\n`;
            whatsappMessage += `_Enviado pelo site da EcoMadeiras_`;
            
            // Abrir WhatsApp
            const phoneNumber = "19981617022"; // Altere para seu número
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Mostrar mensagem de sucesso
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="btn-text">Redirecionando...</span> <span class="btn-icon">⏳</span>';
            submitBtn.disabled = true;
            
            // Abrir WhatsApp após 1 segundo
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                
                // Resetar formulário
                contactForm.reset();
                
                // Restaurar botão após 3 segundos
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 1000);
        });
    }
});

// src/js/contact.js
class ContactManager {
    constructor() {
        this.phoneNumber = "19981617022"; // Configure seu número aqui
        this.init();
    }

    init() {
        this.setupFormSubmission();
        this.setupPhoneMask();
        this.setupFormValidation();
    }

    // Configurar envio do formulário
    setupFormSubmission() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });
        }
    }

    // Processar envio do formulário
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            interest: formData.get('interest'),
            message: formData.get('message')
        };

        // Validar dados
        if (!this.validateForm(data)) {
            return;
        }

        // Criar mensagem para WhatsApp
        const whatsappMessage = this.createWhatsAppMessage(data);
        
        // Enviar via WhatsApp
        this.sendToWhatsApp(whatsappMessage, form);
    }

    // Validar formulário
    validateForm(data) {
        const errors = [];

        if (!data.name || data.name.length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('E-mail inválido');
        }

        if (!data.phone || data.phone.length < 10) {
            errors.push('Telefone inválido');
        }

        if (!data.message || data.message.length < 10) {
            errors.push('Mensagem deve ter pelo menos 10 caracteres');
        }

        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }

        return true;
    }

    // Validar e-mail
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Mostrar erros
    showErrors(errors) {
        // Remove alertas anteriores
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Cria novo alerta
        const alert = document.createElement('div');
        alert.className = 'form-alert error';
        alert.innerHTML = `
            <strong>⚠️ Corrija os seguintes erros:</strong>
            <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
        `;

        const form = document.getElementById('contactForm');
        form.insertBefore(alert, form.firstChild);

        // Remove após 5 segundos
        setTimeout(() => alert.remove(), 5000);
    }

    // Criar mensagem do WhatsApp
    createWhatsAppMessage(data) {
        let message = `*🏡 Nova solicitação de orçamento - EcoMadeiras*\n\n`;
        message += `👤 *Nome:* ${data.name}\n`;
        message += `📧 *E-mail:* ${data.email}\n`;
        message += `📱 *Telefone:* ${data.phone}\n`;
        
        if (data.interest) {
            const interests = {
                'mesa-jantar': 'Mesa de Jantar',
                'armario': 'Armário',
                'mesa-centro': 'Mesa de Centro',
                'balcao': 'Balcão',
                'mesa-escritorio': 'Mesa de Escritório',
                'estante': 'Estante',
                'personalizado': 'Projeto Personalizado',
                'outros': 'Outros'
            };
            message += `🎯 *Interesse:* ${interests[data.interest] || data.interest}\n`;
        }
        
        message += `💬 *Mensagem:*\n${data.message}\n\n`;
        message += `⏰ *Enviado em:* ${new Date().toLocaleString('pt-BR')}\n`;
        message += `🌐 _Via site da EcoMadeiras_`;

        return message;
    }

    // Enviar para WhatsApp
    sendToWhatsApp(message, form) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalContent = submitBtn.innerHTML;

        // Animação de loading
        submitBtn.innerHTML = '<span class="btn-text">Redirecionando...</span> <span class="btn-icon">⏳</span>';
        submitBtn.disabled = true;

        // URL do WhatsApp
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;

        // Abrir WhatsApp após delay
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            
            // Mostrar sucesso
            this.showSuccess();
            
            // Reset do formulário
            form.reset();
            
            // Restaurar botão
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            }, 3000);
        }, 1000);
    }

    // Mostrar mensagem de sucesso
    showSuccess() {
        // Remove alertas anteriores
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = 'form-alert success';
        alert.innerHTML = `
            <strong>✅ Sucesso!</strong>
            Você será redirecionado para o WhatsApp para finalizar o contato.
        `;

        const form = document.getElementById('contactForm');
        form.insertBefore(alert, form.firstChild);

        setTimeout(() => alert.remove(), 5000);
    }

    // Máscara para telefone
    setupPhoneMask() {
        const phoneInput = document.getElementById('phone');
        
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length >= 11) {
                    // Formato: (XX) XXXXX-XXXX
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 7) {
                    // Formato: (XX) XXXX-XXXX
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    // Formato: (XX) XXX
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else if (value.length >= 1) {
                    // Formato: (X
                    value = value.replace(/(\d{0,2})/, '($1');
                }
                
                e.target.value = value;
            });
        }
    }

    // Validação em tempo real
    setupFormValidation() {
        const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Validar campo individual
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'E-mail inválido';
                }
                break;
            case 'tel':
                if (value && value.replace(/\D/g, '').length < 10) {
                    isValid = false;
                    errorMessage = 'Telefone deve ter pelo menos 10 dígitos';
                }
                break;
            default:
                if (field.required && !value) {
                    isValid = false;
                    errorMessage = 'Este campo é obrigatório';
                }
        }

        this.showFieldError(field, isValid ? null : errorMessage);
    }

    // Mostrar erro no campo
    showFieldError(field, message) {
        // Remove erro anterior
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Adiciona classe de erro
        field.classList.toggle('error', !!message);

        // Adiciona mensagem se houver erro
        if (message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    // Limpar erro do campo
    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Configurar número do WhatsApp
    setPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    // Métodos públicos para integração
    static init(phoneNumber = "19981617022") {
        return new ContactManager().setPhoneNumber(phoneNumber);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Configure seu número do WhatsApp aqui
    ContactManager.init("19981617022");
});

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactManager;
}
