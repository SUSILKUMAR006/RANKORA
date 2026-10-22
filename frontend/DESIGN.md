# Rankora design system: "The System"

Rankora's UI is modelled on the **System** from *Solo Leveling*: the floating blue windows
that announce quests, show the player's status, and warn of penalties. Every screen should
feel like the System is talking to the player.

Tokens live in `src/index.css` (`@theme` + `@utility`). Hex mirrors for charts and inline
styles live in `src/theme/palette.js` (`palette`, `seriesColors`, `rankColors`, `chartTheme`).

## Analysis: why the old UI didn't feel like Solo Leveling

| Old UI | Problem | System UI |
|---|---|---|
| Soft `rounded-2xl` teal glass cards | Generic cyberpunk dashboard | Sharp windows (2px radius), thin blue frame, corner brackets, cold inner glow (`sys-panel`) |
| Space Grotesk, mixed casing | No voice | Condensed caps `Rajdhani` headings with glow (`sys-title`), Inter body, JetBrains Mono numbers |
| ~9 equal-weight cards on the dashboard | No hierarchy | One dominant **STATUS** window; other modules are secondary windows |
| Quest cards | Don't read as quests | **Daily Quest** window: goal list, `[x/y]` counters, red warning footer |
| Small rounded rank letter | Weak identity | Hexagon hunter-rank insignia in rank colour (`RankBadge`) |
| Modals fade in | No "System moment" | Windows unfold from a line of light (`Modal`, `AuthCard`, `SystemWindow`) |
| 10 flat nav items, duplicated stats | Noise | Grouped "System menu" (Player / Records / Hunter) + mini status window, HUD top bar |
| One accent (cyan) for everything | No meaning | Colour = meaning: blue system, red penalty/boss, purple shadow/achievement, gold reward/S-rank, green clear |

## Principles

1. **Everything is a System window.** Content lives in `sys-panel` frames (via `Card` or
   `SystemWindow`). Nested blocks inside a window use `sys-inset`. Never use plain
   `rounded-2xl` cards, `bg-white/5` glass, or Tailwind `shadow-xl`.
2. **Sharp geometry.** Radius is `rounded-xs` (2px) or none. Diamonds (`rotate-45` squares)
   and hexagons are the decorative shapes. No pills except tiny dots.
3. **Colour means something.**
   - `system-*` (electric blue): default UI, EXP, active state, primary actions
   - `penalty-*` (red): failure, boss HP, warnings, destructive actions
   - `shadow-*` (monarch purple): achievements, special/rare, profile
   - `gold-*`: rewards, EXP gains (`+40 EXP`), S-rank, victory
   - `clear-*` (green): completed / cleared
   - `ember-*` (orange): streaks, A-rank
   - `frost-*`: text; `void-*`: surfaces; `edge` / `edge-strong`: frames
4. **The System speaks in caps.** Window titles, section titles, labels, buttons, and badges
   use `font-display` uppercase with wide tracking. Body copy and descriptions stay sentence
   case in Inter. Bracket window titles: `[ STATUS ]`, `[ QUEST INFO ]` (`SystemWindow` does it).
5. **Numbers are mono or big display.** Counters like `[3/7]`, EXP, amounts, and dates use
   `font-mono`. Hero numbers (level, stat values, boss HP) use
   `font-display text-5xl font-bold sys-glow`.
6. **Glow is a highlight, not wallpaper.** Glow the active element, the primary number, the
   title. Don't glow every border. Use the shadow values from the reference components.
7. **Motion.** Windows unfold (`scaleY` from a line, `origin-top`). Lists slide in from the left
   with small staggers. Keep it under 400ms. Avoid infinite animations except
   `animate-sys-pulse` on live/pending indicators.

## Colour tokens

| Role | Classes |
|---|---|
| Page | body background (already set); do not add page backgrounds |
| Window | `sys-panel` (+ `tone-penalty` / `tone-shadow` / `tone-gold` / `tone-clear`) |
| Nested block | `sys-inset` |
| Solid surfaces | `bg-void-950` (deepest), `bg-void-900`, `bg-void-850`, `bg-void-800` |
| Frames | `border-edge`, `border-edge-strong`, accent `border-system-400` |
| Heading text | `text-frost-50` (or `sys-title`) |
| Body | `text-frost-200` / `text-frost-300` |
| Secondary / meta | `text-frost-400` / `text-frost-500` |
| Faint labels | `text-frost-600` |
| Tinted chip | `border-penalty-400/60 bg-penalty-500/10 text-penalty-200` (same pattern per hue) |

