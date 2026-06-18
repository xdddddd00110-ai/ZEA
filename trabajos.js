const canvas = document.getElementById('matrix-trabajos');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 14;
const rows = Math.floor(canvas.height / fontSize);

// Lado izquierdo - cae hacia la derecha
const dropsIzq = Array(rows).fill(1);
// Lado derecho - cae hacia la izquierda
const dropsDer = Array(rows).fill(canvas.width / fontSize);

const chars = '01{}[]();=></>function const let var';

function draw() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(87, 87, 87, 0.33)';
    ctx.font = fontSize + 'px monospace';

    dropsIzq.forEach((x, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, x * fontSize, i * fontSize);
        if (x * fontSize > canvas.width / 3 && Math.random() > 0.95) {
            dropsIzq[i] = 0;
        }
        dropsIzq[i]++;
    });

    dropsDer.forEach((x, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, x * fontSize, i * fontSize);
        if (x * fontSize < canvas.width * 0.66 && Math.random() > 0.95) {
            dropsDer[i] = canvas.width / fontSize;
        }
        dropsDer[i]--;
    });
}

setInterval(draw, 50);
const lineaEl = document.querySelector('.timeline-linea');
const containerEl = document.querySelector('.timeline-container');

function ajustarLinea() {
    const alturaReal = containerEl.scrollHeight;
    lineaEl.style.height = alturaReal + 'px';
}

// Ejecutar inmediatamente y también en load por si los videos cambian el tamaño
ajustarLinea();
window.addEventListener('load', ajustarLinea);
window.addEventListener('resize', ajustarLinea);


function fadeVolumen(video, desde, hasta, duracion, callback) {
    const pasos = 20;
    const intervalo = duracion / pasos;
    const incremento = (hasta - desde) / pasos;
    let volumenActual = desde;

    const fade = setInterval(() => {
        volumenActual += incremento;
        video.volume = Math.min(1, Math.max(0, volumenActual));

        if ((incremento > 0 && volumenActual >= hasta) ||
            (incremento < 0 && volumenActual <= hasta)) {
            clearInterval(fade);
            if (callback) callback();
        }
    }, intervalo);

    return fade;
}   
const videos = document.querySelectorAll('.trabajo-card video');

videos.forEach(video => {
    video.volume = 0;
    let fadeActual = null;
    let lentitudActual = null;
    let estaSaliendo = false;

    video.addEventListener('mouseenter', async () => {
        estaSaliendo = false;
        if (fadeActual) clearInterval(fadeActual);
        if (lentitudActual) clearInterval(lentitudActual);
        video.playbackRate = 1;
        video.muted = false;
        try {
            await video.play();
            if (!estaSaliendo) {
                fadeActual = fadeVolumen(video, video.volume, 0.6, 2000);
            }
        } catch(e) {}
    });

    video.addEventListener('mouseleave', () => {
        estaSaliendo = true;
        if (fadeActual) clearInterval(fadeActual);
        if (lentitudActual) clearInterval(lentitudActual);
        const vol = video.volume;

        lentitudActual = setInterval(() => {
            video.playbackRate = Math.max(0.1, video.playbackRate - 0.05);
            if (video.playbackRate <= 0.1) clearInterval(lentitudActual);
        }, 50);

        fadeActual = fadeVolumen(video, vol, 0, 500, () => {
            if (estaSaliendo) {
                video.pause();
                video.muted = true;
                video.playbackRate = 1;
            }
        });
    });
});


document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const barra = wrapper.querySelector('.video-barra');

    video.addEventListener('timeupdate', () => {
        const porcentaje = (video.currentTime / video.duration) * 100;
        barra.style.width = porcentaje + '%';
    });
});

document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const barra = wrapper.querySelector('.video-barra');
    const progreso = wrapper.querySelector('.video-progreso');

    video.addEventListener('timeupdate', () => {
        const porcentaje = (video.currentTime / video.duration) * 100;
        barra.style.width = porcentaje + '%';
    });

    progreso.addEventListener('click', (e) => {
        const rect = progreso.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const porcentaje = clickX / rect.width;
        video.currentTime = porcentaje * video.duration;
    });
});



document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const ambient = document.createElement('canvas');
    ambient.classList.add('ambient-canvas');
    wrapper.appendChild(ambient);
    const actx = ambient.getContext('2d');

    function dibujarAmbient() {
        if (!video.paused) {
            ambient.width = video.videoWidth || 400;
            ambient.height = video.videoHeight || 300;
            actx.drawImage(video, 0, 0, ambient.width, ambient.height);
        }
        requestAnimationFrame(dibujarAmbient);
    }

video.addEventListener('play', () => {
    setInterval(() => {
        if (!video.paused) {
            ambient.width = video.videoWidth || 300;
            ambient.height = video.videoHeight || 200;
            actx.drawImage(video, 0, 0, ambient.width, ambient.height);
        }
    }, 100); // actualiza cada 100ms en lugar de cada frame
});
});


function animarTexto(selector) {
    const el = document.querySelector(selector);
    const texto = el.innerText;
    el.innerHTML = '';
    texto.split('').forEach((letra, i) => {
        const span = document.createElement('span');
        span.textContent = letra === ' ' ? '\u00A0' : letra;
        span.style.animationDelay = `${i * 0.05}s`;
        el.appendChild(span);
    });
}

animarTexto('#trabajos > h1');
animarTexto('#trabajos > p'); 

document.querySelectorAll('.trabajo-card').forEach(card => {
    const h3 = card.querySelector('.trabajo-info h3');
    const p = card.querySelector('.trabajo-info p');
    const video = card.querySelector('video');
    const textoH3 = h3.textContent.trim();
    const textoP = p.textContent.trim();

    h3.textContent = '';
    p.textContent = '';

    let intervalH3 = null;
    let intervalP = null;
    let timeoutP = null;
    let dentroDelVideo = false;

    function limpiarTodo() {
        clearInterval(intervalH3);
        clearInterval(intervalP);
        clearTimeout(timeoutP);
        intervalH3 = null;
        intervalP = null;
        timeoutP = null;
    }

    function escribir() {
        limpiarTodo();
        h3.textContent = '';
        p.textContent = '';
        h3.style.opacity = 1;
        p.style.opacity = 1;

        let i = 0;
        intervalH3 = setInterval(() => {
            if (!dentroDelVideo) return limpiarTodo();
            h3.textContent = textoH3.slice(0, i + 1);
            i++;
            if (i >= textoH3.length) clearInterval(intervalH3);
        }, 40);

        timeoutP = setTimeout(() => {
            if (!dentroDelVideo) return;
            let j = 0;
            intervalP = setInterval(() => {
                if (!dentroDelVideo) return limpiarTodo();
                p.textContent = textoP.slice(0, j + 1);
                j++;
                if (j >= textoP.length) clearInterval(intervalP);
            }, 20);
        }, textoH3.length * 40);
    }

    video.addEventListener('mouseenter', () => {
        dentroDelVideo = true;
        escribir();
    });

    video.addEventListener('mouseleave', () => {
        dentroDelVideo = false;
        limpiarTodo();
        h3.style.opacity = 0;
        p.style.opacity = 0;
        setTimeout(() => {
            if (!dentroDelVideo) {
                h3.textContent = '';
                p.textContent = '';
            }
        }, 300);
    });
});

