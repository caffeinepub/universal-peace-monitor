# Universal Peace Monitor

## Current State
New project. No existing features.

## Requested Changes (Diff)

### Add
- Backend: store of individuals (name, species/origin, peacefulness score)
- Backend: ability to add individuals, update scores, get ranked list
- Backend: scores fluctuate automatically over time (simulated)
- Frontend: cosmic dashboard with live leaderboard ranked highest to lowest peace score
- Frontend: each individual shows rank #, name, origin, peace score (number), score change delta
- Frontend: scores visually animate/update in real-time
- Frontend: ability to add new individuals to the universe
- Frontend: global stats (total beings tracked, universe average peace score)
- Frontend: search/filter through individuals

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Generate Motoko backend with individual records, CRUD, ranking query, and simulated score drift
2. Select no special components (no auth needed for this public monitor)
3. Build React frontend with cosmic glassmorphism design matching preview: leaderboard table, score updates, add-individual form, global metrics