**Do not use** Tailwind default hues (`cyan`, `slate`, `violet`, `amber`, `emerald`, `rose`,
`orange`, `blue`, `white`, `rankora-*`). They are aliased only as a safety net.
`text-white` → `text-frost-50`; `border-white/10` → `border-edge`; `bg-white/5` → `bg-void-850`.

## Type

| Use | Classes |
|---|---|
| Page title | `PageHeader` (or `sys-title text-3xl sm:text-4xl`) |
| Section title | `SectionHeader` |
| Window title | `SystemWindow title="…"` |
| Card / item title | `font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50` |
| Hero number | `font-display text-5xl font-bold text-frost-50 sys-glow` |
| Stat number | `font-display text-2xl font-bold text-frost-50` |
| Label / eyebrow | `label-caps text-frost-500` (or `text-system-300` for emphasis) |
| Body | `text-sm leading-6 text-frost-300` |
| Inline numbers | `font-mono` |

## Components (`src/components/common`)

- `SystemWindow`: `title`, `icon`, `actions`, `tone`, `align="center"`, `bodyClassName`.
  The default container for any titled module.
- `Card`: `variant` = `standard` | `highlighted` | `interactive` | `inset`; `tone` =
  `system` | `penalty` | `shadow` | `gold` | `clear`. Untitled windows.
- `Button`: `primary` (glowing system blue; one or two per view), `gold` (rewards, victory), `secondary`, `ghost`,
  `danger`, `success`. Already caps display text.
- `Badge`: square chip. Tones: `category`, `status` (blue), `success`, `danger`,
  `difficulty` (gold), `rank`/`shadow` (purple).
- `ProgressBar`: segmented gauge. `tone` = `xp` | `quest` | `boss` | `statistics` | `gold`;
  `size` = `sm` | `md` | `lg`.
- `Modal`: System pop-up, unfolds from a line. Props `tone`, `size` (`sm`|`md`|`lg`), `eyebrow`.
- `SystemMessage`: `[!] NOTIFICATION` box; `tone`.
- `PageHeader` / `SectionHeader` (in `SectionHeader.jsx`).
- `EmptyState`, `LoadingState`, `ErrorState`.
- `RankBadge`: hexagon insignia, `size` = `sm` | `md` | `lg` | `xl`.
- Inputs: `className="field"`. Labels: `label-caps text-frost-400 mb-1.5 block`.
- Tabs / filters: row of square buttons; active = `border-system-400 bg-system-500/15
  text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]`, inactive = `border-edge
  text-frost-400 hover:border-edge-strong hover:text-frost-100`.

## Patterns

- **Quest list**: one `SystemWindow`, `divide-y divide-edge/60` rows; status square on the
  left, caps title, mono `+XP` in gold on the right; `[x/y]` counter in the header strip.
- **Stat grids**: `sys-inset` tiles with `label-caps` key + big display number (see
  `PlayerStatusCard`).
- **Warnings / penalties**: red footer strip `border-t border-penalty-500/30 bg-penalty-500/5`
  with `AlertTriangle` and a caps "Warning:" prefix.
- **Rewards**: gold mono `+40 EXP`; victory/unlock modals use `tone="gold"` or `tone="shadow"`.
- **Boss**: `tone="penalty"` window, huge boss name in `sys-title`, red segmented HP bar.

## Charts (Recharts)

Import `palette`, `seriesColors`, `chartTheme` from `src/theme/palette.js`. Spread
`chartTheme.grid` on `CartesianGrid`, `chartTheme.axis` on axes, `chartTheme.tooltip` on
`Tooltip`. Lines `strokeWidth={2}` in `palette.system` with `dot={false}`; areas may use a
vertical `<linearGradient>` from the series colour at 0.35 to 0 opacity. Bars square
(`radius={0}`) or `[1,1,0,0]`.

## Reference implementations

`components/layout/AppLayout.jsx`, `components/auth/AuthLayout.jsx`,
`components/dashboard/PlayerStatusCard.jsx` (Status window),
`components/dashboard/QuestPreview.jsx` (Daily Quest window), all of `components/common/`.
