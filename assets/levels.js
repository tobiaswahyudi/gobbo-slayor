// Level 0, 3 bombs
const LEVEL_MINUS_1 = LevelState.make({
  id: "intro",
  title: "Welcome!",
  bombs: 2,
  level: `
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|Cr|..|..
..|Wz|..|..|Cr|Hs|Cr|Cr
..|..|..|..|..|Cr|Xs|Xd
..|..|..|..|..|Cr|..|Cr
`,
  aimArea: [[2, 0]],
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
});

const LEVEL_SLEEPING_GOBBOS_4 = LevelState.make({
  id: "sleepy-4",
  title: "?.",
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
});

const ZONE_1_MAP = LevelState.make({
  title: "Sleepy Hill",
  bombs: 0,
  level: `
..|Cr|Cr|Cr|Cr|Cr|Cr|Cr
..|Cr|..|04|..|..|05|Cr
..|Cr|..|Cr|Cr|..|..|Cr
..|Cr|..|03|Cr|..|06|Cr
Wz|..|..|..|Cr|..|Cr|Cr
..|Cr|..|02|Cr|..|..|..
..|Cr|01|..|Cr|..|..|..
..|Cr|Cr|Cr|Cr|..|..|..
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
];

const ZONE_2_MAP = LevelState.make({
  title: "Ruined Fort",
  bombs: 0,
  level: `
..|..|..|..|..|..|..|..
..|Wz|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|01|..|02|..|03|..
..|..|..|..|..|..|..|..
..|04|..|05|..|06|..|..
..|..|..|..|..|..|..|..
..|..|..|07|..|08|..|..
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

const LEVELS = [
  // LEVEL_MINUS_1,
  // LEVEL_MINUS_2,
  LEVEL_SLEEPING_GOBBOS_1,
  LEVEL_SLEEPING_GOBBOS_2,
  LEVEL_SLEEPING_GOBBOS_3,
  LEVEL_SLEEPING_GOBBOS_4,
  LEVEL_3,
  LEVEL_3_EVIL,
  LEVEL_0,
  LEVEL_ONE_HALF,
  LEVEL_1,
  LEVEL_1_EVIL,
  LEVEL_2,
  LEVEL_BAD,
  LEVEL_FIN,
];

const CURRENT_LEVEL = LEVELS[0];
