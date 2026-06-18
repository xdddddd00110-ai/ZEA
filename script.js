const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

const chars = '01{}[]();=></>function const let var';

function draw() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#57575754';
    ctx.font = fontSize + 'px monospace';

    drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.95) {
            drops[i] = 0;
        }
        drops[i]++;
    });
}

setInterval(draw, 50);

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let actual = 0;
    document.querySelector('.hero-slider').dataset.direccion = 'der';

const videoSlides = document.querySelectorAll('.slide video');

videoSlides.forEach((v, i) => {
    if (i !== 0) {
        v.pause();
        v.preload = 'none';
    }
});

function precargarSiguiente(index) {
    const siguiente = (index + 1) % videoSlides.length;
    if (videoSlides[siguiente].preload === 'none') {
        videoSlides[siguiente].preload = 'auto';
        videoSlides[siguiente].load();
    }
}

let cambiando = false;

function cambiarSlide(siguiente) {
    if (cambiando) return; // bloquea si ya está cambiando
    cambiando = true;

    const anterior = actual;
    actual = siguiente % slides.length;

    slides[anterior].classList.add('saliendo');
    slides[anterior].classList.remove('activo');
    dots[anterior].classList.remove('activo');

    slides[actual].classList.add('activo');
    dots[actual].classList.add('activo');

    const videoActual = videoSlides[actual];
    if (videoActual.readyState >= 3) {
        videoActual.play();
    } else {
        videoActual.preload = 'auto';
        videoActual.load();
        videoActual.addEventListener('canplay', () => videoActual.play(), { once: true });
    }

    setTimeout(() => {
        slides[anterior].classList.remove('saliendo');
        videoSlides[anterior].pause();
        precargarSiguiente(actual);
        cambiando = false; // desbloquea al terminar
    }, 800);
}
let timer = setInterval(() => {
    cambiarSlide(actual + 1);
}, 4000);

function reiniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        document.querySelector('.hero-slider').dataset.direccion = 'der';
        cambiarSlide(actual + 1);
    }, 4000);
}
document.querySelector('.flecha-der').addEventListener('click', () => {
    document.querySelector('.hero-slider').dataset.direccion = 'der';
    cambiarSlide(actual + 1);
    reiniciarTimer();
});

document.querySelector('.flecha-izq').addEventListener('click', () => {
    document.querySelector('.hero-slider').dataset.direccion = 'izq';
    cambiarSlide(actual - 1 + slides.length);
    reiniciarTimer();
});


document.querySelectorAll('.faq-pregunta').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const abierto = item.classList.contains('abierto');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('abierto'));
        if (!abierto) item.classList.add('abierto');
    });
});

function actualizarDisponibilidad() {
    const ahora = new Date();
    const utc = ahora.getTime() + ahora.getTimezoneOffset() * 60000;
    const cst = new Date(utc - 6 * 3600000);
    const hora = cst.getHours() + cst.getMinutes() / 60;

    const dot = document.getElementById('dot-disponibilidad');
    const texto = document.getElementById('texto-disponibilidad');

    const disponible = hora >= 15 && hora < 21;

    const horaCST = cst.getHours();
    const minutosCST = cst.getMinutes().toString().padStart(2, '0');
    const periodoCST = horaCST >= 12 ? 'PM' : 'AM';
    const horaCSTFormato = `${horaCST % 12 || 12}:${minutosCST} ${periodoCST}`;

    // Calcular equivalente en zona del visitante
    // Simulando visitante desde España (UTC+2 = +120 minutos)
// Cambia esto temporalmente para probar
const offsetVisitante = -ahora.getTimezoneOffset();
    const offsetCST = -360;
    const diff = (offsetVisitante - offsetCST) / 60;

    const inicioVisitante = (15 + diff + 24) % 24;
    const finVisitante = (21 + diff + 24) % 24;

    function formatHora(h) {
        const periodo = h >= 12 ? 'PM' : 'AM';
        const hora12 = Math.floor(h) % 12 || 12;
        const mins = Math.round((h % 1) * 60).toString().padStart(2, '0');
        return `${hora12}:${mins} ${periodo}`;
    }

const esDeNoche = inicioVisitante >= 22 || finVisitante <= 6;

const tooltipHora = document.getElementById('tooltip-hora-visitante');
if (tooltipHora) {
    tooltipHora.innerHTML = `That's <span>${formatHora(inicioVisitante)} – ${formatHora(finVisitante)}</span> your time
    ${esDeNoche ? '<br>⚠️ <span style="color:#a5a5a7;font-size:0.75rem">Late night for you — async messages welcome!</span>' : ''}`;
}

    if (disponible) {
        dot.classList.add('activo');
        texto.textContent = `Available now · My time: ${horaCSTFormato}`;
    } else {
        dot.classList.remove('activo');
        texto.textContent = `Unavailable · My time: ${horaCSTFormato}`;
    }
}

