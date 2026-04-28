#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { createHash } from "node:crypto";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const DEFAULT_CONFIG = {
  pollSeconds: 90,
  requestTimeoutSeconds: 20,
  requestSpacingSeconds: 2,
  stateFile: ".pokemon-center-watch-state.json",
  webhookUrl: "",
  webhookType: "auto",
  openProductPage: false,
  alertOnRestock: true,
  notifyInitial: false,
  maxProductsPerAlert: 10,
  targets: [
    {
      name: "Pokemon Center UK New Releases",
      url: "https://www.pokemoncenter.com/en-gb/category/new-releases",
      includeKeywords: [
        "pokemon tcg",
        "trading card game",
        "elite trainer box",
        "booster",
        "bundle",
        "mini tin",
        "collection",
        "battle deck",
        "card sleeves",
        "deck box",
        "playmat"
      ]
    },
    {
      name: "Pokemon Center UK TCG Search",
      url: "https://www.pokemoncenter.com/en-gb/search/tcg-cards"
    },
    {
      name: "Pokemon Center UK Elite Trainer Boxes",
      url: "https://www.pokemoncenter.com/en-gb/search/etb-pokemon-center",
      includeKeywords: ["elite trainer box"]
    }
  ],
  headers: {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "en-GB,en;q=0.9",
    "cache-control": "no-cache",
    pragma: "no-cache",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 " +
      "PokemonCenterReleaseWatcher/1.0 personal-notifier"
  }
};

const HELP_TEXT = `
Pokemon Center UK release watcher

Usage:
  npm run pokemon:watch
  npm run pokemon:check
  npm run pokemon:prime
  node scripts/pokemon-center-watch.mjs --once --notify-initial

Options:
  --once             Check once, then exit.
  --prime            Save the current product list without sending alerts.
  --notify-initial   Alert for products found when there is no saved state yet.
  --open             Open the first alert product page in your default browser.
  --no-open          Do not open product pages.
  --config <path>    Use a different config JSON file.
  --interval <sec>   Poll interval; minimum is 60 seconds.
  --help             Show this message.

Environment:
  POKEMON_WATCH_WEBHOOK_URL      Discord, Slack, ntfy, or generic webhook URL.
  POKEMON_WATCH_WEBHOOK_TYPE     auto, discord, slack, ntfy, or generic-json.
  POKEMON_WATCH_OPEN_BROWSER     true or false.
  POKEMON_WATCH_POLL_SECONDS     Poll interval; minimum is 60 seconds.
  POKEMON_WATCH_NOTIFY_INITIAL   true or false.
  POKEMON_WATCH_STATE_FILE       Override the state file path.
`.trim();

const cli = parseArgs(process.argv.slice(2));

if (cli.help) {
  console.log(HELP_TEXT);
  process.exit(0);
}

const config = await loadConfig(cli);
const statePath = resolveFromRoot(config.stateFile);
let state = await readJson(statePath, { version: 1, products: {}, lastCheckedAt: null });

if (cli.prime) {
  config.notifyInitial = false;
}

if (cli.once || cli.prime) {
  const result = await runCheck({ config, state, statePath, prime: cli.prime });
  process.exit(result.failedTargets.length > 0 ? 1 : 0);
}

console.log(`[${timestamp()}] Pokemon Center watcher started. Polling every ${config.pollSeconds}s.`);
console.log(`[${timestamp()}] State file: ${statePath}`);

while (true) {
  await runCheck({ config, state, statePath, prime: false });
  state = await readJson(statePath, state);
  const jitterMs = Math.round(Math.random() * 10_000);
  await delay(config.pollSeconds * 1000 + jitterMs);
}

