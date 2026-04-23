# Simple Slots

A slot machine simulation built with React, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **React 19** + TypeScript (ES2023 target, strict mode)
- **Tailwind CSS v4** — no config file, pure utility classes via `@tailwindcss/vite` plugin
- **Vite 8** with **React Compiler** — auto-memoizes components, hooks, and values. Do not manually add `useMemo`, `useCallback`, or `React.memo` unless profiling shows the compiler missed a case
- **Vitest** for testing

## Project Structure

```
src/
├── App.tsx              # Layout shell: wraps ReelProvider → SlotMachine + ReelSettings
├── ReelContext.tsx      # React Context + Provider for reels / rowCount / extraCycles / speed
├── main.tsx             # React entry point
├── index.css            # Single Tailwind import
├── utils.ts             # Array/reel utility functions
├── utils.test.ts        # Tests for utils
├── utils.bench.ts       # Benchmarks for utils
└── components/
    ├── Block.tsx         # Single symbol cell (10vh tall, aspect-square)
    ├── Reel.tsx          # Animated reel strip (Web Animations API)
    ├── ReelSettings.tsx  # User controls bound to ReelContext (currently: row count)
    ├── Scoreboard.tsx    # Credits, win, bet display bar
    ├── Scorecard.tsx     # Individual score label/value pair
    ├── SlotButton.tsx    # Styled spin button
    ├── SlotMachine.tsx   # Game state: spin orchestration, indices, win/credits bookkeeping, buttons
    └── SlotScreen.tsx    # Container for reels (overflow-clip viewport)
```

## Architecture

### Data Flow

```
ReelProvider (reels[], rowCount, extraCycles, speed state)
  └── App (layout shell only)
       ├── SlotMachine (reelIndices[], destinations[], spinning, credits, bet, win — game state + UI)
       │    ├── SlotScreen (height = rowCount * 10vh, maps reels[] from context to Reels)
       │    │    └── Reel × N (each gets its own symbols[], runs WAAPI animation on spin)
       │    │         └── Block (stateless: renders one emoji symbol)
       │    ├── Scoreboard (credits, win, bet display)
       │    └── Bet / Max Bet / Spin buttons
       └── ReelSettings (live tuning of context values)
```

`App` is a thin layout shell with no state. `ReelContext` owns reel configuration (symbol arrays, animation parameters). `SlotMachine` owns all per-spin game state: reel indices, destinations, spinning flag, credits, bet, and win payout.

### Key Concepts

**Reel Strips**: Each reel has its own circular array of symbols. The `reels` state in `ReelContext` is a `(string | number)[][]` — each entry can have different symbols and lengths. Probability is controlled by symbol frequency and array length — no virtual reel indirection needed (virtual reels are a stepper machine concept).

**Variable reel count**: The number of reels is determined by the length of the `reels` array in context. `reelIndices` in `SlotMachine` is kept in sync via a render-time adjustment pattern (comparing `reels.length` against a `prevReelCount` state value). New reels default to index `0`; removed reels are truncated. `SlotScreen` pulls `reels` from context and iterates to render each `Reel` with its own symbol array.

