# PhysioSync CRM — Design Brief

**Category:** Enterprise Healthcare SaaS | **Theme:** Dark/Light Mode | **Visual Identity:** Medical Blues + Clinical Precision

## Purpose & Context
Premium clinic management system for physiotherapy and rehabilitation clinics. Multi-role dashboards (Super Admin, Doctor, Receptionist) for revenue analytics, patient workflows, and appointment management. Visual system must evoke clinical professionalism, medical authority, and modern healthcare technology.

## Tone & Differentiation
**Tone:** Clinical professionalism meets modern tech elegance. Refined, trustworthy, precise. **Differentiation:** Glassmorphism panels with frosted glass aesthetic, layered elevation system with soft warm shadows, medical blue dominance with purple/amber accents reserved for CTAs and active states.

## Color Palette (OKLCH)

| Token | Light (L C H) | Dark (L C H) | Purpose |
|-------|---------------|------------|----------|
| primary | 0.42 0.18 250 | 0.65 0.18 250 | Deep medical blue, authoritative, clinical |
| secondary | 0.68 0.11 190 | 0.72 0.11 190 | Soft teal, calming, supportive |
| accent | 0.62 0.22 290 | 0.72 0.22 290 | Accent purple, energetic, CTAs |
| highlight | 0.72 0.14 65 | 0.72 0.14 65 | Warm amber, progress, warmth |
| foreground | 0.12 0 0 | 0.95 0 0 | Text and primary content |
| background | 0.98 0 0 | 0.12 0 0 | Main surface |
| card | 0.99 0 0 | 0.16 0 0 | Elevated surfaces |
| muted | 0.92 0 0 | 0.22 0 0 | Secondary, low-emphasis content |
| border | 0.88 0 0 | 0.25 0 0 | Subtle dividers and outlines |

## Typography
**Display:** GeneralSans (geometric, modern, 600–700 weight) | **Body:** Inter (clean, readable, 400–500) | **Mono:** JetBrainsMono (technical precision, 400–500)

## Elevation & Depth
**Shadow Hierarchy:** `shadow-elevation-subtle` (cards, inputs), `shadow-elevation-medium` (modals, dropdowns), `shadow-elevation-high` (floating panels). **Glassmorphism:** Frosted glass backdrop blur (12px), semi-transparent backgrounds (70% light / 60% dark), soft border glow. **Gradients:** Subtle 135° linear gradients on primary buttons, muted gradient accents on secondary backgrounds.

## Structural Zones

| Zone | Light Background | Dark Background | Purpose |
|------|-----------------|-----------------|----------|
| Header | bg-card (0.99 0 0) | bg-card (0.16 0 0) | Sticky navbar with logo, user menu, notifications |
| Sidebar | bg-sidebar (0.99 0 0) | bg-sidebar (0.16 0 0) | Collapsible navigation, role-based menu items, accent highlights on active |
| Main Content | bg-background (0.98 0 0) | bg-background (0.12 0 0) | Primary workspace, responsive grid |
| Cards/Panels | glassmorphism class | glassmorphism-dark class | Dashboard widgets, metrics, forms — frosted glass effect |
| Footer | bg-muted (0.92 0 0) | bg-muted (0.22 0 0) | Secondary links, copyright |

## Spacing & Rhythm
**Grid:** 8px base unit. **Density:** Relaxed (16–24px padding for enterprise readability). **Margins:** 24–32px between major sections. **Gutters:** 16px in cards, 20px in modals. **Vertical Rhythm:** 1.5–1.8 line-height for body text, 1.2 for headers.

## Component Patterns
**Buttons:** Primary (blue gradient, purple on dark), Secondary (teal, muted on dark), Outline (border-accent), Icon-only (48px touchable area). **Forms:** Soft input borders (0.92 / 0.25 OKLCH), focus ring in accent color, validation states in warm amber. **Tables:** Zebra striping with muted background, hover state in accent/10, sortable column headers with icon indicators. **Cards:** Glassmorphism on metrics, standard card-surface on forms, timeline cards with left border accent.

## Motion & Animation
**Choreography:** Fade-in on load (0.3s ease-out), slide-from-left on modals (0.3s ease-out), smooth transitions on hover/focus (0.3s cubic-bezier). **Framer Motion:** Spring animations for card interactions, staggered list item animations, morphing sidebar collapse. **Constraints:** No bounce or elastic animations; clinical precision favors smooth, deliberate motion.

## Dark Mode Intentionality
**Approach:** Inverted lightness values, preserved color saturation for accent hierarchy. **Palette Tuning:** Primary blue shifts to 0.65 L (lighter, readable), backgrounds deepen to 0.12 L (deep navy). **Text:** White (0.95 L) on dark backgrounds ensures AA+ contrast. **Borders:** Reduced opacity (25% L) for subtle dividers on dark.

## Signature Detail
**Glassmorphism Treatment:** All metric cards and floating panels employ frosted glass (12px blur, 70% opacity) with soft border glow. Medical blue accents on active appointment slots, teal callouts for patient alerts, warm amber badges for session completion. Timeline component with left-side color-coded accents (blue=clinical notes, teal=appointments, purple=treatments, amber=progress).

## Constraints & Anti-Patterns
✗ No generic bootstrap blue, no neon gradients, no rainbow palettes. ✗ No uniform border-radius (use 4px, 8px, 12px, 24px intentionally). ✗ No flat surfaces without zone differentiation. ✓ Clinical precision over decorative excess. ✓ Glassmorphism sparingly (cards only, not full page). ✓ Warm shadows, never harsh blacks.