async function runCheck({ config, state, statePath, prime }) {
  const now = new Date().toISOString();
  const hadProductsBefore = Object.keys(state.products ?? {}).length > 0;
  const alerts = [];
  const failedTargets = [];
  const scannedProducts = new Map();

  for (const [index, target] of config.targets.entries()) {
    if (index > 0) {
      await delay(config.requestSpacingSeconds * 1000);
    }

    try {
      const products = await checkTarget(target, config);
      console.log(
        `[${timestamp()}] ${target.name}: found ${products.length} matching product${products.length === 1 ? "" : "s"}.`
      );

      for (const product of products) {
        const existing = state.products?.[product.id];
        const merged = mergeProduct(existing, product, target.name, now);
        scannedProducts.set(product.id, merged);

        const isNewProduct = !existing;
        const restocked =
          config.alertOnRestock &&
          existing?.available === false &&
          product.available === true;

        if (prime) {
          continue;
        }

        if (isNewProduct && (hadProductsBefore || config.notifyInitial)) {
          alerts.push({ kind: "new", product: merged, source: target.name });
        } else if (restocked) {
          alerts.push({ kind: "restock", product: merged, source: target.name });
        }
      }
    } catch (error) {
      failedTargets.push({ target, error });
      console.error(`[${timestamp()}] ${target.name}: ${error.message}`);
    }
  }

  state.products = {
    ...(state.products ?? {}),
    ...Object.fromEntries(scannedProducts)
  };
  state.lastCheckedAt = now;

  if (scannedProducts.size > 0 || hadProductsBefore || failedTargets.length < config.targets.length) {
    await writeJson(statePath, state);
  }

  if (prime) {
    if (scannedProducts.size === 0 && failedTargets.length === config.targets.length) {
      console.log(
        `[${timestamp()}] Nothing was primed because every target failed. No product baseline was saved.`
      );
    } else {
      console.log(
        `[${timestamp()}] Primed ${scannedProducts.size} product record${scannedProducts.size === 1 ? "" : "s"}.`
      );
    }
    return { alerts: [], failedTargets };
  }

  if (!hadProductsBefore && !config.notifyInitial) {
    if (scannedProducts.size === 0 && failedTargets.length === config.targets.length) {
      console.log(
        `[${timestamp()}] No baseline saved because every target failed. Try again later or adjust targets.`
      );
    } else {
      console.log(
        `[${timestamp()}] Initial baseline saved. Future checks will alert only for new products or restocks.`
      );
    }
    return { alerts: [], failedTargets };
  }

  if (alerts.length === 0) {
    console.log(`[${timestamp()}] No new matching products or restocks.`);
    return { alerts, failedTargets };
  }

  await notify(alerts, config);
  if (config.openProductPage) {
    openUrl(alerts[0].product.url);
  }
  return { alerts, failedTargets };
}

async function checkTarget(target, config) {
  if (!target?.url || !target?.name) {
    throw new Error("Target must include name and url.");
  }

  const html = await fetchPage(target.url, config);
  const products = extractProducts(html, target.url)
    .filter((product) => matchesTarget(product, target))
    .sort((a, b) => a.title.localeCompare(b.title));

  return dedupeProducts(products);
}

