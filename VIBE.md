# NoteBro 📝
> Your note bro. Always there.

## The one-line pitch
A notes app that's already taking a note when you open it.

## The insight
Every other notes app makes you do something before you can write.
- TextEdit wants a file
- Apple Notes wants a heading
- Notion wants you to pick a template

NoteBro just starts. Cursor blinking. Go.

## The feeling
Not a productivity system. Not a workspace. Not a tool.
A bro who holds your notes. Chill. On your side. Never judging.
Slightly stupid name, works perfectly.

## Core experience
- Open it → already writing. No heading prompt. No file dialog. Just a cursor.
- Flick left/right to move between notes (index cards, not file system)
- Cute highlight colours (no bold, no h1, maybe markdown for the nerds who want it)
- Export whenever, no lock-in
- Share a note → someone else can write in it live (PartyKit)
- $9 one-time support → Passport → vault sync across devices

## Surface area
- **Web app** — PWA, works offline, passport sync
- **Mac menu bar app** — `⌘⇧Space` or similar, dropdown appears, already focused, close = saved. The TextEdit killer.
- **Browser extension** — grab text from anywhere into a note (same as TalkType extension pattern)
- **Shared notes** — PartyKit for live collab, or passport link for async share

## Tech stack (obvious choices)
- SvelteKit + adapter-node (same as TalkType/ZipList)
- Vault sync via existing passport system — `saveToVault('notebro', ...)`
- PartyKit for live shared notes
- Pi deploy via deploy_app.sh (already works)
- notebro.app domain

## What makes it Pablo
- No accounts required (passport optional)
- Local-first, works offline
- One-time $9 support, no subscription
- Has personality, not just features
- Menu bar version is the killer feature nobody else bothered to make feel good

## What it's NOT
- Not Notion
- Not a second brain
- Not a workspace
- Not trying to organize your life
- Not asking for your email

## Vibe captured
Melbourne, 1am, Monday night.
Built in the same session we built the vault, gave the Pi breathing room,
added holofoil to the passport card, and bought the domain on a whim.
That energy is the product.

## Status
- ✅ Domain registered: notebro.app (2026-05-25, Porkbun, ~$15/yr)
- 🔲 Cloudflare DNS
- 🔲 Scaffold
- 🔲 Deploy to Pi

---
*captured: 2026-05-26 ~01:00 AEST*
