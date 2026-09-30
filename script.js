/* ==============================================================================
   PORTAFOLIO PROFESIONAL E INTERACTIVO — ITALO RAMOS
   Lógica: Three.js 3D Cyber-Constellation, Spotlight Cards, 3D Tilt,
           Explorador C4 Interactivo, Terminal DevSecOps, Matrix Rain y Web Audio
   ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCyberConstellation();
    initSpotlightCards();
    init3DTilt();
    initCountUp();
    initFilters();
    initTerminal();
    initC4Explorer();
    initMobileMenu();
    initScrollSpy();
    initDockActiveState();
});

/* ==============================================================================
   1. FONDO 3D INTERACTIVO — THREE.JS CYBER CONSTELLATION
   ============================================================================== */
let cyberAnimationId = null;
let isCyberRunning = false;

function initCyberConstellation() {
    const canvas = document.getElementById('cyberCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 240;

    // Generación de Nodos en 3D
    const particleCount = window.innerWidth < 768 ? 65 : 125;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    const bounds = { x: 260, y: 160, z: 120 };

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * bounds.x * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * bounds.y * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * bounds.z * 2;

        velocities.push({
            x: (Math.random() - 0.5) * 0.35,
            y: (Math.random() - 0.5) * 0.35,
            z: (Math.random() - 0.5) * 0.2
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material de partículas con brillo cian / púrpura
    const pMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 3.5,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // Malla de líneas interconectadas (Security Mesh)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Interacción con el cursor del ratón (Paralaje)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('pointermove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    // Manejo de redimensionado responsivo
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Control de consumo de batería: pausar cuando no sea visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(cyberAnimationId);
            isCyberRunning = false;
        } else if (!isCyberRunning) {
            animate();
        }
    });

    const connectDistance = window.innerWidth < 768 ? 48 : 62;

    function animate() {
        isCyberRunning = true;
        cyberAnimationId = requestAnimationFrame(animate);

        // Suavizado del movimiento de cámara
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        camera.position.x = targetX;
        camera.position.y = -targetY;
        camera.lookAt(scene.position);

        scene.rotation.y += 0.0008;

        const posAttr = particles.geometry.attributes.position;
        const posArray = posAttr.array;

        let lineIdx = 0;
        const linePos = lines.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Actualizar posiciones con velocidades
            posArray[i3] += velocities[i].x;
            posArray[i3 + 1] += velocities[i].y;
            posArray[i3 + 2] += velocities[i].z;

            // Rebote suave en los límites
            if (posArray[i3] < -bounds.x || posArray[i3] > bounds.x) velocities[i].x *= -1;
            if (posArray[i3 + 1] < -bounds.y || posArray[i3 + 1] > bounds.y) velocities[i].y *= -1;
            if (posArray[i3 + 2] < -bounds.z || posArray[i3 + 2] > bounds.z) velocities[i].z *= -1;

            // Detección de proximidad y trazado de conexiones
            for (let j = i + 1; j < particleCount; j++) {
                const j3 = j * 3;
                const dx = posArray[i3] - posArray[j3];
                const dy = posArray[i3 + 1] - posArray[j3 + 1];
                const dz = posArray[i3 + 2] - posArray[j3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectDistance) {
                    linePos[lineIdx++] = posArray[i3];
                    linePos[lineIdx++] = posArray[i3 + 1];
                    linePos[lineIdx++] = posArray[i3 + 2];

                    linePos[lineIdx++] = posArray[j3];
                    linePos[lineIdx++] = posArray[j3 + 1];
                    linePos[lineIdx++] = posArray[j3 + 2];
                }
            }
        }

        posAttr.needsUpdate = true;
        lines.geometry.setDrawRange(0, lineIdx / 3);
        lines.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();
}

/* ==============================================================================
   2. SISTEMA SPOTLIGHT CARDS & 3D TILT
   ============================================================================== */
function initSpotlightCards() {
    const cards = document.querySelectorAll('.spotlight-card');

    cards.forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

function init3DTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
        return;
    }

    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

