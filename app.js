/**
 * UrbanSitter Audience Segmentation - Interactive Application Logic
 * Academic Project by Valentina Ramirez Lozano (Pontificia Universidad Javeriana Cali)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroPerspectiveToggle();
  initDimensionsMatrix();
  initMailchimpSimulator();
  initAcademicModal();
  initMobileMenu();
});

/* ==========================================================================
   1. HERO PERSPECTIVE TOGGLE (PADRES VS NIÑERAS)
   ========================================================================== */
function initHeroPerspectiveToggle() {
  const toggleContainer = document.getElementById('heroAudienceToggle');
  const insightIcon = document.getElementById('heroInsightIcon');
  const insightTitle = document.getElementById('heroInsightTitle');
  const insightText = document.getElementById('heroInsightText');
  const insightBox = document.getElementById('heroInsightBox');

  if (!toggleContainer) return;

  const perspectives = {
    padres: {
      icon: '<i class="fa-solid fa-shield-heart text-lg"></i>',
      iconClass: 'bg-teal-subtle text-teal',
      title: 'Padres: Foco en Confianza y Ahorro de Tiempo',
      text: 'Profesionales de 25-45 años en áreas metropolitanas densas que necesitan agilidad para coordinar el cuidado de sus hijos mediante recomendaciones validadas por su comunidad.'
    },
    nineras: {
      icon: '<i class="fa-solid fa-user-graduate text-lg"></i>',
      iconClass: 'bg-coral-subtle text-coral',
      title: 'Niñeras: Foco en Flexibilidad e Independencia',
      text: 'Jóvenes y estudiantes de 18-30 años que buscan ingresos flexibles bajo demanda, respondiendo rápidamente a solicitudes desde su smartphone.'
    }
  };

  toggleContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.audience-tab');
    if (!btn) return;

    toggleContainer.querySelectorAll('.audience-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.dataset.target;
    const data = perspectives[target];

    if (data && insightBox) {
      insightBox.style.opacity = '0';
      insightBox.style.transform = 'translateY(4px)';

      setTimeout(() => {
        insightIcon.className = `insight-icon-box ${data.iconClass}`;
        insightIcon.innerHTML = data.icon;
        insightTitle.textContent = data.title;
        insightText.textContent = data.text;

        insightBox.style.opacity = '1';
        insightBox.style.transform = 'translateY(0)';
      }, 150);
    }
  });
}

/* ==========================================================================
   2. 4 DIMENSIONS OF SEGMENTATION (EXACT CONTENT FROM PDF)
   ========================================================================== */