actualizarDisponibilidad();
setInterval(actualizarDisponibilidad, 60000);



const canvasF = document.getElementById('particulas-footer');
const ctxF = canvasF.getContext('2d');
canvasF.width = canvasF.offsetWidth;
canvasF.height = canvasF.offsetHeight;

const particulas = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvasF.width,
    y: Math.random() * canvasF.height,
    r: Math.random() * 15 + 5, // más grandes
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.4 + 0.1),
    alpha: Math.random() * 0.5 + 0.1,
}));

function dibujarParticulas() {
    ctxF.clearRect(0, 0, canvasF.width, canvasF.height);

    // Líneas entre partículas cercanas
    for (let i = 0; i < particulas.length; i++) {
        for (let j = i + 1; j < particulas.length; j++) {
            const dx = particulas[i].x - particulas[j].x;
            const dy = particulas[i].y - particulas[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctxF.beginPath();
                ctxF.strokeStyle = `rgba(109, 214, 209, ${1 - dist / 120})`;
                ctxF.lineWidth = 0.5;
                ctxF.moveTo(particulas[i].x, particulas[i].y);
                ctxF.lineTo(particulas[j].x, particulas[j].y);
                ctxF.stroke();
            }
        }
    }

    // Burbujas / partículas
particulas.forEach(p => {
    ctxF.beginPath();
    ctxF.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctxF.strokeStyle = `rgba(109, 214, 209, ${p.alpha})`;
    ctxF.lineWidth = 1;
    ctxF.shadowBlur = 10;
    ctxF.shadowColor = 'rgba(109, 214, 209, 0.4)';
    ctxF.stroke(); // solo borde, sin relleno

    p.x += p.vx;
    p.y += p.vy;

    if (p.y + p.r < 0) {
        p.y = canvasF.height + p.r;
        p.x = Math.random() * canvasF.width;
    }
    if (p.x < 0 || p.x > canvasF.width) p.vx *= -1;
});

    requestAnimationFrame(dibujarParticulas);
}

dibujarParticulas();

window.addEventListener('resize', () => {
    canvasF.width = canvasF.offsetWidth;
    canvasF.height = canvasF.offsetHeight;
});


const bio = "I create experiences in Roblox Studio, from complex game systems programmed in Luau to fluid character animations created in Blender after approximately two years of development. I don't just write code or move skeletons; I'm obsessed with the details that make a game feel alive.";

const bioEl = document.getElementById('hero-bio');
const btnHero = document.getElementById('btn-hero');
let i = 0;

btnHero.style.opacity = '0';
btnHero.style.transform = 'translateY(10px)';
btnHero.style.pointerEvents = 'none';

function escribirBio() {
    if (i < bio.length) {
        bioEl.textContent += bio[i];
        i++;
        setTimeout(escribirBio, 20);
    } else {
        bioEl.classList.add('terminado');
        setTimeout(() => {
            btnHero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            btnHero.style.opacity = '1';
            btnHero.style.transform = 'translateY(0)';
            btnHero.style.pointerEvents = 'auto';
        }, 200);
    }
}

setTimeout(escribirBio, 800);