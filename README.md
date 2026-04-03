# LunchLogic - Next.js Migration

A comprehensive lunch planning and nutrition analysis application built with Next.js 15, TypeScript, and Tailwind CSS 4.

## Project Overview

LunchLogic is a parent-focused web application that helps families plan, analyze, and optimize their children's school lunches. The app features AI-powered lunchbox analysis, weekly meal planning, smart food swaps, sensory preference tracking, and caregiver collaboration tools.

## Tech Stack

- **Framework**: Next.js 15.2.2 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x with custom design tokens
- **Fonts**: Plus Jakarta Sans (headlines), Inter (body)
- **Icons**: Material Symbols (Google Fonts)

## Project Structure

```
app/
├── page.tsx                    # Redirects to /dashboard
├── layout.tsx                  # Root layout with fonts + metadata
├── globals.css                 # Tailwind imports + custom CSS
├── dashboard/                  # Morning Rush Dashboard (main entry)
│   └── page.tsx
├── profile/                    # Child Profile Setup
│   └── page.tsx
├── planning/                   # Weekly Planning & Prep
│   └── page.tsx
├── analysis/                   # AI Lunchbox Analysis
│   └── page.tsx
├── lab/                        # Lunchbox Lab (Sensory Mode)
│   └── page.tsx
├── swaps/                      # Tiny Tweaks Swap Engine
│   └── page.tsx
├── caregiver/                  # Caregiver Report Card Hub
│   └── page.tsx
├── fridge/                     # Fridge Remix Pantry Prep
│   └── page.tsx
├── logistics/                  # Logistics & Openability Review
│   └── page.tsx
├── store/                      # Smart Store Map & Budget Builder
│   └── page.tsx
├── trends/                     # Weekly Pattern Intelligence
│   └── page.tsx
├── components/
│   ├── TopNav.tsx             # Top navigation bar
│   ├── SideNav.tsx            # Desktop sidebar navigation
│   ├── MobileNav.tsx          # Mobile bottom navigation
│   └── MaterialIcon.tsx       # Material Symbols wrapper
stitch/                         # Original HTML source files (reference)
public/                         # Static assets
```

## Design System

### Color Palette (Material Design 3 - Custom)

**Primary Colors:**
- `primary`: #00751f (Green)
- `primary-dim`: #00671a
- `primary-container`: #91f78e
- `on-primary`: #ffffff
- `on-primary-container`: #005e17

**Secondary Colors:**
- `secondary`: #706500 (Yellow/Olive)
- `secondary-dim`: #625900
- `secondary-container`: #f9e534
- `on-secondary`: #ffffff
- `on-secondary-container`: #5b5300

**Tertiary Colors:**
- `tertiary`: #0067ad (Blue)
- `tertiary-dim`: #005b9a
- `tertiary-container`: #70b5ff
- `on-tertiary`: #ffffff
- `on-tertiary-container`: #003258

**Surface Colors:**
- `surface`: #fefcf4 (Cream/Off-white background)
- `surface-container`: #f5f4eb
- `surface-container-low`: #fbf9f1
- `surface-container-high`: #efeee5
- `surface-container-highest`: #e9e9de
- `on-surface`: #383833
- `on-surface-variant`: #65655f

**Error Colors:**
- `error`: #be2d06
- `error-container`: #f95630
- `on-error`: #ffffff

### Typography

- **Headlines**: Plus Jakarta Sans
- **Body**: Inter
- **Icons**: Material Symbols Outlined

### Border Radius Scale

- `DEFAULT`: 1rem
- `lg`: 2rem
- `xl`: 3rem
- `full`: 9999px

## Navigation Routes

| Route | Page | Icon |
|-------|------|------|
| `/dashboard` | Morning Rush Dashboard | `dashboard` |
| `/analysis` | AI Lunchbox Analysis | `qr_code_scanner` |
| `/trends` | Weekly Trends | `trending_up` |
| `/swaps` | Swap Engine | `swap_horiz` |
| `/profile` | Kid Profiles | `face` |
| `/planning` | Weekly Planning | `calendar_month` |
| `/lab` | Lunchbox Lab | `science` |
| `/caregiver` | Caregiver Hub | `family_restroom` |
| `/fridge` | Fridge Remix | `kitchen` |
| `/logistics` | Logistics Check | `local_shipping` |
| `/store` | Smart Store Map | `map` |

## Development

```bash
npm install
npm run dev
npm run build
```

## Migration Notes

Migrated from standalone HTML files in `stitch/` directory.

## License

Private - All rights reserved.