/* ==============================================================================
   3. ANIMACIÓN DE CONTADORES NUMÉRICOS (COUNTUP)
   ============================================================================== */
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target'));
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 1600;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Easing exponencial suave
                    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.floor(ease * target);

                    el.innerText = `${prefix}${current}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.innerText = `${prefix}${target}${suffix}`;
                    }
                }

                requestAnimationFrame(update);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.4 });

    statNumbers.forEach(num => observer.observe(num));
}

/* ==============================================================================
   4. WEB AUDIO SYNTHESIZER (EFECTOS DE SONIDO CIBERNÉTICOS)
   ============================================================================== */
let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSound(type = 'blip') {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'blip') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(820, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        }
    } catch {
        // Fallback silencioso si el navegador bloquea audio sin interacción previa
    }
}

function toggleAudio() {
    soundEnabled = !soundEnabled;
    const soundIcon = document.getElementById('soundIcon');
    if (soundIcon) {
        soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    showToast(soundEnabled ? 'Sonidos cibernéticos activados' : 'Sonidos silenciados');
    if (soundEnabled) playSound('success');
}

/* ==============================================================================
   5. LLUVIA DIGITAL MATRIX EN EL TERMINAL
   ============================================================================== */
let matrixInterval = null;
let isMatrixActive = false;

function toggleMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    isMatrixActive = !isMatrixActive;

    if (isMatrixActive) {
        canvas.classList.add('active');
        startMatrixAnimation(canvas);
        playSound('success');
    } else {
        canvas.classList.remove('active');
        if (matrixInterval) {
            clearInterval(matrixInterval);
            matrixInterval = null;
        }
    }
}

function startMatrixAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const chars = '01PUCPSEC01CLOUDDEVSECOPSAWSFASTAPI0123456789';
    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    if (matrixInterval) clearInterval(matrixInterval);

    matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(10, 15, 28, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00f0ff';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 45);
}

/* ==============================================================================
   6. WIDGET INTERACTIVO DE ARQUITECTURA C4 (SIMON BROWN)
   ============================================================================== */
const c4LevelsData = {
    1: {
        title: 'Nivel 1: Contexto del Sistema',
        nodes: [
            {
                type: 'edge',
                title: 'Persona 1 (Bodeguero Rural)',
                desc: 'Comerciante en zona sin señal que ejecuta cobros mediante terminal IoT portátil.',
                pills: ['Actor', 'Venta Local', 'Offline']
            },
            {
                type: 'core',
                title: 'Terminal IoT Edge (ESP32)',
                desc: 'Registra transacciones en memoria NVS cifrada con firma digital y límite SBS.',
                pills: ['AES-256-GCM', 'ECDSA P-256', 'Tope S/ 3,000']
            },
            {
                type: 'cloud',
                title: 'Nube Azure Reconciliadora',
                desc: 'Ingiere ráfagas de transacciones acumuladas en cuanto se detecta conectividad.',
                pills: ['MQTT / TLS 1.3', 'Idempotencia', 'Cosmos DB']
            },
            {
                type: 'security',
                title: 'Core Bancario & Regulador SBS',
                desc: 'Valida cuentas de destino, asienta saldo contable y audita trazabilidad legal.',
                pills: ['ISO 20022', 'Compliance SBS', 'Alta Disponibilidad']
            }
        ],
        insight: 'Garantiza continuidad operativa al 100% ante caídas de red, cumpliendo el tope normativo de S/ 3,000 para mitigar riesgo de crédito sin conexión.'
    },
    2: {
        title: 'Nivel 2: Contenedores de la Solución',
        nodes: [
            {
                type: 'edge',
                title: 'Edge Runtime (C++/FreeRTOS)',
                desc: 'Microcontrolador ESP32 con partición NVS cifrada por hardware y cola de transacciones.',
                pills: ['Hardware Crypto', 'Deep Sleep', 'Flash Wear-Leveling']
            },
            {
                type: 'cloud',
                title: 'Azure IoT Hub (Gateway)',
                desc: 'Puerta de enlace con autenticación mutua (mTLS) y soporte para ráfagas asíncronas.',
                pills: ['mTLS X.509', 'Event Grid Routing', 'Device Twins']
            },
            {
                type: 'security',
                title: 'Azure Functions Serverless',
                desc: 'Microservicio de conciliación con verificación de firmas, deduplicación y reglas SBS.',
                pills: ['Python / Linux', 'Zero-Downtime Slots', 'DLQ']
            },
            {
                type: 'core',
                title: 'Azure Cosmos DB & Key Vault',
                desc: 'Base de datos NoSQL distribuida multi-región para libro contable inmutable y HSM.',
                pills: ['PACELC Theorem', 'HSM FIPS 140-2', 'Private Endpoints']
            }
        ],
        insight: 'Desacopla el almacenamiento local del procesamiento centralizado mediante mensajería por ráfagas, eliminando la latencia en el punto de cobro.'
    },
    3: {
        title: 'Nivel 3: Componentes de la Función Conciliadora',
        nodes: [
            {
                type: 'cloud',
                title: 'TriggerHandler & SchemaValidator',
                desc: 'Valida el contrato JSON/Protobuf y la versión de protocolo del terminal antes del cómputo.',
                pills: ['Pydantic', 'Schema Registry', 'Fast Reject']
            },
            {
                type: 'security',
                title: 'CryptoVerifier (PKI & Firmas)',
                desc: 'Verifica la firma criptográfica ECDSA con la clave pública inyectada del dispositivo.',
                pills: ['Anti-Tampering', 'Key Vault Cache', 'ECDSA Verify']
            },
            {
                type: 'core',
                title: 'IdempotencyGuard (UUIDv4)',
                desc: 'Garantiza procesamiento de una sola vez (Exactly-Once) mediante hashing de payloads.',
                pills: ['Redis Cache', 'Race Condition Guard', 'Hash SHA-256']
            },
            {
                type: 'edge',
                title: 'SagaOrchestrator & SBSValidator',
                desc: 'Valida límites acumulados de S/ 3,000 y orquesta compensaciones con Dead-Letter Queue.',
                pills: ['Saga Pattern', 'SBS Cap Check', 'DLQ Recovery']
            }
        ],
        insight: 'La función serverless es 100% stateless e idempotente: si la conexión falla durante la sincronización, reintentar la operación no duplica cobros.'
    },
    4: {
        title: 'Nivel 4: Despliegue e Infraestructura Cloud',
        nodes: [
            {
                type: 'cloud',
                title: 'VNet Privada (Azure East US 2)',
                desc: 'Aislamiento de red sin IPs públicas hacia Cosmos DB ni Key Vault vía Private Endpoints.',
                pills: ['Private Link', 'NSG Granulares', 'Bastion Access']
            },
            {
                type: 'security',
                title: 'Infraestructura como Código (IaC)',
                desc: 'Plantillas reproducibles de Terraform y Bicep versionadas con análisis estático Checkov.',
                pills: ['Terraform', 'Checkov SAST', 'GitHub Actions']
            },
            {
                type: 'core',
                title: 'Monitoreo & Azure Monitor / SIEM',
                desc: 'Recolección continua de logs estructurados, alertas por fallos de firma y telemetría de cola.',
                pills: ['Log Analytics', 'Alertas de Seguridad', 'KQL']
            },
            {
                type: 'edge',
                title: 'OTA Device Twins (Firmware)',
                desc: 'Canal de actualización Over-The-Air seguro con rollback automático si falla el checksum.',
                pills: ['Rollback Guard', 'Firmware Signing', 'IoT Hub Twins']
            }
        ],
        insight: 'Cumple el principio de Zero-Trust: ninguna entidad de la nube confía ciegamente en el hardware físico de borde sin validación estricta por capa.'
    }
};

function initC4Explorer() {
    switchC4Level(1);
}

function switchC4Level(level) {
    const data = c4LevelsData[level];
    if (!data) return;

    // Actualizar botones de navegación
    const buttons = document.querySelectorAll('.c4-tab-btn');
    buttons.forEach(btn => {
        if (parseInt(btn.getAttribute('data-level')) === level) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const stage = document.getElementById('c4StagePanel');
    if (!stage) return;

    playSound('blip');

    // Generar nodos interactivos con iconos y badges
    const nodesHtml = data.nodes.map(node => {
        let iconClass = 'icon-core';
        let faIcon = 'fa-solid fa-server';

        if (node.type === 'edge') {
            iconClass = 'icon-edge';
            faIcon = 'fa-solid fa-microchip';
        } else if (node.type === 'cloud') {
            iconClass = 'icon-cloud';
            faIcon = 'fa-solid fa-cloud';
        } else if (node.type === 'security') {
            iconClass = 'icon-security';
            faIcon = 'fa-solid fa-shield-halved';
        }

        const pillsHtml = node.pills.map(p => `<span class="c4-node-pill">${p}</span>`).join('');

        return `
            <div class="c4-node-card spotlight-card">
                <div>
                    <div class="c4-node-header">
                        <div class="c4-node-icon ${iconClass}">
                            <i class="${faIcon}"></i>
                        </div>
                        <h5 class="c4-node-title">${node.title}</h5>
                    </div>
                    <p class="c4-node-desc">${node.desc}</p>
                </div>
                <div class="c4-node-pills">
                    ${pillsHtml}
                </div>
            </div>
        `;
    }).join('');

    stage.innerHTML = `
        <div class="c4-flow-visual">
            ${nodesHtml}
        </div>
        <div class="c4-insight-bar">
            <i class="fa-solid fa-lightbulb"></i>
            <div>
                <strong>Garantía de Arquitectura:</strong> ${data.insight}
            </div>
        </div>
    `;

    // Reasignar listeners de spotlight para los nuevos nodos generados
    initSpotlightCards();
}

/* ==============================================================================
   7. FILTRADO DE PROYECTOS
   ============================================================================== */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('blip');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}

/* ==============================================================================
   8. MODALES DE ARQUITECTURA DE PROYECTOS & CV
   ============================================================================== */
const projectData = {
    'fintech': {
        tag: 'FastAPI + PostgreSQL + Concurrencia Estricta',
        title: 'Fintech Transaction Engine — Arquitectura Interna',
        repo: 'https://github.com/italo04/fintech-transaction-engine',
        body: `
            <p><strong>Problema abordado:</strong> En plataformas de pagos de alta concurrencia, peticiones simultáneas sobre una misma cuenta pueden originar condiciones de carrera (<em>race conditions</em>), saldos negativos o dobles cobros si no se controla adecuadamente el aislamiento de transacciones.</p>
            
            <h4 class="modal-section-title"><i class="fa-solid fa-layer-group"></i> Decisiones Clave de Arquitectura:</h4>
            <ul>
                <li><strong>Aislamiento y Bloqueo Pesimista:</strong> Empleo de <code>SELECT ... FOR UPDATE</code> en PostgreSQL y nivel de aislamiento Serializable en operaciones críticas de débito y crédito.</li>
                <li><strong>Patrón de Idempotencia:</strong> Validación estricta mediante cabecera <code>X-Idempotency-Key</code> combinada con hash criptográfico del payload para evitar reejecuciones duplicadas.</li>
                <li><strong>Doble Partida Contable (Double-Entry Ledger):</strong> Cada movimiento crea un registro inmutable en el libro contable garantizando consistencia matemática en tiempo real.</li>
            </ul>

            <h4 class="modal-section-title"><i class="fa-solid fa-code"></i> Flujo Transaccional:</h4>
            <div class="modal-code-block">
