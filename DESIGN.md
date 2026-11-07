# Laddu Gopal Enterprise — design system

A small gate, grill and railing workshop on Jatal Road, Panipat. Visitors are local
homeowners, mostly on phones, who want a rate. The site should feel like the workshop:
flat steel, clear signboard lettering, one spark of orange. Not a tech startup.

## Direction

- **Material:** sheet steel and charcoal. Flat panels, thin 1px lines, small 4px radius.
  No glass, blur, glow, or gradient text.
- **Signature:** the bolted nameplate (`.plate`): four bolt heads drawn at the corners.
  Use it once per page (the Home CTA). Its value comes from being rare.
- **Motion:** one authored moment, the welding sparks in the desktop hero
  (`HeroSparks.jsx`). It is off on phones and for reduced-motion. Everything else is static
  apart from hover/focus feedback and the modal fade.
- **Copy:** simple Hinglish in Roman script. Say what is made, where, and how to contact.
  No certifications, project counts, years, or awards unless the owner confirms them.

## Tokens (src/index.css)

| Role | Dark (default) | Light |
|---|---|---|
| Page ground `--ink` | `#16181B` charcoal | `#E9EBEC` galvanised grey |
| Section band `--plate` | `#1C1F23` | `#DDE0E2` |
| Panel `--panel` | `#23272C` | `#F6F7F8` |
| Line `--line` | `#3A3F46` | `#BFC4C9` |
| Text `--text` / `--text-2` / `--text-3` | `#ECEAE6` / `#A9AEB5` / `#8A9099` | `#1A1C1F` / `#464B52` / `#5E646C` |
| Accent fill `--spark` (buttons) | `#F26B1D` with dark text `#16181B` | same |
| Accent text `--accent-text` | `#FF8A47` | `#B0470A` |
| WhatsApp `--whatsapp` | `#1FA855` with dark text | same |

Orange only marks actions and the current state (primary button, active nav, focus ring).
Never use it for decoration. White text on orange fails contrast, so button text is always dark.

**Type**

- Headings: Barlow Condensed 600/700, sentence case.
- Body: Hind 400/500/600 at 17px, line-height 1.6. Hind has Devanagari if Hindi script is added later.
- No eyebrow labels above headings, no tracked all-caps, no monospace chrome.

**Spacing:** `--space-1…9` (0.25rem → 6.5rem). Sections use `--space-8` vertical padding.
The side gutter is 16px on phones and 32px from 768px up.

## Components

- `.btn-primary` (orange), `.btn-whatsapp` (green), `.btn-secondary` (outline), `.link`.
  Minimum height is 48px.
- `.site-header`: fixed, hides on scroll down. The desktop header shows a Call button.
- `.mobile-action-bar`: fixed Call + WhatsApp bar on phones. `.wa-float` is the
  WhatsApp button from 768px up.
- `Gallery` + `Lightbox` (`components/Gallery.jsx`): shared by Gate and Railing sections.
  Keyboard: Esc closes, arrow keys go previous/next.
- `LeadForm` (`components/LeadForm.jsx`): the only lead form, used in Contact and the
  "Rate maangiye" modal. Required fields are name, mobile and job type (radio chips).
  Size/details, area and email are optional. Don't add other forms; extend this one.
- `.service-row` list (no cards), `.steps` (numbered because the order matters), `.faq-*`,
  form fields `.form-*`.

## Content rules

- Business details live in `src/utils/business.js` only.
- Photos live in `public/assets/work/`. The current set is reference designs from an image
  host, not the workshop's own jobs. Replace them with real job photos and keep honest
  titles that describe what is in the picture.
- Videos are other channels' YouTube content. Always show the channel name.
