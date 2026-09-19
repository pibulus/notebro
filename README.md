# NoteBro 📝

> **Your note bro. Always there.**  
> A notes app that's already taking a note when you open it. No headers, no folders, no template dialogs. Just a blinking cursor on an index card.

---

## ⚡️ The Insight

Every other notes app forces a ritual before you can write:
- **TextEdit** wants a file name and folder destination.
- **Apple Notes** wants an H1 title heading.
- **Notion** wants you to pick a database template.

**NoteBro just starts.** The moment the window appears, the cursor is already blinking. You type, you flick between cards, you close it. Everything is auto-saved locally. Zero cognitive friction.

---

## 🎨 Core Features

- **Blazing Fast Scratchpad**: Open → blinking cursor → write.
- **Index Card Flicking**: Horizontal card deck. Jump between cards with `⌥←` and `⌥→` (or on-screen chevrons).
- **5 Pastel Highlighters**: Butter Yellow, Mint Cream, Lavender Haze, Peachy Keen, and Sky Blue.
- **Zero Lock-In Export**: One click to copy all cards as clean Markdown, download a `.md` bundle, or export raw JSON.
- **Local-First Privacy**: Your notes stay in your browser / on your Mac. No tracking, no ads, no cloud snooping.
- **Digital Cartridge ($19 AUD)**: Buy once, own forever. One-time payment via Square. No monthly SaaS rent.

---

## 🛠️ Tech Stack

- **SvelteKit 2** + **Vite 6**
- **Tailwind CSS 3** + **DaisyUI**
- **Adapter**: `@sveltejs/adapter-node` (production build ready for Raspberry Pi deploy via Port 9015 / Cloudflare Tunnel)
- **Design System**: Soft Neo Toybrut / Pastel-punk with chunky borders (`shadow-brutal`), cream paper (`#fffaf0`), and warm ink (`#1e1714`).

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Run dev server on port 9015
npm run dev

# Production build
npm run build

# Preview build locally
npm run preview
```

---

##  The NoteBro Ecosystem

1. **Web / PWA** (`apps/notebro`): Full browser & mobile index card deck.
2. **Mac Menu Bar App** (`mac/notebro-mac`): Native Swift menu bar companion with global hotkey (`⌥Space`), instant popover focus, and local filesystem sync.
3. **Browser Extension** (`apps/notebro_extension`): Quick text capture from any webpage straight into your card deck.

---

*Part of the pibulus indie digital cartridge suite.*