**Index-based state**: `SlotMachine` tracks a `centerIdx` per reel in `reelIndices`. The idle visible window is derived from that index. On spin, `SlotMachine` sets a `destinations` array (one per reel, using each reel's own length); each `Reel` picks up its destination via props and runs an animation to it. When the animation finishes, the Reel calls `onStop(finalIdx)` and `SlotMachine` updates the corresponding `centerIdx`.

**Win checking (no `useEffect`)**: The win check runs synchronously inside `handleReelStop` the moment the last reel reports. Two refs make this safe:

- `reelIndicesRef` — mirrors `reelIndices` state. Seeded from the committed state at the top of `spinReels`, then mutated synchronously inside `handleReelStop` (before calling `setReelIndices`). The ref is necessary because `Reel` captures its `onStop` callback once when the animation starts, so every reel's handler closes over the same render's `reelIndices`. Reading from state would cause each handler to overwrite its siblings' updates; reading from the ref gives each handler the freshest post-update array.
- `completedCountRef` — counts reels stopped in the current spin. A ref (not state) because nothing renders based on it, and it must be read/written synchronously across handlers that may fire before React commits.

When `completedCountRef.current` reaches `reels.length`, the handler derives `finalVisible` directly from the locally computed `nextIndices`, checks the middle-row payline with `checkWin`, and — on a win — calls `setWin` and `setCredits` alongside the spinning/destination/maxxed resets. React batches every setter in the event into one render, so the transition from spinning to "stopped with win displayed" happens atomically. No `useEffect`-driven state updates.

**Spin animation (WAAPI)**: On spin start, the Reel builds a single tall strip of `totalSteps + 1 + rowCount` blocks covering the entire journey and hands two things to the browser:
1. The strip committed to the DOM (via `useLayoutEffect` + `setState`, so it's in place before paint)
2. A single `element.animate()` call with explicit keyframes encoding a piecewise-linear deceleration followed by an overshoot + rebound

Because the animation runs on the compositor thread with all keyframes provided up front, there's no React-commit/browser-paint timing race — the reel cannot stall mid-spin.

### Configurable State (ReelContext)

All reel configuration lives in `ReelContext` as mutable state so future UI can tune them live:

- `reels` — array of symbol arrays, one per reel. Determines reel count, symbols, and probability (via symbol frequency)
- `rowCount` — visible rows per reel. Bound to the rows input in `ReelSettings`
- `extraCycles` — array of extra full reel loops per reel for stagger (default `[2, 3, 4]` so reel 0 stops first, reel 2 last). Reels beyond the array length fall back to the last element
- `speed` — global multiplier. Divides all animation durations (higher = faster). `useState` in the provider means changing `initialSpeed` in source requires a hard browser refresh — HMR preserves the existing state value

### Utility Functions (utils.ts)

- `reelSlice(array, count, topIdx)` — forward slice of `count` items starting from `topIdx`, wrapping circularly. Used to build both the idle `rowCount + 1` window and the full spin strip
- `randIdx(len)` — random index in `[0, len)`. Used to pick spin destinations
- `checkWin(payLine, reels)` — checks if all symbols at the given row indices across reels match. `SlotMachine` builds a middle-row payline (`reels.map(() => Math.floor(rowCount / 2))`) so any reel/row count works
- `payoutMap` — maps symbols to payout values. Win amount = `payoutMap[winSymbol] * bet`

### Sizing

- Block height: `10vh` (viewport-relative, responsive)
- Block aspect: `aspect-square`
- SlotScreen height: `rowCount * 10vh` (inline style, not Tailwind dynamic class — JIT can't compile runtime-interpolated arbitrary values)
- No hardcoded pixel values anywhere

### Animation Details (Reel.tsx)

The animation is constructed entirely inside a `useLayoutEffect` keyed on `destinationIdx`:

1. Compute `totalSteps = baseSteps + extraCycles[reelIndex] * reelLength` where `baseSteps` is the wrapped distance from current to destination
2. Build the full journey strip: `reelSlice(symbols, totalSteps + 1 + rowCount, initialTopIdx - 1 - totalSteps)` and commit it via `setSpinBlocks`
3. Build keyframes:
   - For each step `i` in `[0, totalSteps]`, a keyframe at `translateY(-(totalSteps + 1 - i) * 10vh)`. Each segment uses `easing: 'linear'` and has duration `stepMs(i) = (30 + 40 * (i / totalSteps) ** 8) / speed`. The high exponent keeps the reel near top speed through most of the spin, then brakes hard in the final few steps
   - One overshoot keyframe 5vh past the destination (`translateY(-5vh)`), duration `90 / speed` ms, linear
   - One rebound keyframe back to `translateY(-10vh)`, duration `140 / speed` ms, `ease-out`
4. Pass everything to `element.animate(keyframes, { duration: totalDuration, fill: 'both' })`
5. Await `anim.finished`, then `anim.cancel()`, clear `spinBlocks`, and call `onStop(destinationIdx)`. React batches the state updates so the transition from spinning to idle has no visible flicker (the last strip positions match the idle strip at the destination)

Base transform when idle: `translateY(-10vh)` — same as the final keyframe, so the element stays in place after the animation is cancelled.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npx vitest run` — run tests
- `npx tsc --noEmit` — type-check
