// Level 0, 3 bombs
const LEVEL_MINUS_1 = new LevelState({
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

const LEVEL_MINUS_2 = new LevelState({
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
const LEVEL_0 = new LevelState({
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
const LEVEL_ONE_HALF = new LevelState({
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
const LEVEL_1_EVIL = new LevelState({
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
const LEVEL_1 = new LevelState({
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
const LEVEL_2 = new LevelState({
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

const LEVEL_FIN = new LevelState({
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

const LEVEL_BAD = new LevelState({
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

const LEVEL_SLEEPING_GOBBOS_1 = new LevelState({
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

const LEVEL_SLEEPING_GOBBOS_2 = new LevelState({
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

const LEVEL_SLEEPING_GOBBOS_3 = new LevelState({
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

const LEVEL_SLEEPING_GOBBOS_4 = new LevelState({
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

const LEVEL_3 = new LevelState({
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

const LEVEL_3_EVIL = new LevelState({
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

const ZONE_1_MAP = new LevelState({
  title: "Zone 1: Sleepy Hill",
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

const ZONE_LEVELS = {
  camp: {
    map: ZONE_1_MAP,
    levels: [
      LEVEL_MINUS_1,
      LEVEL_0,
      LEVEL_SLEEPING_GOBBOS_1,
      LEVEL_SLEEPING_GOBBOS_2,
      LEVEL_SLEEPING_GOBBOS_3,
      LEVEL_SLEEPING_GOBBOS_4,
    ],
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
