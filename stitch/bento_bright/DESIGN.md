# Design System Specification: The Organic Kineticist

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Organic Kineticist**. 

In the world of student nutrition, we must move away from the clinical, "diet-tracking" rigidity of the past. Instead, we embrace a layout that feels like a curated bento box—structured yet playful, vibrant yet organized. We break the "template" look by using **intentional asymmetry** and **overlapping glass layers**. High-energy moments are created by allowing 3D food illustrations to break the container bounds, suggesting that nutrition is an expansive, life-giving force rather than a set of restrictive boundaries.

## 2. Colors: The Fresh Harvest
The palette is a celebration of vitality. We use high-chroma accents against a warm, "Soft Cream" base to ensure the app feels like a sunny kitchen, not a sterile laboratory.

### Core Tokens
- **Primary (Sprout Green):** `#00751f` — Growth, vitality, and the "Go" signal for healthy choices.
- **Secondary (Sunshine Yellow):** `#706500` — Warmth and energy. Note: Use `secondary_container` (`#f9e534`) for large surfaces to maintain legibility.
- **Tertiary (Berry Blue):** `#0067ad` — Reliability and hydration.
- **Background (Soft Cream):** `#fefcf4` — A warm, non-clinical canvas that reduces eye strain.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. To separate a "Meal Plan" from a "Daily Summary," place a `surface_container_low` section directly against the `surface` background.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-transparent layers. 
- **Base:** `surface` (#fefcf4)
- **Sections:** `surface_container_low` (#fbf9f1)
- **Featured Cards:** `surface_container_lowest` (#ffffff) for a "pop" of brightness.
- **System Modals:** `surface_container_highest` (#e9e9de)

### The "Glass & Gradient" Rule
To achieve "wow-factor," use **Glassmorphism Lite** for floating elements (like bottom navigation or snack bars). 
- **Recipe Cards:** Transition from `primary` to `primary_container` in a subtle 45° linear gradient to give the UI "soul" and depth.

## 3. Typography: The Editorial Voice
Our typography balances the playful approachability of a lifestyle magazine with the functional clarity of a utility app.

- **Display & Headlines (Plus Jakarta Sans):** Chosen for its modern, slightly rounded geometric "ink traps" that feel friendly yet professional. Use `display-lg` (3.5rem) for big, high-energy calorie or macro counts.
- **Body & Labels (Inter):** The industry standard for legibility. Used for all functional data and long-form nutritional advice.
- **The Hierarchy Strategy:** Pair a bold `headline-lg` in `on_surface` with a `body-md` in `on_surface_variant` to create a sophisticated, high-contrast editorial look.

## 4. Elevation & Depth: Tonal Layering
We reject the heavy, "fuzzy" shadows of 2010s design. Depth is achieved through **Tonal Layering**.

- **The Layering Principle:** Instead of a shadow, place a `surface_container_lowest` card on a `surface_container_low` background. The shift in brightness creates a natural, soft lift.
- **Ambient Shadows:** For floating action buttons or high-priority 3D illustrations, use a diffused shadow: `blur: 32px`, `opacity: 6%`, using the `on_surface` color as the tint.
- **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-contrast mode), use `outline_variant` at **15% opacity**. Never use 100% opaque lines.
- **Squircle Geometry:** All containers must use the **Squircle** (continuous curvature) rather than a standard rounded rect. Use the `xl` (3rem) or `lg` (2rem) tokens to maintain a soft, "bento" aesthetic.

## 5. Components

### Buttons
- **Primary:** `primary` background with `on_primary` text. Use `xl` rounding (3rem). 
- **Secondary:** `secondary_container` background. These should feel "sunny" and inviting.
- **Tertiary:** No background; `primary` text. Use for low-emphasis actions like "View More."

### Input Fields
- **Style:** Use `surface_container_high` backgrounds instead of outlined boxes. 
- **Interaction:** On focus, the background shifts to `surface_container_lowest` with a 2px `primary` ghost-border (20% opacity).

### Progress Bars (The "Warm Amber" Rule)
- **Success:** `primary` (Sprout Green).
- **Needs Improvement:** Use `secondary` (Warm Amber/Yellow). **Never use red** for nutritional shortfalls; we encourage, we don't punish. Use `error` tokens (#be2d06) only for critical system failures or "Danger: Allergy" warnings.

### Nutrition Cards
- **Structure:** No dividers. Use `Spacing 6` (2rem) to separate the food image from the title. 
- **Visuals:** Integrate 3D illustrations that "leak" out of the card boundaries, overlapping the header above it to create a sense of three-dimensional space.

### Interaction Chips
- Use `surface_container_highest` for unselected states. Upon selection, animate to `tertiary_fixed` with a subtle bounce.

## 6. Do's and Don'ts

### Do
- **Do** use whitespace as a functional tool. If a screen feels cluttered, increase the spacing from `8` to `12`.
- **Do** use "Berry Blue" (`tertiary`) for hydration and water-tracking features to provide a cooling contrast to the "Sprout Green."
- **Do** ensure 3D assets have a consistent light source (top-left) to match our ambient shadow system.

### Don't
- **Don't** use 1px dividers. If you need to separate content, use a background color shift or a `Spacing 4` vertical gap.
- **Don't** use pure black (#000000) for text. Use `on_surface` (#383833) to keep the "Soft Cream" vibe warm.
- **Don't** use sharp corners. The minimum radius for any container is `md` (1.5rem/24px).
- **Don't** use red for "low protein" or "high sugar." Use the amber/yellow tones to suggest "room for growth."