POST /api/v1/transfers
Headers: { "X-Idempotency-Key": "uuid-v4-hash" }
Payload: { "origin_account": 101, "destination_account": 204, "amount": 150.00 }
↳ 1. Check idempotency cache (Redis/DB)
↳ 2. Begin Transaction (Lock accounts in consistent order to prevent deadlocks)
↳ 3. Validate balance >= amount
↳ 4. Debit origin / Credit destination / Write Ledger entry
↳ 5. Commit & Cache Result
            </div>
            
            <p><strong>Resultado de pruebas:</strong> 100% de resistencia en tests de carga simulada concurrentes sin ninguna anomalía de saldo detectada.</p>
        `
    },
    'cloud-sec': {
        tag: 'AWS VPC + IAM + Linux Hardening + Bash',
        title: 'Secure Cloud Infra & Linux Hardening — Arquitectura Defensiva',
        repo: 'https://github.com/italo04/secure-cloud-infra',
        body: `
            <p><strong>Problema abordado:</strong> Servidores en la nube expuestos directamente a internet sin segmentación de red ni políticas restrictivas de acceso suelen ser vulnerables a escaneos masivos, ataques de fuerza bruta SSH y movimientos laterales.</p>
            
            <h4 class="modal-section-title"><i class="fa-solid fa-shield-halved"></i> Controles de Seguridad Implementados:</h4>
            <ul>
                <li><strong>Diseño de Red VPC en AWS:</strong> Segmentación entre subredes públicas (DMZ con balanceadores) y subredes privadas (instancias de aplicación y bases de datos aisladas sin IP pública).</li>
                <li><strong>Principio de Mínimo Privilegio (IAM):</strong> Políticas JSON granulares asignadas vía IAM Roles temporales a instancias EC2, eliminando credenciales estáticas en código.</li>
                <li><strong>Hardening Automatizado en Bash:</strong> Deshabilitación del login SSH como root, autenticación obligatoria por claves RSA-4096, configuración de <code>iptables</code> defensivo y enjaulado de servicios con <code>fail2ban</code>.</li>
            </ul>

            <h4 class="modal-section-title"><i class="fa-solid fa-terminal"></i> Script de Auditoría de Accesos:</h4>
            <div class="modal-code-block">