const dimensionsData = {
  demografico: {
    title: 'Dimensión 1: Perfil Demográfico',
    icon: 'fa-users',
    color: 'teal',
    conozco: 'Padres profesionales (25-45 años) y niñeras jóvenes (18-30 años).',
    investigar: 'Nivel socioeconómico exacto y composición familiar (número y edades específicas de los hijos).',
    metodos: 'Reporte de We Are Social (Digital 2026) sobre el perfil del internauta en EE. UU. y recolección de first-party data directamente en el formulario de registro.',
    tags: ['Edad: 25-45', 'Edad: 18-30', 'First-Party Form Data', 'We Are Social 2026']
  },
  geografico: {
    title: 'Dimensión 2: Perfil Geográfico',
    icon: 'fa-map-location-dot',
    color: 'emerald',
    conozco: 'Residen en áreas metropolitanas densas de Estados Unidos (ciudades principales con alto ritmo laboral).',
    investigar: 'Códigos postales (ZIP Codes) específicos con mayor demanda de cuidado infantil frente a zonas universitarias con concentración de oferta.',
    metodos: 'Búsqueda territorial en Claritas ZIP Code Look-up para identificar clústeres geográficos de alto valor y geolocalización en la app.',
    tags: ['Áreas Metropolitanas EE. UU.', 'Claritas ZIP Lookup', 'Clústeres de Demanda', 'Zonas Universitarias']
  },
  psicografico: {
    title: 'Dimensión 3: Perfil Psicográfico (y TIC)',
    icon: 'fa-brain',
    color: 'coral',
    conozco: 'Los padres valoran la confianza, la tranquilidad y el ahorro de tiempo; las niñeras buscan independencia económica y flexibilidad horaria.',
    investigar: 'Redes sociales preferidas para captación, canales de mensajería favoritos y detonantes de retención.',
    metodos: 'Analíticas de consumo digital en el reporte de We Are Social y encuestas breves de satisfacción post-servicio dentro de la plataforma.',
    tags: ['Valor: Confianza', 'Valor: Independencia', 'Encuestas Post-Servicio', 'Consumo Digital']
  },
  conductual: {
    title: 'Dimensión 4: Perfil Conductual',
    icon: 'fa-arrow-pointer',
    color: 'indigo',
    conozco: 'Interacción puramente transaccional y móvil (búsqueda, reserva, chat y pago realizados desde el smartphone).',
    investigar: 'Frecuencia de reserva (padres semanales vs. estacionales) y tasa de respuesta y aceptación (niñeras).',
    metodos: 'Uso de etiquetas (tags) automatizadas y segmentación por historial de interacción/aperturas dentro del CRM de Mailchimp.',
    tags: ['100% Mobile App', 'Historial Transaccional', 'Tags en Mailchimp', 'Tasa de Respuesta']
  }
};

function initDimensionsMatrix() {
  const tabsContainer = document.getElementById('dimensionTabs');
  const contentContainer = document.getElementById('dimensionContent');

  if (!tabsContainer || !contentContainer) return;

  function renderDimension(dimKey) {
    const dim = dimensionsData[dimKey];
    if (!dim) return;

    contentContainer.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-4 space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-subtle text-teal-rich font-bold text-xs">
            <i class="fa-solid ${dim.icon}"></i> ${dim.title}
          </div>
          <h3 class="font-display font-extrabold text-2xl text-main">Análisis Estratégico de la Dimensión</h3>
          <p class="text-xs sm:text-sm text-secondary leading-relaxed">
            Metodología aplicada para contrastar el conocimiento existente con las oportunidades de investigación empírica.
          </p>
          <div class="flex flex-wrap gap-1.5 pt-2">
            ${dim.tags.map(t => `<span class="px-2.5 py-1 bg-surface-raised border border-subtle rounded-md text-[11px] font-mono text-secondary">${t}</span>`).join('')}
          </div>
        </div>

        <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Lo que conozco -->
          <div class="p-5 rounded-2xl bg-surface-raised border border-subtle space-y-3">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <i class="fa-solid fa-circle-check"></i> Lo que conozco
            </div>
            <p class="text-xs sm:text-sm text-main font-medium leading-relaxed">
              ${dim.conozco}
            </p>
          </div>

          <!-- Por investigar -->
          <div class="p-5 rounded-2xl bg-surface-raised border border-subtle space-y-3">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <i class="fa-solid fa-circle-question"></i> Por investigar
            </div>
            <p class="text-xs sm:text-sm text-main font-medium leading-relaxed">
              ${dim.investigar}
            </p>
          </div>

          <!-- Métodos y Fuentes -->
          <div class="p-5 rounded-2xl bg-teal-subtle/50 border border-teal-border space-y-3">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-rich">
              <i class="fa-solid fa-magnifying-glass-chart"></i> Métodos & Fuentes
            </div>
            <p class="text-xs sm:text-sm text-teal-rich font-medium leading-relaxed">
              ${dim.metodos}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // Initial render
  renderDimension('demografico');

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.dim-pill');
    if (!btn) return;

    tabsContainer.querySelectorAll('.dim-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const dimKey = btn.dataset.dim;
    renderDimension(dimKey);
  });
}

