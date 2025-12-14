// Level 0, 3 bombs
const LEVEL_MINUS_1 = LevelState.make({
  id: "intro",
  title: "Welcome!",
  bombs: 2,
  level: `
..|..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..|..
..|..|..|..|..|Cr|..|..|..
..|Wz|..|..|Cr|Hs|Cr|Cr|..
..|..|..|..|..|Cr|Xs|Xd|..
..|..|..|..|..|Cr|..|Cr|..
`,
  aimArea: [[2, 0]],
  bestMoves: 6,
});

const LEVEL_MINUS_2 = LevelState.make({
  id: "bug-test",
  title: "bug test",
  bombs: 2,
  level: `
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|Vs|..|..|..|..
..|..|..|Xs|..|..|..|..
..|Wz|..|Vs|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [
    [2, 0],
    [2, 1],
  ],
});

// Level 0, 3 bombs
const LEVEL_0 = LevelState.make({
  id: "magic-hats",
  title: "Magic Hats, what do they do?",
  bombs: 3,
  level: `
..|..|..|..|..|..|..|..
..|..|..|..|Cr|Cr|Cr|..
..|..|..|..|Cr|Hs|Xs|..
..|Wz|..|Cr|Vs|Cr|Cr|..
..|..|..|..|Cr|Vs|Cr|..
..|..|..|..|Cr|Xs|Cr|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [[4, 0]],
  bestMoves: 5,
});

// Level 1.5, 2 bombs
const LEVEL_ONE_HALF = LevelState.make({
  id: "parity",
  title: "Evasive Action",
  bombs: 2,
  level: `
..|..|..|..|..|..|..|..
..|..|..|..|..|Cr|..|..
..|..|..|..|Cr|..|Cr|..
..|Wz|..|..|Cr|..|Cr|..
..|..|..|..|Cr|Xd|Cr|..
..|..|..|..|Cr|..|Cr|..
..|..|..|..|..|Cr|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [[2, 0]],
  bestMoves: 4,
});

// Level 1, 2 bombs
const LEVEL_1_EVIL = LevelState.make({
  id: "jog-2",
  title: "Gobbos on a Morning Jog (Evil)",
  bombs: 2,
  level: `
..|..|..|..|..|..|..|..
..|..|..|Cr|Vd|..|..|..
..|..|..|..|..|..|..|..
..|Wz|..|..|Cr|Xr|..|..
..|..|..|..|..|..|..|..
..|..|Cr|Cr|..|..|..|..
..|..|Cr|Hr|..|..|..|..
..|..|Cr|..|..|..|..|..
`,
  aimArea: [
    [2, 0],
    [2, -1],
    [3, 0],
  ],
  bestMoves: 18,
});

// Level 1, 2 bombs
const LEVEL_1 = LevelState.make({
  id: "jog-1",
  title: "Gobbos on a Morning Jog",
  bombs: 2,
  level: `
..|..|..|..|..|..|..|..
..|..|..|Cr|Xd|..|..|..
..|..|..|..|..|..|..|..
..|Wz|..|..|Cr|Xr|..|..
..|..|..|..|..|..|..|..
..|..|Cr|Cr|..|..|..|..
..|..|Cr|Vr|..|..|..|..
..|..|Cr|..|..|..|..|..
`,
  aimArea: [
    [2, 0],
    [2, -1],
    [3, 0],
  ],
  bestMoves: 17,
});

// Level 1, 2 bombs
const LEVEL_2 = LevelState.make({
  id: "parity-plus",
  title: "⬇︎ Don't overthink it ⬇︎",
  bombs: 3,
  level: `
..|..|..|..|..|..|..|..
..|..|..|Cr|..|..|..|..
..|..|..|..|Xd|..|..|..
..|..|..|..|Cr|Xr|..|..
..|Wz|..|..|..|..|..|..
..|..|Cr|Cr|..|..|..|..
..|..|Cr|..|Xr|..|..|..
..|..|Cr|..|..|..|..|..
`,
  aimArea: [
    [3, -1],
    [2, 0],
    [3, 0],
    [4, 0],
    [3, 1],
  ],
  bestMoves: 13,
});

const LEVEL_FIN = LevelState.make({
  id: "fin",
  title: "SECRET GOBBO DANCE PARTY",
  bombs: 0,
  level: `
Xr|..|Xr|..|Xr|..|Xr|..
..|Vr|..|Vr|..|Vr|..|Vr
Hr|..|Hr|..|Hr|..|Hr|..
..|..|..|Wz|..|..|..|..
..|..|..|..|..|..|..|..
..|Vr|..|Vr|..|Vr|..|Vr
Xr|..|Xr|..|Xr|..|Xr|..
..|Hr|..|Hr|..|Hr|..|Hr
`,
  aimArea: [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ],
  bestMoves: 1,
});

const LEVEL_BAD = LevelState.make({
  id: "bad",
  title: "This level is bad.",
  bombs: 300,
  level: `
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|Xs|..|..|..|..
..|Wz|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [[0, 0]],
  bestMoves: 4,
});