#!/usr/bin/env bash
# Análisis de vectores sospechosos en /var/log/auth.log
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -10
# Aplicación de reglas restrictivas UFW / iptables
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP
            </div>
        `
    },
    'layerforge': {
        tag: 'Spring Boot 3 + Spring Cloud + Netflix Eureka',
        title: 'LayerForge Microservices — Arquitectura Distribuida',
        repo: 'https://github.com/italo04/layerforge-microservices',
        body: `
            <p><strong>Problema abordado:</strong> Monolitos tradicionales con acoplamiento severo que dificultan el escalado independiente y la tolerancia a fallos parciales.</p>
            
            <h4 class="modal-section-title"><i class="fa-solid fa-diagram-project"></i> Componentes del Sistema:</h4>
            <ul>
                <li><strong>Eureka Service Discovery:</strong> Registro dinámico de instancias vivas de microservicios con heartbeat regular para balanceo del lado del cliente.</li>
                <li><strong>Spring Cloud API Gateway:</strong> Puerta de enlace unificada que gestiona enrutamiento inteligente, filtros pre/post para trazabilidad de peticiones y CORS.</li>
                <li><strong>Contenedorización en Docker:</strong> Despliegue orquestado mediante Docker Compose para arranque sincronizado y redes internas de aislamiento.</li>
            </ul>

            <h4 class="modal-section-title"><i class="fa-solid fa-network-wired"></i> Topología:</h4>
            <div class="modal-code-block">
