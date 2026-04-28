# Pokemon Center UK Watcher

This is a personal release/restock notifier for Pokemon Center UK product pages. It checks public product listing pages at a respectful interval, saves a local baseline, and alerts when a matching product appears for the first time or changes from sold out to available.

It does not automate checkout, queue handling, CAPTCHA, account login, cart actions, or anti-bot bypassing.

## Quick Start

1. Prime the baseline so existing products do not spam you:

   ```powershell
   npm run pokemon:prime
   ```

2. Run the watcher:

   ```powershell
   npm run pokemon:watch
   ```

3. For a one-off check:

   ```powershell
   npm run pokemon:check
   ```

The watcher stores seen products in `.pokemon-center-watch-state.json`.

On this Windows machine, PowerShell blocked `npm.ps1`. If you see that error, use `npm.cmd run pokemon:prime`, `npm.cmd run pokemon:watch`, or `npm.cmd run pokemon:check` instead.

## Always-On Monitoring

`npm.cmd run pokemon:watch` keeps running until you close the terminal. For a simple double-click runner, use:

```powershell
scripts\run-pokemon-watch.cmd
```

To install it as a Windows login task:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\install-pokemon-watch-task.ps1
Start-ScheduledTask -TaskName "Pokemon Center UK Watcher"
```

That makes the watcher continuous from your computer's side. It still checks Pokemon Center on a cadence because normal product pages do not push a live "new product" event to visitors.

## Phone Alerts

The fastest simple setup is usually a Discord webhook:

1. Create a private Discord channel.
2. Open channel settings, then Integrations, then Webhooks.
3. Create a webhook and copy its URL.
4. Add it to `.env.local`:

   ```env
   POKEMON_WATCH_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ```

Slack webhooks, ntfy topic URLs, and generic JSON webhooks are also supported. You can force the format with:

```env
POKEMON_WATCH_WEBHOOK_TYPE=discord
```

Supported values are `auto`, `discord`, `slack`, `ntfy`, and `generic-json`.

## Settings

Edit `pokemon-center-watch.config.json` to change watched pages or keywords.

Useful `.env.local` overrides:

```env
POKEMON_WATCH_POLL_SECONDS=90
POKEMON_WATCH_OPEN_BROWSER=false
POKEMON_WATCH_NOTIFY_INITIAL=false
POKEMON_WATCH_STATE_FILE=.pokemon-center-watch-state.json
```

The poll interval has a hard minimum of 60 seconds. If Pokemon Center returns an anti-bot/interstitial page, the watcher reports that and stops short of trying to bypass it.

If every target fails with `HTTP 403` or an anti-bot/interstitial message, the watcher will not save an empty baseline. In that case, try running it from your normal home connection later, reduce the number of targets, or rely on Pokemon Center's official email updates as a backup.

## Manual Checkout

If you want the product page to open when an alert is detected:

```powershell
node scripts/pokemon-center-watch.mjs --open
```

That still leaves checkout fully manual.