const LEVEL_SLEEPING_GOBBOS_1 = LevelState.make({
  id: "sleepy-1",
  title: "Just some target practice.",
  bombs: 3,
  level: `
..|..|..|..|..|..|..|..
..|..|Xs|Xs|Xs|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|Wz|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [
    [1, 0],
    [2, -1],
    [3, -2],
  ],
  bestMoves: 6,
});

const LEVEL_SLEEPING_GOBBOS_2 = LevelState.make({
  id: "sleepy-2",
  title: "Wait what.",
  bombs: 3,
  level: `
..|..|..|..|..|..|..|..
..|..|Xs|Xs|Xs|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|Wz|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [
    [1, 0],
    [2, -1],
    [-5, -6],
  ],
  bestMoves: 18,
});

const LEVEL_SLEEPING_GOBBOS_3 = LevelState.make({
  id: "sleepy-3",
  title: "A little puzzling.",
  bombs: 4,
  level: `
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|Xs|Xs|Xs|Xs|..|..
..|Wz|Xs|Xs|Xs|Xs|..|..
..|..|Xs|Xs|Xs|Xs|..|..
..|..|Xs|Xs|Xs|Xs|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [
    [0, 0],
    [1, 0],
    [0, 1],
    [0, -1],
    [2, 5],
    [3, 5],
    [4, 5],
    [3, 4],
    [-5, -3],
    [-4, -3],
    [-3, -3],
    [-4, -2],
    [4, -4],
    [4, -3],
    [4, -2],
    [3, -3],
  ],
  bestMoves: 22,
});

const LEVEL_SLEEPING_GOBBOS_4 = LevelState.make({
  id: "sleepy-4",
  title: "?",
  bombs: 4,
  level: `
..|..|..|..|..|..|..|..
..|Hs|..|..|Xs|..|Hs|..
..|Xs|..|..|Vs|..|Xs|..
..|Wz|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|Xs|..|Vs|..|Xs|..|..
..|Hs|..|Vs|..|Xs|Vs|..
..|..|..|..|..|..|..|..
`,
  aimArea: [
    [1, 0],
    [2, 0],
    [1, 1],
    [2, 1],
  ],
  bestMoves: 26,
});

const LEVEL_SLEEPING_GOBBOS_5 = LevelState.make({
  id: "sleepy-5",
  title: "Climbing a ladder",
  bombs: 5,
  level: `
..|..|..|Xs|..|..|..|..
..|..|Vs|..|..|..|..|..
..|..|..|..|..|..|Vs|..
..|..|..|..|Vs|..|..|..
..|Vs|..|..|..|..|..|..
Cr|Cr|Cr|Cr|Cr|Cr|Cr|Cr
..|..|..|Wz|..|..|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [
    [0,-2]
  ],
  bestMoves: 17,
});

const LEVEL_SLEEPING_GOBBOS_6 = LevelState.make({
  id: "sleepy-6",
  title: "second ladder",
  bombs: 5,
  level: `
..|..|Xs|..|..|..|..|..
..|..|Vs|..|..|..|..|..
..|..|Xs|..|..|..|Vs|..
..|..|..|..|Vs|..|Vs|..
..|Vs|..|..|Xs|..|Vs|..
Cr|Cr|Cr|Cr|Cr|Cr|Cr|Cr
..|..|..|Wz|..|..|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [
    [0,-2]
  ],
  bestMoves: 18,
});

const DEMO = LevelState.make({
  id: "demo",
  title: "snek",
  bombs: 37,
  level: `
Vs|Hs|Hs|Hs|Hs|Hs|Hs|Hs
Vs|..|..|..|..|..|..|Vs
Vs|..|Vs|Hs|Hs|Hs|..|Vs
Vs|..|Xs|..|..|Vs|..|Vs
Vs|..|..|..|..|Vs|..|Vs
Hs|Hs|Hs|Hs|Hs|Vs|..|Vs
Cr|..|..|..|..|..|..|Vs
Wz|Cr|Hs|Hs|Hs|Hs|Hs|Vs
`,
  aimArea: [
    [2,0]
  ],
  bestMoves: 37,
});

const LEVEL_3 = LevelState.make({
  id: "overlap-1",
  title: "2 birds 1 stone",
  bombs: 4,
  level: `
Xd|Xd|Xd|Xd|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|Wz|..|..|..
..|..|..|..|..|..|..|Xl
..|..|..|..|..|..|..|Xl
..|..|..|..|..|..|..|Xl
..|..|..|..|..|..|..|Xl
`,
  aimArea: [
    [0, 0],
    [-1, -1],
    [-2, -2],
    [-3, -3],
  ],
  bestMoves: 36,
});

const LEVEL_3_EVIL = LevelState.make({
  id: "overlap-2",
  title: "sorry",
  bombs: 2,
  level: `
..|..|..|..|..|..|..|..
..|..|Xr|..|Xu|Xd|..|..
..|..|..|..|..|..|..|..
..|..|..|..|Xl|..|..|..
..|..|Xl|..|..|..|Wz|..
..|..|Xu|Xd|..|..|..|..
..|..|..|..|Xr|..|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ],
  bestMoves: 17,
});