[Cliente / Frontend]
         │
         ▼
[API Gateway :8080] ◄─── Consulta Registro ───► [Eureka Server :8761]
    ┌────┴────────────┐
    ▼                 ▼
[Auth Service]   [Core Business Service]
            </div>
        `
    },
    'devsecops': {
        tag: 'GitHub Actions + Docker Non-Root + SAST',
        title: 'DevSecOps Shift-Left Pipeline — Seguridad Preventiva',
        repo: 'https://github.com/italo04',
        body: `
            <p><strong>Problema abordado:</strong> Dejar la seguridad para el final del ciclo de vida del software (fase de despliegue) incrementa exponencialmente el costo y tiempo de remediación de vulnerabilidades.</p>
            
            <h4 class="modal-section-title"><i class="fa-solid fa-lock"></i> Estrategia Shift-Left:</h4>
            <ul>
                <li><strong>SAST (Static Application Security Testing):</strong> Integración de <code>Bandit</code> y linters en GitHub Actions que abortan el pipeline si detectan inyecciones SQL, uso de librerías inseguras o secretos expuestos.</li>
                <li><strong>Docker Security Best Practices:</strong> Uso de imágenes base ligeras (Alpine/Distroless), compilación multi-etapa para descartar herramientas de build y creación explícita de usuario no privilegiado (<code>appuser</code>).</li>
            </ul>

            <h4 class="modal-section-title"><i class="fa-solid fa-code"></i> Dockerfile Seguro:</h4>
            <div class="modal-code-block">
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
USER appuser
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appgroup . /app
WORKDIR /app
CMD ["python", "main.py"]
            </div>
        `
    },
    'thesis': {
        tag: 'Modelo C4 (Simon Brown) + Microsoft Azure + IoT Edge',
        title: 'Arquitectura C4 y Flujos de Despliegue — Tesis PFC 1 (Persona 1)',
        repo: 'https://github.com/italo04',
        body: `
            <p><strong>Actor Principal (Persona 1):</strong> Comerciante o bodeguero en entornos rurales o con conectividad intermitente que realiza cobros digitales offline en su terminal portátil.</p>
            
            <h4 class="modal-section-title"><i class="fa-solid fa-sitemap"></i> Niveles del Modelo C4 (Simon Brown):</h4>
            <ul>
                <li><strong>C4 Nivel 1 (Contexto del Sistema):</strong> Mapea la interacción de <em>Persona 1</em> con el terminal IoT, clientes, redes celulares intermitentes, el Core Bancario y el regulador SBS (límite offline S/ 3,000).</li>
                <li><strong>C4 Nivel 2 (Contenedores):</strong> Desacoplamiento entre la <em>Capa de Borde</em> (ESP32 con NVS cifrada AES-256-GCM y motor criptográfico ECDSA P-256) y la <em>Capa Cloud en Azure</em> (IoT Hub con mTLS, Event Grid, Azure Function Reconciliadora, Cosmos DB y Key Vault HSM).</li>
                <li><strong>C4 Nivel 3 (Componentes):</strong> Desglose modular de la función serverless: <code>TriggerHandler</code>, <code>CryptoVerifier</code> (firma PKI), <code>IdempotencyGuard</code> (UUIDv4), <code>SBSValidator</code> y <code>SagaOrchestrator</code> (compensaciones y Dead-Letter Queue).</li>
                <li><strong>C4 Nivel 4 (Despliegue e Infraestructura):</strong> Virtual Network (VNet) privada en Azure East US 2 con Private Endpoints, RBAC de mínimo privilegio y canal MQTT/TLS 1.3.</li>
            </ul>

            <h4 class="modal-section-title"><i class="fa-solid fa-rocket"></i> Flujos de Despliegue Automatizados:</h4>
            <ul>
                <li><strong>1. Infraestructura como Código (IaC):</strong> Aprovisionamiento con Terraform / Bicep en GitHub Actions con análisis de seguridad (Checkov).</li>
                <li><strong>2. CI/CD Serverless:</strong> Pipeline de Azure Functions con pruebas unitarias, análisis estático SAST y slot swap sin caída de servicio (Zero-Downtime).</li>
                <li><strong>3. Aprovisionamiento y Actualización de Firmware Edge (OTA):</strong> Inyección de claves PKI en fábrica y despliegue seguro Over-The-Air mediante Azure IoT Hub Device Twins.</li>
            </ul>
        `
    }
};

function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    playSound('blip');
    document.getElementById('modalTag').innerText = data.tag;
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalBody').innerHTML = data.body;
    document.getElementById('modalRepoBtn').href = data.repo;

    const modal = document.getElementById('projectModal');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    playSound('blip');
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function openCvModal() {
    playSound('blip');
    const modal = document.getElementById('cvModal');
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCvModal() {
    playSound('blip');
    const modal = document.getElementById('cvModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

window.addEventListener('click', (e) => {
    const projectModal = document.getElementById('projectModal');
    const cvModal = document.getElementById('cvModal');
    if (e.target === projectModal) closeProjectModal();
    if (e.target === cvModal) closeCvModal();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
        closeCvModal();
    }
});

/* ==============================================================================
   9. TERMINAL INTERACTIVO AVANZADO DEVSECOPS
   ============================================================================== */
function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalBody = document.getElementById('terminalBody');
    if (!terminalInput || !terminalBody) return;

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';

            playSound('blip');

            // Mostrar el comando ejecutado
            const cmdLine = document.createElement('div');
            cmdLine.className = 'terminal-line';
            cmdLine.innerHTML = `<span class="term-prompt">$</span> <span class="term-cmd">${escapeHtml(command)}</span>`;
            terminalBody.insertBefore(cmdLine, terminalInput.parentElement);

            // Generar respuesta
            const responseDiv = document.createElement('div');
            responseDiv.className = 'term-output';

            switch (command) {
                case 'help':
                case 'ayuda':
                    responseDiv.innerHTML = `
                        <strong>Comandos disponibles en el shell interactivo:</strong><br>
                        • <strong>neofetch</strong>: Información de sistema y perfil de ingeniería<br>
                        • <strong>scan</strong>: Simulación de escaneo de seguridad y puertos<br>
                        • <strong>matrix</strong>: Alternar lluvia digital de código en el terminal<br>
                        • <strong>c4</strong>: Abrir e inspeccionar la arquitectura C4 de Tesis<br>
                        • <strong>ieee</strong>: Área de investigación en IEEE PUCP<br>
                        • <strong>miderecho</strong> / <strong>equipu</strong>: Proyecto de emprendimiento legaltech<br>
                        • <strong>whoami</strong>: Resumen profesional del candidato<br>
                        • <strong>proyectos</strong>: Listado de repositorios y microservicios<br>
                        • <strong>tesis</strong>: Resumen de Tesis PFC 1 (PUCP)<br>
                        • <strong>skills</strong>: Resumen de stack tecnológico<br>
                        • <strong>cv</strong>: Visualizar Curriculum Vitae Harvard ATS<br>
                        • <strong>contacto</strong>: Enlaces directos y correo<br>
                        • <strong>clear</strong>: Limpiar pantalla del terminal
                    `;
                    break;

                case 'neofetch':
                    responseDiv.innerHTML = `
                        <div class="neofetch-output">
                            <div class="neofetch-ascii">
    .-.    
   /v\\   
  // \\\\  
 /(   )\\ 
  ^^-^^  
                            </div>
                            <div class="neofetch-info">
                                <div class="neofetch-line"><span class="neofetch-label">Usuario:</span> <span class="neofetch-val">italo@pucp-cloud</span></div>
                                <div class="neofetch-line"><span class="neofetch-label">Institución:</span> <span class="neofetch-val">Pontificia Universidad Católica del Perú</span></div>
                                <div class="neofetch-line"><span class="neofetch-label">Carrera:</span> <span class="neofetch-val">Ingeniería Informática (9.º ciclo en curso)</span></div>
                                <div class="neofetch-line"><span class="neofetch-label">Enfoque:</span> <span class="neofetch-val">Ciberseguridad • Cloud (AWS/Azure) • DevSecOps</span></div>
                                <div class="neofetch-line"><span class="neofetch-label">Investigación:</span> <span class="neofetch-val">Rama Estudiantil IEEE PUCP</span></div>
                                <div class="neofetch-line"><span class="neofetch-label">Emprendimiento:</span> <span class="neofetch-val">Red EQUIPU (Proyecto Mi Derecho)</span></div>
                                <div class="neofetch-line"><span class="neofetch-label">Convenio:</span> <span class="neofetch-val">Disponible para Prácticas Preprofesionales (30h/sem)</span></div>
                                <div class="neofetch-line"><span class="neofetch-label">Uptime:</span> <span class="neofetch-val">9 semestres de formación de alta exigencia</span></div>
                            </div>
                        </div>
                    `;
                    break;

                case 'scan':
                    responseDiv.innerHTML = `
                        <span style="color: var(--accent-cyan); font-weight: 700;">[+] INICIANDO AUDITORÍA DEFENSIVA EN SERVIDORES...</span><br>
                        [•] Verificando puerto 443: TLS 1.3 Ciphersuites (AES-256-GCM / SHA-384) ... <span style="color: var(--accent-emerald);">[SEGURO]</span><br>
                        [•] Verificando puerto 22 SSH: Autenticación por contraseña ... <span style="color: var(--accent-emerald);">[DESHABILITADA - RSA 4096 OK]</span><br>
                        [•] Segmentación AWS VPC: Subredes privadas sin IP pública ... <span style="color: var(--accent-emerald);">[AISLADAS]</span><br>
                        [•] Escaneo estático SAST Bandit / Trivy ... <span style="color: var(--accent-emerald);">[0 CVEs Críticas]</span><br>
                        <span style="color: var(--accent-emerald); font-weight: 700;">[✓] ESTADO GENERAL: Cumplimiento de Principio de Mínimo Privilegio 100%.</span>
                    `;
                    playSound('success');
                    break;

                case 'matrix':
                    toggleMatrixRain();
                    responseDiv.innerHTML = isMatrixActive ? 
                        `Lluvia de código Matrix <span style="color: var(--accent-emerald);">ACTIVADA</span>. Ejecuta 'matrix' de nuevo para apagarla.` :
                        `Lluvia de código Matrix <span style="color: var(--text-muted);">DESACTIVADA</span>.`;
                    break;

                case 'c4':
                    switchC4Level(1);
                    document.getElementById('tesis').scrollIntoView({ behavior: 'smooth' });
                    responseDiv.innerHTML = `Navegando al explorador de arquitectura C4 de Tesis...`;
                    break;

                case 'ieee':
                    responseDiv.innerHTML = `
                        <strong>Rama Estudiantil IEEE PUCP — Área de Investigación:</strong><br>
                        • Formación continua en análisis del estado del arte, revisión bibliográfica sistemática y redacción de artículos técnicos.<br>
                        • Enfoque de investigación en seguridad de la información, modelos criptográficos en la nube y computación distribuida.
                    `;
                    break;

                case 'miderecho':
                case 'equipu':
                    responseDiv.innerHTML = `
                        <strong>EQUIPU (Red de Emprendimiento Universitario) — Proyecto "Mi Derecho":</strong><br>
                        • Iniciativa orientada a democratizar la orientación legal en el Perú a través de canales digitales accesibles y seguros.<br>
                        • Rol: Levantamiento de requerimientos técnicos, formulación de arquitectura de software resiliente y validación de hipótesis con mentores del ecosistema.
                    `;
                    break;

                case 'whoami':
                    responseDiv.innerHTML = `Italo Mijail Ramos Diaz | Estudiante de 9.° ciclo de Ing. Informática (PUCP) | Especialización en Ciberseguridad, Infraestructura Cloud y Arquitectura Backend de alta concurrencia.`;
                    break;

                case 'cv':
                case 'curriculum':
                case 'resume':
                    responseDiv.innerHTML = `
                        <strong>CV Formato Harvard ATS (PUCP - 9.° ciclo):</strong><br>
                        • Enfoque: Ciberseguridad, Infraestructura Cloud (AWS/Azure) y DevSecOps<br>
                        • Motor Transaccional: 100% consistencia, 20 hilos concurrentes, Pytest 92%<br>
                        • Cloud & Hardening: 80% reducción superficie expuesta, mitigación &lt; 15s con iptables<br>
                        • Tesis PFC 1: 0 pérdida offline, Wokwi ESP32, tope SBS S/ 3,000<br>
                        👉 <a href="javascript:void(0)" onclick="openCvModal()" style="color: var(--accent-cyan); text-decoration: underline;">Haz clic aquí para abrir el visor interactivo del CV</a>
                    `;
                    break;

                case 'proyectos':
                case 'projects':
                    responseDiv.innerHTML = `
                        1. <strong>fintech-transaction-engine</strong>: FastAPI, PostgreSQL (SELECT FOR UPDATE), Idempotencia<br>
                        2. <strong>secure-cloud-infra</strong>: AWS VPC, IAM Least Privilege, Linux Hardening, iptables<br>
                        3. <strong>layerforge-microservices</strong>: Spring Boot 3, Spring Cloud Gateway, Netflix Eureka<br>
                        4. <strong>devsecops-pipeline</strong>: GitHub Actions, Docker non-root, Bandit SAST
                    `;
                    break;

                case 'tesis':
                    responseDiv.innerHTML = `
                        Tesis PFC 1: Arquitectura Cloud-Native e IoT con sincronización asíncrona segura para transacciones desconectadas (AES-256-GCM, MQTT/TLS, PACELC, Wokwi ESP32, Azure Functions).
                    `;
                    break;

                case 'skills':
                    responseDiv.innerHTML = `AWS, Azure, Linux, Python/FastAPI, Java/Spring Boot, Docker, Bash, PostgreSQL, Wireshark, Git, Scrum SFC.`;
                    break;

                case 'contacto':
                case 'contact':
                    responseDiv.innerHTML = `
                        Correo: italomijail@gmail.com<br>
                        LinkedIn: linkedin.com/in/italo-mijail-ramos-diaz<br>
                        GitHub: github.com/italo04<br>
                        Teléfono / WhatsApp: +51 940 770 077 (Lima, Perú)
                    `;
                    break;

                case 'clear':
                case 'cls':
                    const lines = terminalBody.querySelectorAll('.terminal-line, .term-output');
                    lines.forEach(l => l.remove());
                    return;

                case '':
                    return;

                default:
                    responseDiv.innerHTML = `Comando no reconocido: <em>${escapeHtml(command)}</em>. Escribe <strong>help</strong> para ver la lista.`;
            }

            terminalBody.insertBefore(responseDiv, terminalInput.parentElement);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}

function executeTermChip(cmd) {
    const terminalInput = document.getElementById('terminalInput');
    if (!terminalInput) return;
    terminalInput.value = cmd;
    terminalInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
}

function focusTerminal() {
    playSound('blip');
    const terminal = document.querySelector('.hero-terminal');
    const input = document.getElementById('terminalInput');
    if (terminal && input) {
        terminal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => input.focus(), 400);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

/* ==============================================================================
   10. COPIAR CORREO CON FEEDBACK
   ============================================================================== */
function copyEmail() {
    playSound('blip');
    const email = 'italomijail@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        showToast('¡Correo italomijail@gmail.com copiado al portapapeles!');
        const copyText = document.getElementById('copyText');
        if (copyText) {
            copyText.innerText = '¡Copiado!';
            setTimeout(() => {
                copyText.innerText = 'Copiar';
            }, 2500);
        }
    }).catch(() => {
        showToast('Correo: italomijail@gmail.com');
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* ==============================================================================
   11. MENÚ MÓVIL Y NAVEGACIÓN
   ============================================================================== */
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            playSound('blip');
            navLinks.classList.toggle('mobile-open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
            });
        });
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 220;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function initDockActiveState() {
    const dockItems = document.querySelectorAll('.floating-dock .dock-item[href]');
    if (!dockItems.length) return;

    window.addEventListener('scroll', () => {
        let current = 'hero';
        const scrollPosition = window.pageYOffset + 260;
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        dockItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}