/* ==========================================================================
   3. MAILCHIMP CAMPAIGN SIMULATOR (LIVE EMAIL PREVIEW)
   ========================================================================== */
const campaignsData = {
  padres_recurrentes: {
    recipient: 'laura.m@sanfrancisco-parents.com',
    subject: 'Tu niñera favorita tiene horas disponibles este viernes 🎉',
    query: `Segment: [ROLE = "Padre"] AND [BOOKINGS >= 4 / month] AND [LAST_ACTIVE <= 7 days]`,
    openRate: '52.4%',
    clickRate: '21.8%',
    badge: 'Fidelización & Lealtad',
    headline: '¡Hola Laura! Asegura tu fin de semana sin preocupaciones.',
    bodyCopy: 'Sabemos que los viernes por la noche son sagrados. Sarah D. (tu niñera con 5 estrellas y 14 servicios completados con tu familia) acaba de abrir disponibilidad para este fin de semana.',
    offerBox: {
      title: 'Beneficio de Lealtad Activo',
      desc: 'Como miembro recurrente, tu reserva tiene tarifa de servicio bonificada del 100% al reservar con 48h de anticipación.',
      cta: 'Reservar con Sarah en 1-Click'
    }
  },
  padres_ocasionales: {
    recipient: 'carlos.g@metroparents.org',
    subject: 'San Valentín se acerca ❤️ ¡Reserva a tu niñera antes de que se agoten!',
    query: `Segment: [ROLE = "Padre"] AND [BOOKINGS < 2 / quarter] AND [SEASONAL_TRIGGER = "Holiday"]`,
    openRate: '41.6%',
    clickRate: '15.3%',
    badge: 'Campaña Estacional',
    headline: 'Planea tu noche especial con total tranquilidad.',
    bodyCopy: 'El 14 de febrero las niñeras con mejores calificaciones se reservan con hasta 2 semanas de anticipación en tu código postal. No dejes tu velada para última hora.',
    offerBox: {
      title: 'Disponibilidad Garantizada en tu Zona',
      desc: 'Encuentra cuidadores verificados con verificación de antecedentes y referencias de otras familias de tu vecindario.',
      cta: 'Explorar Niñeras Disponibles'
    }
  },
  nineras_activas: {
    recipient: 'camila.sitter@college.edu',
    subject: '¡Felicidades Camila! Has desbloqueado la insignia "Top Caregiver" 🌟',
    query: `Segment: [ROLE = "Niñera"] AND [RESPONSE_TIME < 15 min] AND [RATING >= 4.9]`,
    openRate: '64.2%',
    clickRate: '28.0%',
    badge: 'Incentivos & Gamificación',
    headline: 'Tu compromiso marca la diferencia en UrbanSitter.',
    bodyCopy: 'Gracias a tu impecable tasa de respuesta menor a 15 minutos y 100% de calificaciones de 5 estrellas, tu perfil ahora aparece destacado en las búsquedas prioritarias de padres recurrentes.',
    offerBox: {
      title: 'Bono de Horas Pico Disponible',
      desc: 'Gana $5 USD extra por hora en servicios nocturnos este sábado en la zona metropolitana central.',
      cta: 'Activar Disponibilidad de Fin de Semana'
    }
  },
  nineras_esporadicas: {
    recipient: 'elena.student@university.edu',
    subject: '¡El verano comenzó! ☀️ Gana hasta $800/semana con familias de tu red',
    query: `Segment: [ROLE = "Niñera"] AND [LAST_ACTIVE > 60 days] AND [SEASON_TAG = "Summer"]`,
    openRate: '38.9%',
    clickRate: '14.1%',
    badge: 'Reactivación Estacional',
    headline: 'Familias cerca de ti necesitan cuidado infantil durante el receso.',
    bodyCopy: 'Las clases han terminado y la demanda de niñeras de día completo en tu código postal ha subido un 75%. Reactiva tu calendario en 2 minutos y recibe solicitudes de inmediato.',
    offerBox: {
      title: 'Reactivación Rápida de Perfil',
      desc: 'Tus certificaciones y referencias continúan vigentes. Solo actualiza tu horario disponible para recibir ofertas.',
      cta: 'Actualizar Mi Calendario de Verano'
    }
  }
};