const LEVEL_HOOK = LevelState.make({
  id: "hook-1",
  title: "Anti-magic Walls",
  bombs: 2,
  level: `
..|..|..|..|Bl|..|..|..
..|..|..|..|Bl|..|..|..
..|Wz|..|..|Bl|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|Bl|..|Hs|..
..|..|..|..|Bl|..|..|Xs
..|..|..|..|Bl|..|..|..
`,
  aimArea: [
    [2, 0]
  ],
  bestMoves: 17,
});

const LEVEL_TRAPPED = LevelState.make({
  id: "trapped",
  title: "LET ME OUT",
  bombs: 4,
  level: `
..|..|..|..|..|..|..|..
Bl|Bl|Bl|Bl|Bl|Bl|..|..
Bl|..|..|..|..|Bl|Hd|..
Bl|Wz|..|..|Hl|Bl|..|..
Bl|..|..|..|..|Bl|..|..
Bl|..|..|..|Xu|Bl|Hu|..
Bl|Bl|Bl|Bl|Bl|Bl|..|..
..|..|..|..|..|..|..|..
`,
  aimArea: [
    [2, 0],
  ],
  bestMoves: 17,
});

const LEVEL_BLOCK_1 = LevelState.make({
  id: "block-1",
  title: "Crossing the bridge.",
  bombs: 2,
  level: `
Bl|Bl|Bl|Cr|Cr|Bl|Bl|Bl
..|..|Bl|Cr|Cr|Bl|..|Hd
..|..|Bl|Bl|Bl|Bl|..|..
Wz|..|..|..|..|Bl|..|..
..|..|Bl|..|..|..|..|..
..|..|Bl|Bl|Bl|Bl|..|..
..|..|Bl|Cr|Cr|Bl|..|Hu
Bl|Bl|Bl|Cr|Cr|Bl|Bl|Bl
`,
  aimArea: [
    [2, 0],
  ],
  bestMoves: 9,
});

const LEVEL_BLOCK_2 = LevelState.make({
  id: "block-2",
  title: "One step at a time",
  bombs: 2,
  level: `
..|..|Bl|Bl|..|..|..|Vs
..|..|Bl|..|..|..|..|..
..|..|Bl|..|Bl|..|..|..
..|Wz|Bl|..|..|..|..|..
..|..|Bl|..|..|Bl|Bl|..
..|..|Bl|..|..|..|..|..
..|..|Bl|..|Bl|..|..|..
..|..|Bl|..|..|Bl|..|Vs
`,
  aimArea: [
    [2, 0],
  ],
  bestMoves: 28,
});

const LEVEL_BLOCK_3 = LevelState.make({
  id: "block-3",
  title: "maze",
  bombs: 4,
  level: `
..|..|..|..|..|..|..|Xs
Bl|..|Bl|..|..|..|..|..
..|..|..|..|Bl|..|..|..
..|Bl|Bl|Bl|..|..|..|Bl
Bl|..|..|..|Bl|Bl|Bl|..
..|..|..|..|..|..|Bl|..
..|..|Bl|..|..|..|..|..
Wz|Xs|Bl|Xs|..|Bl|..|Hs
`,
  aimArea: [
    [0, 0],
    [0,-4],
  ],
  bestMoves: 40,
});

const LEVEL_BLOCK_4 = LevelState.make({
  id: "block-4",
  title: "claustrophobic",
  bombs: 4,
  level: `
..|Bl|..|Bl|..|..|..|..
Bl|..|..|..|Bl|..|Bl|..
..|..|Bl|..|..|..|..|Bl
Bl|..|..|Bl|..|Bl|..|..
Bl|..|Bl|Xs|Bl|..|..|Bl
Cr|Bl|Xs|Vs|..|Bl|..|..
..|..|Cr|..|..|..|..|Bl
Wz|..|Cr|Xs|Bl|..|Bl|..
`,
  aimArea: [
    [1, -3],
  ],
  bestMoves: 67,
});

