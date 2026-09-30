/* ==============================================================================
   PORTAFOLIO INTERACTIVO — ITALO RAMOS
   Lógica: Filtros, Terminal interactivo, Modales de arquitectura y portapapeles
   ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initTerminal();
    initMobileMenu();
    initScrollSpy();
});

// --- 1. FILTRADO DE PROYECTOS ---
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
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

// --- 2. MODAL DE ARQUITECTURA DE PROYECTOS ---
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
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function openCvModal() {
    const modal = document.getElementById('cvModal');
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCvModal() {
    const modal = document.getElementById('cvModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Cerrar modales al hacer clic fuera o pulsar Esc
window.addEventListener('click', (e) => {
    const projectModal = document.getElementById('projectModal');
    const cvModal = document.getElementById('cvModal');
    if (e.target === projectModal) {
        closeProjectModal();
    }
    if (e.target === cvModal) {
        closeCvModal();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
        closeCvModal();
    }
});

// --- 3. TERMINAL INTERACTIVO DEL HERO ---
function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalBody = document.getElementById('terminalBody');
    if (!terminalInput || !terminalBody) return;

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';

            // Mostrar el comando ejecutado
            const cmdLine = document.createElement('div');
            cmdLine.className = 'terminal-line';
            cmdLine.innerHTML = `<span class="term-prompt">$</span> <span class="term-cmd">${escapeHtml(command)}</span>`;
            
            // Insertar antes de la línea de entrada
            terminalBody.insertBefore(cmdLine, terminalInput.parentElement);

            // Generar respuesta
            const responseDiv = document.createElement('div');
            responseDiv.className = 'term-output';

            switch (command) {
                case 'help':
                case 'ayuda':
                    responseDiv.innerHTML = `
                        Comandos disponibles:<br>
                        • <strong>whoami</strong>: Información del candidato<br>
                        • <strong>proyectos</strong>: Listado de repositorios destacados<br>
                        • <strong>tesis</strong>: Resumen de Tesis PFC 1 (PUCP)<br>
                        • <strong>skills</strong>: Resumen de tecnologías principales<br>
                        • <strong>cv</strong>: Información del Curriculum Vitae (Harvard/ATS)<br>
                        • <strong>contacto</strong>: Datos de contacto directo<br>
                        • <strong>clear</strong>: Limpiar pantalla del terminal
                    `;
                    break;
                case 'cv':
                case 'curriculum':
                case 'resume':
                    responseDiv.innerHTML = `
                        <strong>CV Formato Harvard ATS (PUCP - 9.° ciclo):</strong><br>
                        • Enfoque: Ciberseguridad, Infraestructura Cloud (AWS/Azure) y DevSecOps<br>
                        • Motor Transaccional: 100% consistencia, 20 hilos concurrentes, Pytest 92%<br>
                        • Cloud & Hardening: 80% reducción superficie expuesta, mitigación &lt; 15s con iptables<br>
                        • DevSecOps: 100% vulnerabilidades críticas en &lt; 4 min, Docker multi-stage 65% reducción<br>
                        • Tesis PFC 1: 0 pérdida offline, Wokwi ESP32, tope SBS S/ 3,000<br>
                        👉 <a href="javascript:void(0)" onclick="openCvModal()" style="color: var(--accent-cyan); text-decoration: underline;">Haz clic aquí para abrir el visor del CV</a>
                    `;
                    break;
                case 'whoami':
                    responseDiv.innerHTML = `Italo Mijail Ramos Diaz | Estudiante de 9.° ciclo de Ing. Informática (PUCP) | Enfoque: Ciberseguridad, Cloud y Backend.`;
                    break;
                case 'proyectos':
                case 'projects':
                    responseDiv.innerHTML = `
                        1. fintech-transaction-engine (FastAPI, PostgreSQL, Idempotencia)<br>
                        2. secure-cloud-infra (AWS VPC, IAM, Linux Hardening, Bash)<br>
                        3. layerforge-microservices (Spring Boot 3, Spring Cloud, Eureka)<br>
                        4. devsecops-pipeline (GitHub Actions, Docker non-root, SAST)
                    `;
                    break;
                case 'tesis':
                    responseDiv.innerHTML = `
                        Tesis PFC 1: Arquitectura Cloud-Native e IoT con sincronización asíncrona segura para transacciones desconectadas (AES-256, MQTT/TLS, PACELC, Wokwi ESP32).
                    `;
                    break;
                case 'skills':
                    responseDiv.innerHTML = `AWS, Azure, Linux, Python/FastAPI, Java/Spring, Docker, Bash, PostgreSQL, Git, Scrum SFC.`;
                    break;
                case 'contacto':
                case 'contact':
                    responseDiv.innerHTML = `
                        Correo: italomijail@gmail.com<br>
                        LinkedIn: linkedin.com/in/italo-mijail-ramos-diaz<br>
                        GitHub: github.com/italo04<br>
                        Tel: +51 940 770 077 (Lima, Perú)
                    `;
                    break;
                case 'clear':
                case 'cls':
                    // Limpiar salidas anteriores excepto el mensaje inicial
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// --- 4. COPIAR CORREO CON FEEDBACK VISUAL ---
function copyEmail() {
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

// --- 5. MENÚ MÓVIL ---
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
            });
        });
    }
}

// --- 6. SCROLL SPY PARA MARCAR SECCIÓN ACTIVA EN NAVBAR ---
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

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