async function fetchPage(url, config) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.requestTimeoutSeconds * 1000);
  timeout.unref?.();

  try {
    const response = await fetch(url, {
      headers: config.headers,
      redirect: "follow",
      signal: controller.signal
    });
    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    if (/incapsula|request unsuccessful|incident id|noindex,\s*nofollow|_Incapsula_Resource/i.test(text)) {
      throw new Error(
        "Pokemon Center returned an anti-bot/interstitial page. This watcher will not try to bypass it."
      );
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

function extractProducts(html, sourceUrl) {
  const products = new Map();

  for (const product of extractJsonLdProducts(html, sourceUrl)) {
    addProduct(products, product);
  }
  for (const product of extractAnchorProducts(html, sourceUrl)) {
    addProduct(products, product);
  }
  for (const product of extractUrlProducts(html, sourceUrl)) {
    addProduct(products, product);
  }

  return [...products.values()];
}

function extractJsonLdProducts(html, sourceUrl) {
  const products = [];
  const scriptPattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  for (const match of html.matchAll(scriptPattern)) {
    const rawJson = decodeHtml(match[1]).trim();
    if (!rawJson) {
      continue;
    }

    try {
      const parsed = JSON.parse(rawJson);
      visitJsonLd(parsed, products, sourceUrl);
    } catch {
      // Some pages contain non-product JSON-LD or escaped snippets. Other parsers still run.
    }
  }

  return products;
}

function visitJsonLd(node, products, sourceUrl) {
  if (!node) {
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((item) => visitJsonLd(item, products, sourceUrl));
    return;
  }

  if (typeof node !== "object") {
    return;
  }

  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  const normalizedTypes = types.filter(Boolean).map((type) => String(type).toLowerCase());

  if (normalizedTypes.includes("product")) {
    const offer = Array.isArray(node.offers) ? node.offers[0] : node.offers;
    const url = normalizeProductUrl(node.url ?? node["@id"], sourceUrl);
    if (url) {
      products.push({
        url,
        title: cleanTitle(node.name) ?? titleFromUrl(url),
        price: normalizePrice(offer?.price ? `GBP ${offer.price}` : ""),
        available: availabilityFromOffer(offer?.availability),
        isNew: false
      });
    }
  }

  if (node.itemListElement) {
    visitJsonLd(node.itemListElement, products, sourceUrl);
  }
  if (node.item) {
    visitJsonLd(node.item, products, sourceUrl);
  }
}

function extractAnchorProducts(html, sourceUrl) {
  const products = [];
  const anchorPattern = /<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(anchorPattern)) {
    const [tag, , href, body] = match;
    const url = normalizeProductUrl(href, sourceUrl);
    if (!url) {
      continue;
    }

    const start = Math.max(0, match.index - 900);
    const end = Math.min(html.length, match.index + tag.length + 900);
    const context = cleanText(html.slice(start, end));
    const title = cleanTitle(
      firstNonEmpty([getAttribute(tag, "aria-label"), getAttribute(tag, "title"), cleanText(body), titleFromUrl(url)])
    );

    products.push({
      url,
      title: title ?? titleFromUrl(url),
      price: normalizePrice(context),
      available: availabilityFromText(context),
      isNew: /\bnew!\b|\bnew\b/i.test(context)
    });
  }

  return products;
}

function extractUrlProducts(html, sourceUrl) {
  const products = [];
  const normalizedHtml = html
    .replace(/\\u002[fF]/g, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&");
  const productUrlPattern = /(?:https?:\/\/(?:www\.)?pokemoncenter\.com)?\/en-gb\/product\/[^"'<>\s)\\]+/gi;

  for (const match of normalizedHtml.matchAll(productUrlPattern)) {
    const rawUrl = match[0].replace(/[.,;]+$/g, "");
    const url = normalizeProductUrl(rawUrl, sourceUrl);
    if (!url) {
      continue;
    }

    const start = Math.max(0, match.index - 1400);
    const end = Math.min(normalizedHtml.length, match.index + rawUrl.length + 2200);
    const rawContext = normalizedHtml.slice(start, end);
    const context = cleanText(rawContext);
    const title = extractTitleFromContext(rawContext, context, url);

    products.push({
      url,
      title,
      price: normalizePrice(context),
      available: availabilityFromText(context),
      isNew: /\bnew!\b|\bnew\b/i.test(context)
    });
  }

  return products;
}

function addProduct(products, product) {
  const url = normalizeProductUrl(product.url, "https://www.pokemoncenter.com/en-gb/");
  if (!url) {
    return;
  }

  const id = productIdFromUrl(url);
  const previous = products.get(id);
  products.set(id, {
    id,
    url,
    title: cleanTitle(product.title) ?? previous?.title ?? titleFromUrl(url),
    price: product.price ?? previous?.price ?? null,
    available: product.available ?? previous?.available ?? null,
    isNew: Boolean(product.isNew ?? previous?.isNew)
  });
}

function dedupeProducts(products) {
  const map = new Map();
  products.forEach((product) => addProduct(map, product));
  return [...map.values()];
}

function matchesTarget(product, target) {
  const includeKeywords = target.includeKeywords ?? target.keywords ?? [];
  const excludeKeywords = target.excludeKeywords ?? [];
  const haystack = `${product.title} ${product.url}`.toLowerCase();

  if (
    includeKeywords.length > 0 &&
    !includeKeywords.some((keyword) => haystack.includes(String(keyword).toLowerCase()))
  ) {
    return false;
  }

  return !excludeKeywords.some((keyword) => haystack.includes(String(keyword).toLowerCase()));
}

function mergeProduct(existing, product, sourceName, now) {
  const sources = new Set([...(existing?.sources ?? []), sourceName]);
  const changed =
    existing &&
    (existing.title !== product.title ||
      existing.price !== product.price ||
      existing.available !== product.available ||
      existing.url !== product.url);

  return {
    id: product.id,
    title: product.title,
    url: product.url,
    price: product.price,
    available: product.available,
    isNew: product.isNew,
    sources: [...sources].sort(),
    firstSeenAt: existing?.firstSeenAt ?? now,
    lastSeenAt: now,
    lastChangedAt: changed ? now : existing?.lastChangedAt ?? now
  };
}

async function notify(alerts, config) {
  const limitedAlerts = alerts.slice(0, config.maxProductsPerAlert);
  const extraCount = alerts.length - limitedAlerts.length;
  const lines = limitedAlerts.map(({ kind, product }) => {
    const label = kind === "restock" ? "RESTOCK" : "NEW";
    const price = product.price ? ` - ${product.price}` : "";
    return `${label}: ${product.title}${price}\n${product.url}`;
  });

  if (extraCount > 0) {
    lines.push(`...and ${extraCount} more.`);
  }

  const message = `Pokemon Center UK alert\n\n${lines.join("\n\n")}`;
  process.stdout.write("\u0007");
  console.log(`\n${message}\n`);

  if (!config.webhookUrl) {
    return;
  }

  await sendWebhook(config.webhookUrl, config.webhookType, message, limitedAlerts);
}

async function sendWebhook(webhookUrl, webhookType, message, alerts) {
  const type = resolveWebhookType(webhookUrl, webhookType);
  let body;
  let headers = {};

  if (type === "discord") {
    headers["content-type"] = "application/json";
    body = JSON.stringify({
      content: message.slice(0, 1900),
      embeds: alerts.slice(0, 10).map(({ kind, product }) => ({
        title: `${kind === "restock" ? "Restock" : "New"}: ${product.title}`.slice(0, 256),
        url: product.url,
        description: product.price ?? undefined
      }))
    });
  } else if (type === "slack") {
    headers["content-type"] = "application/json";
    body = JSON.stringify({ text: message });
  } else if (type === "ntfy") {
    headers["content-type"] = "text/plain; charset=utf-8";
    headers.title = "Pokemon Center UK alert";
    body = message;
  } else {
    headers["content-type"] = "application/json";
    body = JSON.stringify({
      text: message,
      alerts: alerts.map(({ kind, product }) => ({ kind, product }))
    });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: HTTP ${response.status} ${response.statusText}`);
  }
}

function resolveWebhookType(webhookUrl, configuredType) {
  if (configuredType && configuredType !== "auto") {
    return configuredType;
  }

  if (/discord(?:app)?\.com\/api\/webhooks/i.test(webhookUrl)) {
    return "discord";
  }
  if (/hooks\.slack\.com/i.test(webhookUrl)) {
    return "slack";
  }
  if (/ntfy\.sh/i.test(webhookUrl)) {
    return "ntfy";
  }
  return "generic-json";
}

function openUrl(url) {
  const escapedUrl = url.replace(/'/g, "''");
  const command =
    process.platform === "win32"
      ? ["powershell.exe", ["-NoProfile", "-Command", `Start-Process '${escapedUrl}'`]]
      : process.platform === "darwin"
        ? ["open", [url]]
        : ["xdg-open", [url]];

  const child = spawn(command[0], command[1], {
    detached: true,
    stdio: "ignore"
  });
  child.unref();
}

function normalizeProductUrl(rawUrl, baseUrl) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return null;
  }

  const cleaned = decodeHtml(rawUrl)
    .replace(/\\u002[fF]/g, "/")
    .replace(/\\\//g, "/")
    .trim();

  try {
    const url = new URL(cleaned, baseUrl);
    if (!/pokemoncenter\.com$/i.test(url.hostname)) {
      return null;
    }
    if (!url.pathname.toLowerCase().includes("/en-gb/product/")) {
      return null;
    }
    url.hash = "";
    url.search = "";
    return url.toString();
  } catch {
    return null;
  }
}

function productIdFromUrl(url) {
  const parsed = new URL(url);
  const parts = parsed.pathname.split("/").filter(Boolean);
  const productIndex = parts.findIndex((part) => part.toLowerCase() === "product");
  const sku = parts[productIndex + 1];

  if (sku) {
    return sku.toLowerCase();
  }

  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

function titleFromUrl(url) {
  const parsed = new URL(url);
  const parts = parsed.pathname.split("/").filter(Boolean);
  const productIndex = parts.findIndex((part) => part.toLowerCase() === "product");
  const slug = parts[productIndex + 2] ?? parts[productIndex + 1] ?? "pokemon-center-product";

  return slug
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\bpokemon\b/gi, "Pokemon")
    .replace(/\btcg\b/gi, "TCG")
    .replace(/\bvmax\b/gi, "VMAX")
    .replace(/\bex\b/gi, "ex")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bTCG\b/i, "TCG")
    .replace(/\bVMAX\b/i, "VMAX");
}

function extractTitleFromContext(rawContext, cleanContext, url) {
  const fields = ["productName", "displayName", "name", "title", "aria-label", "alt"];
  for (const field of fields) {
    const pattern = new RegExp(`["']${field}["']\\s*[:=]\\s*["']([^"']{3,220})["']`, "i");
    const match = rawContext.match(pattern);
    const title = cleanTitle(match?.[1]);
    if (title && looksLikeProductTitle(title)) {
      return title;
    }
  }

  const productTitle = cleanContext.match(
    /\b((?:new!\s*)?Pokemon\s+TCG:[^|]{5,180}|[^|]{0,80}Elite Trainer Box[^|]{0,100}|[^|]{0,80}Booster[^|]{0,100})/i
  );
  const title = cleanTitle(productTitle?.[1]);
  if (title && looksLikeProductTitle(title)) {
    return title;
  }

  return titleFromUrl(url);
}

function looksLikeProductTitle(title) {
  const lower = title.toLowerCase();
  if (lower.includes("pokemon center uk official site")) {
    return false;
  }
  if (lower === "pokemon center") {
    return false;
  }
  return /pokemon|tcg|booster|elite trainer|collection|tin|deck|sleeves|playmat|binder/i.test(title);
}

function availabilityFromOffer(availability) {
  if (!availability) {
    return null;
  }

  const normalized = String(availability).toLowerCase();
  if (normalized.includes("outofstock") || normalized.includes("soldout")) {
    return false;
  }
  if (normalized.includes("instock") || normalized.includes("preorder")) {
    return true;
  }
  return null;
}

function availabilityFromText(text) {
  const lower = text.toLowerCase();
  if (/\bsold out\b|outofstock|out of stock|unavailable/.test(lower)) {
    return false;
  }
  if (/\bin stock\b|add to cart|pre-order|preorder|quantity/.test(lower)) {
    return true;
  }
  return null;
}

function normalizePrice(text) {
  if (!text) {
    return null;
  }

  const match = String(text).match(/(?:\u00a3|GBP)\s?\d+(?:[.,]\d{2})?/i);
  if (!match) {
    return null;
  }

  return match[0].replace(/\u00a3\s?/g, "GBP ").replace(/\s+/g, " ").trim();
}

function cleanTitle(value) {
  const text = cleanText(value)
    .replace(/^new!\s*/i, "")
    .replace(/\s+\|\s+Pokemon Center UK Official Site$/i, "")
    .trim();

  return text.length >= 3 ? text : null;
}

function cleanText(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return decodeHtml(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&pound;/gi, "GBP ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&ndash;|&mdash;/gi, "-");
}

function getAttribute(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i");
  const match = tag.match(pattern);
  return decodeHtml(match?.[1] ?? match?.[2] ?? "");
}

function firstNonEmpty(values) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0) ?? "";
}

async function loadConfig(cli) {
  const configPath = resolveFromRoot(cli.config ?? "pokemon-center-watch.config.json");
  const fileConfig = existsSync(configPath) ? await readJson(configPath, {}) : {};
  const merged = {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...(fileConfig.headers ?? {})
    },
    targets: fileConfig.targets ?? DEFAULT_CONFIG.targets
  };

  merged.webhookUrl = process.env.POKEMON_WATCH_WEBHOOK_URL ?? merged.webhookUrl;
  merged.webhookType = process.env.POKEMON_WATCH_WEBHOOK_TYPE ?? merged.webhookType;
  merged.stateFile = process.env.POKEMON_WATCH_STATE_FILE ?? merged.stateFile;
  merged.openProductPage = envBoolean("POKEMON_WATCH_OPEN_BROWSER", merged.openProductPage);
  merged.notifyInitial = envBoolean("POKEMON_WATCH_NOTIFY_INITIAL", merged.notifyInitial);
  merged.pollSeconds = Number(process.env.POKEMON_WATCH_POLL_SECONDS ?? cli.interval ?? merged.pollSeconds);

  if (cli.notifyInitial) {
    merged.notifyInitial = true;
  }
  if (cli.open === true) {
    merged.openProductPage = true;
  }
  if (cli.open === false) {
    merged.openProductPage = false;
  }

  merged.pollSeconds = Math.max(60, Math.round(Number(merged.pollSeconds) || DEFAULT_CONFIG.pollSeconds));
  merged.requestTimeoutSeconds = Math.max(
    5,
    Math.round(Number(merged.requestTimeoutSeconds) || DEFAULT_CONFIG.requestTimeoutSeconds)
  );
  merged.requestSpacingSeconds = Math.max(
    1,
    Math.round(Number(merged.requestSpacingSeconds) || DEFAULT_CONFIG.requestSpacingSeconds)
  );
  merged.maxProductsPerAlert = Math.max(
    1,
    Math.round(Number(merged.maxProductsPerAlert) || DEFAULT_CONFIG.maxProductsPerAlert)
  );

  if (!Array.isArray(merged.targets) || merged.targets.length === 0) {
    throw new Error("Config must include at least one target.");
  }

  return merged;
}

function parseArgs(args) {
  const parsed = {
    once: false,
    prime: false,
    notifyInitial: false,
    open: null,
    config: null,
    interval: null,
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--once") {
      parsed.once = true;
    } else if (arg === "--prime") {
      parsed.prime = true;
      parsed.once = true;
    } else if (arg === "--notify-initial") {
      parsed.notifyInitial = true;
    } else if (arg === "--open") {
      parsed.open = true;
    } else if (arg === "--no-open") {
      parsed.open = false;
    } else if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--config") {
      parsed.config = args[index + 1];
      index += 1;
    } else if (arg.startsWith("--config=")) {
      parsed.config = arg.slice("--config=".length);
    } else if (arg === "--interval") {
      parsed.interval = args[index + 1];
      index += 1;
    } else if (arg.startsWith("--interval=")) {
      parsed.interval = arg.slice("--interval=".length);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return parsed;
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return fallback;
    }
    throw error;
  }
}

async function writeJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function resolveFromRoot(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(rootDir, filePath);
}

function envBoolean(name, fallback) {
  const value = process.env[name];
  if (value == null || value === "") {
    return fallback;
  }
  return /^(1|true|yes|on)$/i.test(value);
}

function timestamp() {
  return new Date().toLocaleString("en-GB", { hour12: false });
}
