document.addEventListener('DOMContentLoaded', () => {
    // === Menú flotante ===
    const menuToggle = document.querySelector('.floating-menu-toggle');
    const menuItems = document.querySelectorAll('.floating-menu-items a');
    
    // Cerrar menú al hacer clic en un enlace
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.checked = false;
        });
    });
    
    // === Carrusel ===
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-nav');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    let currentIndex = 0;
    const slideCount = carouselSlides.length;
    
    // Crear puntos de navegación
    carouselSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
        
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    // Actualizar carrusel
    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Actualizar puntos
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Navegación con botones
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? slideCount - 1 : currentIndex - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === slideCount - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    });

    // Autoplay para el carrusel
    let carouselInterval = setInterval(() => {
        currentIndex = (currentIndex === slideCount - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    }, 5000); // Cambia cada 5 segundos

    // Pausar autoplay en hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    carouselContainer.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            currentIndex = (currentIndex === slideCount - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        }, 5000);
    });

    // === Botón Volver arriba ===
    const backToTopButton = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Muestra el botón después de 300px de scroll
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // === Lógica de precios en el formulario de reservas ===
    const serviceSelect = document.getElementById('service-select');
    const numTicketsInput = document.getElementById('numTickets');
    const totalPriceSpan = document.getElementById('total-price');

    function calculateTotalPrice() {
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        const pricePerUnit = parseFloat(selectedOption.dataset.price || 0);
        const numTickets = parseInt(numTicketsInput.value || 1);
        const total = pricePerUnit * numTickets;
        totalPriceSpan.textContent = total.toFixed(2);
    }

    serviceSelect.addEventListener('change', calculateTotalPrice);
    numTicketsInput.addEventListener('input', calculateTotalPrice);

    // Inicializar el precio al cargar la página
    calculateTotalPrice();


    // === Integración Stripe para pagos ===
    // Configura tu clave pública de Stripe
    // ¡IMPORTANTE!: En un entorno real, usa una clave pública de prueba y asegúrate de que tu backend maneje la clave secreta.
    // Reemplaza 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY' con tu clave real.
    const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTpgxzXSp'); // Ejemplo de clave de prueba
    const elements = stripe.elements();

    // Estilos para el elemento de la tarjeta
    const style = {
        base: {
            color: '#3B2B20',
            fontFamily: '"Libre Baskerville", serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#A1866F'
            }
        },
        invalid: {
            color: '#ff5252',
            iconColor: '#ff5252'
        }
    };

    // Crea un elemento de tarjeta y lo monta en el DOM
    const card = elements.create('card', {style: style});
    card.mount('#card-element');

    // Maneja errores de validación en tiempo real del elemento de tarjeta
    const cardErrors = document.getElementById('card-errors');
    card.addEventListener('change', event => {
        if (event.error) {
            cardErrors.textContent = event.error.message;
        } else {
            cardErrors.textContent = '';
        }
    });

    // Maneja el envío del formulario de reserva
    const bookingForm = document.getElementById('booking-form');
    const submitButton = document.getElementById('submit-button');

    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Deshabilitar el botón para evitar múltiples envíos
        submitButton.disabled = true;
        submitButton.textContent = 'Procesando...';

        const { token, error } = await stripe.createToken(card);

        if (error) {
            // Mostrar errores de tarjeta al usuario
            cardErrors.textContent = error.message;
            submitButton.disabled = false;
            submitButton.textContent = 'Pagar y Reservar';
        } else {
            // Envía el token al servidor para procesar el pago
            // En un escenario real, aquí harías una solicitud AJAX a tu backend
            console.log('Stripe Token:', token);
            alert('¡Reserva exitosa! Token de pago generado: ' + token.id + '\nEn un entorno real, este token sería enviado a tu servidor para procesar el pago.');
            
            // Aquí puedes reiniciar el formulario o redirigir al usuario
            bookingForm.reset();
            card.clear(); // Limpiar el campo de la tarjeta
            calculateTotalPrice(); // Recalcular total
            submitButton.disabled = false;
            submitButton.textContent = 'Pagar y Reservar';
            cardErrors.textContent = '';
        }
    });
   
// === Chatbot Simple ===
const botToggle = document.getElementById('chatbot-toggle');
const botBox = document.getElementById('chatbot');
const botMessages = document.getElementById('chat-messages');
const botInput = document.getElementById('chat-input');

if (botToggle) {
    botToggle.addEventListener('click', () => {
        if (botBox.style.display === 'flex') {
            botBox.style.display = 'none';
        } else {
            botBox.style.display = 'flex';
            botBox.style.flexDirection = 'column';
        }
    });
}

if (botInput) {
    botInput.addEventListener('keypress', e => {
        if (e.key === 'Enter' && botInput.value.trim()) {
            addMessage('Tú', botInput.value.trim());
            respond(botInput.value.trim());
            botInput.value = '';
        }
    });
}

function addMessage(sender, text) {
    if (!botMessages) return;
    const p = document.createElement('p');
    p.innerHTML = '<strong>' + sender + ':</strong> ' + text;
    botMessages.appendChild(p);
    botMessages.scrollTop = botMessages.scrollHeight;
}

function respond(text) {
    let reply = '¡Gracias por tu interés! En breve te respondemos 😊';
    const q = text.toLowerCase();
    if (q.includes('precio') || q.includes('costo')) {
        reply = 'Nuestros vuelos empiezan desde $3,800 MXN por persona. Incluye brindis y desayuno buffet.';
    } else if (q.includes('horario') || q.includes('hora')) {
        reply = 'Despegamos al amanecer (6:00 am aprox.). Te citamos 30 min antes en nuestro globopuerto.';
    } else if (q.includes('ubicación') || q.includes('cómo llegar')) {
        reply = 'Estamos en el Globopuerto Teotihuacán, a 5 min de la Puerta 1 de las pirámides.';
    }
    setTimeout(() => addMessage('Globotita', reply), 600);
}
});