const LEVEL_DONUT = LevelState.make({
  id: "donut",
  title: "donut",
  bombs: 1,
  level: `
..|..|Bl|..|Bl|..|Bl|..
Vu|..|..|..|..|..|..|Bl
..|Bl|..|Bl|Cr|Bl|..|..
..|..|Bl|Wz|..|Cr|..|Bl
Bl|..|Cr|..|..|Bl|..|..
..|..|Bl|Cr|Bl|..|..|Bl
Bl|..|..|..|..|..|Bl|..
..|Bl|..|Bl|..|Bl|..|Bl
`,
  aimArea: [
    [-2, -2],
  ],
  bestMoves: 76,
});

const LEVEL_PARITY_3 = LevelState.make({
  id: "parity-3",
  title: "The three ways",
  bombs: 5,
  level: `
..|..|Hl|..|..|Bl|..|..
..|..|Vr|..|Cr|..|..|..
..|..|..|Cr|..|..|..|..
..|..|..|..|..|..|..|..
..|Xr|..|Cr|Cr|Hr|..|..
Cr|Cr|Cr|Cr|Cr|Cr|Cr|Cr
..|..|..|..|..|..|..|..
..|..|Wz|..|..|..|..|..
`,
  aimArea: [
    [0, -5],
    [0,-4],
    [-2,-5],
    [-2,-4],
  ],
  bestMoves: 17,
});

const LEVEL_FORT = LevelState.make({
  id: "fortress",
  title: "Impenetrable Fortress",
  bombs: 2,
  level: `
..|..|..|..|..|..|Bl|..|..|..
..|Bl|Bl|..|..|..|Bl|..|Hs|..
..|Bl|Bl|..|..|..|Bl|Bl|..|..
..|..|..|..|..|..|..|Bl|Bl|Bl
..|..|..|..|..|..|..|..|..|Cr
..|..|..|Wz|..|..|..|..|..|Cr
..|Bl|..|..|..|..|..|Bl|Bl|Bl
..|Bl|..|..|..|..|Bl|Bl|..|..
..|Bl|Bl|..|..|..|Bl|..|Hs|..
..|..|..|..|..|..|Bl|..|..|..
`,
  aimArea: [
    [2, 0],
  ],
  bestMoves: 30,
});

const ZONE_1_MAP = LevelState.make({
  title: "Sleepy Hill",
  bombs: 0,
  level: `
..|Cr|Cr|Cr|Cr|Cr|Cr|Cr
Cr|Cr|L3|..|05|..|06|Cr
04|L3|03|Cr|Cr|..|..|Cr
Cr|Cr|..|02|Cr|..|..|Cr
..|Cr|..|..|Cr|L7|Cr|Cr
07|Cr|Cr|L1|Cr|..|..|..
08|Wz|..|01|Cr|..|..|..
09|Cr|Cr|Cr|Cr|..|..|..
`,
  aimArea: [],
});

const ZONE_1_LEVELS = [
  LEVEL_MINUS_1,
  LEVEL_0,
  LEVEL_SLEEPING_GOBBOS_1,
  LEVEL_SLEEPING_GOBBOS_2,
  LEVEL_SLEEPING_GOBBOS_3,
  LEVEL_SLEEPING_GOBBOS_4,
  LEVEL_SLEEPING_GOBBOS_5,
  LEVEL_SLEEPING_GOBBOS_6,
  DEMO,
];

const ZONE_2_MAP = LevelState.make({
  title: "Ruined Fort",
  bombs: 0,
  level: `
15|16|..|Cr|Cr|Cr|..|..
14|..|Cr|06|..|05|Cr|..
13|Cr|L6|..|Cr|..|L4|Cr
12|Cr|07|L7|..|Cr|04|Cr
11|..|Cr|..|08|Cr|..|Cr
10|..|01|Cr|Cr|..|03|Cr
09|Wz|..|..|02|L2|Cr|..
..|..|Cr|Cr|Cr|Cr|..|..
`,
});

const ZONE_2_LEVELS = [
  LEVEL_ONE_HALF,
  LEVEL_1,
  LEVEL_1_EVIL,
  LEVEL_2,
  LEVEL_3,
  LEVEL_3_EVIL,
  LEVEL_BAD,
  LEVEL_FIN,
  LEVEL_BLOCK_1,
  LEVEL_BLOCK_2,
  LEVEL_BLOCK_3,
  LEVEL_BLOCK_4,
  LEVEL_DONUT,
  LEVEL_TRAPPED,
  LEVEL_PARITY_3,
  LEVEL_FORT,
];

const ZONE_LEVELS = {
  camp: {
    map: ZONE_1_MAP,
    levels: ZONE_1_LEVELS,
  },
  fort: {
    map: ZONE_2_MAP,
    levels: ZONE_2_LEVELS,
  },
};
