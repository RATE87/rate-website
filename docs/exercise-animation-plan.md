# ShiftFit Exercise Animation Plan

## Goal

Create a professional, clean 2D app-illustration exercise library for the ShiftFit app using the supplied character as the visual base.

## Key Recommendation

Do not treat this as "97 separate GIFs."

For professional-quality app assets, build a small reusable 2D animation system:

- one consistent character model
- a limited set of reusable motion templates
- a small prop/equipment library
- a few controlled camera views
- export to app-friendly motion formats first, then GIF only if needed

This keeps the visuals consistent and makes the full library realistic to produce.

## Best Asset Format

Use these in order of preference:

1. `WebM` or `MP4`
2. animated `WebP`
3. `GIF` only as a fallback

Why:

- better quality at smaller file sizes
- smoother playback
- easier to ship inside a mobile app
- transparent-background options are better with modern formats than GIF

## Professional Quality Constraints

The supplied character is a strong base, but one front-facing standing image is not enough for every movement at a professional level.

To cover the full library well, we should add these source states:

- front neutral standing
- side neutral standing
- seated version
- lying/supine version
- prone/plank version
- hanging version
- arms-overhead variant
- squat-depth variant

We should also prepare simple reusable props:

- barbell
- dumbbells
- bench
- cable handle
- pull-up bar
- resistance band
- dip bars
- leg press / hack squat machine
- pec deck / chest press machine
- ab wheel

## Visual Direction

- style: clean 2D app illustration
- linework: consistent medium outline weight
- shading: light cel shading only
- anatomy: simplified but believable athletic proportions
- motion: readable first, flashy second
- background: transparent or very light neutral background
- loop length: 2 to 4 seconds
- frame rate: 18 to 24 fps for video, 10 to 15 fps if forced to GIF

## Reusable Motion Templates

These templates cover most of the library:

1. standing press
2. incline press
3. chest fly
4. push-up
5. dip
6. row
7. pulldown / vertical pull
8. overhead press
9. lateral raise
10. hip hinge
11. deadlift pull
12. squat
13. lunge / step-up
14. bridge / thrust
15. curl
16. tricep extension / pushdown
17. plank / static hold
18. crunch / core flexion
19. hanging core raise
20. cyclical floor cardio

## View System

Use only a few deliberate camera views:

- front view for curls, raises, squats, planks, mountain climbers
- three-quarter front for presses and rows
- side view for hinges, lunges, glute bridges, hip thrusts
- strict side or slight three-quarter for lying bench movements
- front view for pull-up bar movements if readability is better

Avoid switching perspective randomly between exercises.

## Suggested Production Tiers

### Tier 1: highest-value starter set

Build these first to prove the system:

- Push-Up
- Barbell Bench Press
- Dumbbell Row
- Pull-Up
- Overhead Press
- Romanian Deadlift
- Barbell Squat
- Reverse Lunge
- Glute Bridge
- Dumbbell Curl
- Tricep Pushdown
- Plank

### Tier 2: template expansion

Add variants that reuse the same body mechanics:

- incline / decline / close-grip versions
- band versions
- weighted versions
- assisted versions
- machine versions
- bodyweight regressions

### Tier 3: machine- and niche-specific exercises

Finish equipment-heavy and lower-frequency moves:

- hack squat
- pec deck
- leg press
- machine shoulder press
- seated cable row
- cable crunch
- ab wheel

## Animation Rules

- one clear rep cycle per loop
- include a brief pause at top or bottom when it improves readability
- never exaggerate range of motion beyond safe form
- keep tempo realistic: lift controlled, return controlled
- maintain character proportions and outfit consistency
- keep hands, feet, and prop contact points locked cleanly
- no drifting scale, limb length, or face redraw from exercise to exercise

## Form-First Rules

For coaching clarity:

- spine remains neutral during hinges and deadlifts
- knees track naturally during squat and lunge patterns
- elbows and wrists stay readable in push and pull exercises
- shoulder motion should look controlled rather than loose
- core exercises must clearly show start and finish positions

## Export Specs

Recommended master export per animation:

- canvas: `512x512` or `640x640`
- background: transparent when possible
- duration: `2.5s` average
- playback: infinite loop
- safe padding: at least 10% around the character
- naming: `exercise-slug-view-v1`

Examples:

- `push-up-front-v1.webm`
- `romanian-deadlift-side-v1.webm`
- `dumbbell-curl-front-v1.webm`

## What Can Reuse the Current Character Immediately

The current character art is most compatible with:

- standing front-view bodyweight movements
- standing dumbbell/band movements
- simple front-view core drills

The following need additional source art or redraws for best quality:

- bench exercises
- glute bridge / hip thrust
- hanging movements
- seated cable row
- machine-based exercises
- side-view hinge mechanics

## Practical Build Workflow

1. Finalize the base character turnaround and pose pack.
2. Build 12 Tier 1 animations.
3. Approve motion style, line quality, and loop timing.
4. Expand into template variants.
5. Export app-ready masters.
6. Convert only required assets to GIF fallback.

## Next Best Move

If we continue from here, the smartest next deliverable is a starter production pack for the first 12 exercises:

- exact pose list for each movement
- recommended camera angle
- prop needs
- loop timing
- generation / animation prompts for consistency