function initMailchimpSimulator() {
  const simButtons = document.querySelectorAll('.sim-selector-btn');
  const ruleBox = document.getElementById('simRuleBox');
  const openRateEl = document.getElementById('simOpenRate');
  const clickRateEl = document.getElementById('simClickRate');
  const emailRecipient = document.getElementById('emailRecipient');
  const emailSubject = document.getElementById('emailSubject');
  const emailBody = document.getElementById('emailBody');

  if (!simButtons.length || !emailBody) return;

  function updateCampaign(campaignKey) {
    const data = campaignsData[campaignKey];
    if (!data) return;

    // Update Simulator Controls
    if (ruleBox) ruleBox.innerHTML = `<code>${data.query}</code>`;
    if (openRateEl) openRateEl.textContent = data.openRate;
    if (clickRateEl) clickRateEl.textContent = data.clickRate;

    // Update Email Mockup
    if (emailRecipient) emailRecipient.textContent = data.recipient;
    if (emailSubject) emailSubject.textContent = data.subject;

    emailBody.innerHTML = `
      <div class="space-y-4">
        <div class="inline-block px-2.5 py-1 rounded bg-teal-subtle text-teal-rich font-bold text-[11px] uppercase tracking-wide">
          ${data.badge}
        </div>
        <h2 class="font-display font-bold text-xl text-slate-900 leading-snug">
          ${data.headline}
        </h2>
        <p class="text-sm text-slate-700 leading-relaxed">
          ${data.bodyCopy}
        </p>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div class="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <i class="fa-solid fa-gift text-teal"></i> ${data.offerBox.title}
          </div>
          <p class="text-xs text-slate-600">
            ${data.offerBox.desc}
          </p>
        </div>

        <div class="pt-2">
          <button class="w-full sm:w-auto px-6 py-3 bg-teal text-white font-bold text-sm rounded-xl shadow-md hover:bg-teal-rich transition-all flex items-center justify-center gap-2">
            <span>${data.offerBox.cta}</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>
    `;
  }

  // Initial Simulator State
  updateCampaign('padres_recurrentes');

  simButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      simButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.campaign;
      updateCampaign(key);
    });
  });
}

// Global function to trigger simulator from Section 3 cards
window.openSegmentSimulator = function(segmentKey) {
  const targetBtn = document.querySelector(`.sim-selector-btn[data-campaign="${segmentKey}"]`);
  if (targetBtn) {
    targetBtn.click();
    const simSection = document.getElementById('simulador');
    if (simSection) {
      simSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

/* ==========================================================================
   4. ACADEMIC MODAL (FICHA TÉCNICA)
   ========================================================================== */
function initAcademicModal() {
  const btnOpen = document.getElementById('btnOpenDocModal');
  const btnClose = document.getElementById('btnCloseDocModal');
  const modal = document.getElementById('docModal');

  if (!btnOpen || !modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. MOBILE MENU TOGGLE & SMOOTH CLOSURE
   ========================================================================== */
function initMobileMenu() {
  const btnToggle = document.getElementById('btnMobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!btnToggle || !mobileMenu) return;

  btnToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      btnToggle.innerHTML = '<i class="fa-solid fa-xmark text-sm"></i>';
    } else {
      mobileMenu.classList.add('hidden');
      btnToggle.innerHTML = '<i class="fa-solid fa-bars text-sm"></i>';
    }
  });

  // Automatically close mobile menu when a nav link is clicked
  mobileMenu.querySelectorAll('.mobile-nav-item').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      btnToggle.innerHTML = '<i class="fa-solid fa-bars text-sm"></i>';
    });
  });
}
