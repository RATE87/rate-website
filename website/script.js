const formHandler = () => {
  const form = document.querySelector(".signup-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const button = form.querySelector("button");

    if (!input || !button) return;

    button.textContent = input.value.trim() ? "You're on the list" : "Add your email first";
  });
};

const menuHandler = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
};

const renderHeader = (pageKey, navItems) => {
  const header = document.querySelector("#site-header");
  if (!header) return;

  header.innerHTML = `
    <a class="brand" href="./index.html" aria-label="RATE home">
      <span class="brand-mark">RATE</span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="nav" id="site-nav">
      ${navItems.map((item) => `<a href="${item.href}"${item.key === pageKey ? ' aria-current="page"' : ""}>${item.label}</a>`).join("")}
      <a class="nav-cta" href="./community.html">Join Community</a>
    </nav>
  `;
};

const renderFooter = (navItems, tagline) => {
  const footer = document.querySelector("#site-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div>
      <strong class="footer-brand">RATE</strong>
      <p>${tagline}</p>
    </div>
    <div class="footer-links">
      ${navItems.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
      <a href="./index.html#newsletter">Newsletter</a>
    </div>
  `;
};

const renderChipRow = (chips) => `
  <div class="chip-row">
    ${chips.map((chip) => `<span>${chip}</span>`).join("")}
  </div>
`;

const renderHome = (page) => `
  <section class="hero hero-home">
    <div class="hero-copy">
      <p class="eyebrow">${page.hero.eyebrow}</p>
      <h1>Building the <span class="gradient-text">${page.hero.gradientWord}</span> neurodivergent people should have had all along.</h1>
      <p class="hero-text">${page.hero.summary}</p>
      <div class="hero-actions">
        ${page.hero.actions.map((action) => `<a class="button button-${action.type}" href="${action.href}">${action.label}</a>`).join("")}
      </div>
      ${renderChipRow(page.hero.pills)}
    </div>
    <div class="hero-visual">
      <div class="hero-orbit">
        <div class="hero-orbit-core">
          <span class="hero-kicker">RATE</span>
          <strong>Shop</strong>
          <strong>Toolkit</strong>
          <strong>Community</strong>
        </div>
        ${page.hero.sideCards.map((card) => `
          <article class="hero-floating hero-floating-${card.tone}">
            <h3>${card.title}</h3>
            <p>${card.text}</p>
          </article>
        `).join("")}
      </div>
    </div>
  </section>

  <section class="section pillars-grid">
    ${page.pillars.map((card) => `
      <article class="feature-card feature-card-${card.accent}">
        <span class="feature-icon">${card.icon}</span>
        <h3>${card.title}</h3>
        <p>${card.text}</p>
        <a class="text-link" href="${card.href}">Explore →</a>
      </article>
    `).join("")}
  </section>

  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">Featured Products</p>
      <h2>Mission-led pieces with a bold visual identity.</h2>
    </div>
    <div class="grid-3">
      ${page.products.map((product) => `
        <article class="product-card">
          <div class="product-art product-art-${product.tone}"></div>
          <p class="product-meta">${product.category}</p>
          <h3>${product.name}</h3>
          <div class="product-row">
            <strong>${product.price}</strong>
            <a class="text-link" href="./shop.html">View</a>
          </div>
        </article>
      `).join("")}
    </div>
  </section>

  <section class="section">
    <div class="section-heading">
      <p class="eyebrow">From The Toolkit</p>
      <h2>Free resources people can actually use.</h2>
    </div>
    <div class="grid-3">
      ${page.resources.map((resource) => `
        <article class="resource-card">
          <span class="pill pill-${resource.accent}">${resource.pillar}</span>
          <h3>${resource.title}</h3>
          <p>${resource.text}</p>
          <a class="text-link" href="./toolkit.html">Browse resource →</a>
        </article>
      `).join("")}
    </div>
  </section>

  <section class="section dark-panel">
    <div class="dark-panel-copy">
      <p class="eyebrow eyebrow-light">Community</p>
      <h2>${page.community.heading}</h2>
      <p>${page.community.text}</p>
      <a class="button button-primary" href="./community.html">Join the Community</a>
    </div>
    <div class="stats-strip">
      ${page.community.stats.map((stat) => `
        <article>
          <strong>${stat.value}</strong>
          <span>${stat.label}</span>
        </article>
      `).join("")}
    </div>
  </section>

  <section class="section newsletter-shell" id="newsletter">
    <div class="newsletter-card">
      <div>
        <p class="eyebrow">Newsletter</p>
        <h2>Stay close to the launch.</h2>
        <p>Get updates on new toolkit drops, shop releases, and community openings.</p>
      </div>
      <form class="signup-form">
        <label class="sr-only" for="email">Email address</label>
        <input id="email" name="email" type="email" placeholder="Email address">
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </section>
`;

const renderStandard = (page) => `
  <section class="page-head">
    <div class="page-head-copy">
      <p class="eyebrow">RATE</p>
      <h1>${page.heading}</h1>
      <p class="page-summary">${page.summary}</p>
      ${renderChipRow(page.chips)}
    </div>
    <div class="page-hero-panel">
      ${page.panels.map((panel) => `
        <article class="info-panel">
          <p class="eyebrow">${panel.eyebrow}</p>
          <h3>${panel.title}</h3>
          <p>${panel.text}</p>
        </article>
      `).join("")}
    </div>
  </section>

  <section class="section grid-3">
    ${page.cards.map((card) => `
      <article class="template-card">
        <p class="eyebrow">${card.eyebrow}</p>
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      </article>
    `).join("")}
  </section>

  <section class="section statement-band">
    <h2>Prototype note</h2>
    <p>This is the visual direction preview. In the final Next.js build these sections will be powered by Printify, Sanity, Beehiiv, and the App Router structure from your brief.</p>
  </section>
`;

const renderPage = () => {
  const pageKey = document.body.dataset.page;
  const content = window.siteContent;
  const root = document.querySelector("#page-root");
  const page = content.pages[pageKey];

  if (!root || !page) return;

  renderHeader(pageKey, content.nav);
  renderFooter(content.nav, content.footerTagline);
  root.innerHTML = pageKey === "home" ? renderHome(page) : renderStandard(page);

  formHandler();
  menuHandler();
};

renderPage();
