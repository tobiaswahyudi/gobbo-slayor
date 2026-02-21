const WORLD_WIZ_SIZE = 96;
const WORLD_WIZ_PADDING = (SQUARE_SIZE - WORLD_WIZ_SIZE) * 0.5;

const MOVE_DISTANCE = 50;
const LEVEL_MOVE_ANIM_HALF_DUR = 16;

const WORLD_MAP = `
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|..
..|..|..|..|..|..|..|Cr
..|..|..|..|Cr|..|Cr|..
Cr|Cr|Cr|Cr|..|Cr|..|..
..|..|..|Cr|..|..|..|..
Cr|..|..|..|..|Cr|..|..
..|Wz|..|Cr|Cr|Cr|..|..
`;

const HALF_SCREEN_WIDTH = 0.5 * GAME_WIDTH;
const WIZARD_TARGET_POSITION_X = 0.2 * GAME_WIDTH;
const WIZARD_TARGET_POSITION_Y = 0.75 * GAME_HEIGHT;

const WIZARD_SAME_SIDE_SHUFFLE_FACTOR = 0.4;

const WIZARD_SINE_AMPLITUDE = 10;

const WORLD_MAP_LOCATIONS = [
  {
    id: "wiz",
    x: 2,
    y: 6,
    title: "HOME BASE",
    subtitle: "Wizard Tower",
    text: "The goblins stole your magic hats!!  >:(\nTheir tracks lead east...\n\n\n\nPress [space] to watch the intro again",
    isZone: false,
    isWizardTower: true,
    asset: ASSETS.WORLD.CAMP.GOB,
  },
  {
    id: "camp",
    x: 4,
    y: 5,
    title: "GOBLIN CAMP 1",
    subtitle: "Sleepy Hill",
    text: "Goblins are napping by the fire\nwith their stolen hats.",
    asset: ASSETS.WORLD.LEVEL.CAMP,
    isZone: true,
    levels: ZONE_1_LEVELS.length,
    cta: "Dang Gobbos! Get em!",
  },
  {
    id: "fort",
    x: 7,
    y: 5,
    title: "GOBLIN CAMP 2",
    subtitle: "Ruined Fort",
    text: "Goblins are running around the old\n ruined fort. (They're actually doing\na good job of rebuilding it.)",
    asset: ASSETS.WORLD.LEVEL.FORT,
    isZone: true,
    levels: ZONE_2_LEVELS.length,
    cta: "Don't care! Blow up the fort!\nGet your hats back!!",
  },
];

const WORLD_LAYERS = [
  {
    image: ASSETS.WORLD.SKY,
  },
  {
    image: ASSETS.WORLD.MOUNTAINS,
    alpha: 0.8,
    rotationParallax: 0.02,
    // offset: 0,
  },
  {
    image: ASSETS.WORLD.CLOUD_B,
    alpha: 0.4,
    translationParallax: 0.4,
    offset: 30,
  },
  {
    image: ASSETS.WORLD.CLOUD_F,
    alpha: 0.9,
    translationParallax: 1,
    offset: 160,
  },
  {
    image: ASSETS.WORLD.PEPPER.TREE_BG,
    rotationParallax: 0.3,
    offset: 0,
    filter: "saturate(0.7)",
  },
  {
    image: ASSETS.WORLD.GROUND,
  },
  {
    image: ASSETS.WORLD.PEPPER.TREE_FG,
    rotationParallax: 1,
    offset: 0,
  },
  {
    image: ASSETS.WORLD.PEPPER.TREE_FG,
    rotationParallax: 1.5,
    offset: 30,
  },
  {
    image: ASSETS.WORLD.PEPPER.ROCKS,
    rotationParallax: 0.5,
    offset: 0,
  },
];
class WorldMap {
  constructor(game) {
    this.game = game;
    this.state = LevelState.make({
      level: WORLD_MAP,
    });
    this.currentLocation = null;

    this.levelIndex = 0;
    this.ordinate = 0;

    this.levelRotationTweenValue = new Position(0, 0);
    this.levelPositionTweenValue = new Position(0, 0);

    this.animations = [];

    this.silverAnimation = false;
    this.goldAnimation = false;

    // When starting, wizard is on the left
    this.wizardPosition = new Position(
      HALF_SCREEN_WIDTH - WIZARD_TARGET_POSITION_X,
      WIZARD_TARGET_POSITION_Y
    );
    this.wizardTweenPosition = this.wizardPosition.clone();
    this.wizardSinePosition = new Position(0, 0);

    this.wizardOnLeft = true;
  }

  handleInput(keyCode) {
    const inputBlockedByAnimation = this.animations.some((a) => a.blocksInput);
    if (inputBlockedByAnimation) return true;

    switch (keyCode) {
      case "ArrowLeft":
      case "KeyA":
        this.levelMove(false);
        return true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.levelMove(true);
        return true;
        break;
      case "Space":
        this.goToZone();
        return true;
        break;
      case "KeyR":
        this.resetProgress();
        return true;
        break;
      default:
        return false;
    }
  }

  levelMove(goingRight) {
    const delta = goingRight ? 1 : -1;

    let wizardMoveTarget = 0;
    let wizardMidMoveTarget = 0;

    // if(goingRight) {
    //   wizardMoveTarget = HALF_SCREEN_WIDTH - WIZARD_TARGET_POSITION_X;
    //   if(this.wizardOnLeft) {
    //     // Same Side Shuffle
    //     wizardMidMoveTarget = HALF_SCREEN_WIDTH - WIZARD_TARGET_POSITION_X * WIZARD_SAME_SIDE_SHUFFLE_FACTOR;
    //   } else {
    //     wizardMidMoveTarget = HALF_SCREEN_WIDTH;
    //   }
    // } else {
    //   wizardMoveTarget = HALF_SCREEN_WIDTH + WIZARD_TARGET_POSITION_X;
    //   if(!this.wizardOnLeft) {
    //     // Same Side Shuffle
    //     wizardMidMoveTarget = HALF_SCREEN_WIDTH + WIZARD_TARGET_POSITION_X * WIZARD_SAME_SIDE_SHUFFLE_FACTOR;
    //   } else {
    //     wizardMidMoveTarget = HALF_SCREEN_WIDTH;
    //   }
    // }

    // this.animations.push(
    //   new MotionTweenAnimation(
    //     this.wizardTweenPosition,
    //     this.wizardTweenPosition.clone(),
    //     new Position(wizardMidMoveTarget, WIZARD_TARGET_POSITION_Y),
    //     LEVEL_MOVE_ANIM_HALF_DUR,
    //     {
    //       callback: () => {
    //         this.animations.push(
    //           new MotionTweenAnimation(
    //             this.wizardTweenPosition,
    //             this.wizardTweenPosition.clone(),
    //             new Position(wizardMoveTarget, WIZARD_TARGET_POSITION_Y),
    //             LEVEL_MOVE_ANIM_HALF_DUR
    //           )
    //         );
    //       }
    //     }
    //   )
    // );
    // this.animations.push(
    //   new SineAnimation(
    //     this.wizardSinePosition,
    //     LEVEL_MOVE_ANIM_HALF_DUR * 2,
    //     0,
    //     3,
    //     0
    //   )
    // );

    this.wizardOnLeft = goingRight;

    this.animations.push(
      new MotionTweenAnimation(
        this.levelRotationTweenValue,
        new Position(0, 0),
        new Position(delta * -0.377, 0),
        LEVEL_MOVE_ANIM_HALF_DUR,
        {
          callback: () => {
            this.levelIndex += delta;
            console.log("level move callback", this.levelIndex);
            this.animations.push(
              new MotionTweenAnimation(
                this.levelRotationTweenValue,
                new Position(delta * 0.377, 0),
                new Position(0, 0),
                LEVEL_MOVE_ANIM_HALF_DUR
              )
            );
          },
        }
      )
    );
    this.animations.push(
      new MotionTweenAnimation(
        this.levelPositionTweenValue,
        this.levelPositionTweenValue.clone(),
        this.levelPositionTweenValue.add(
          new Position(delta * -MOVE_DISTANCE, 0)
        ),
        LEVEL_MOVE_ANIM_HALF_DUR * 2,
        {
          blocksInput: true,
        }
      )
    );
  }

  // World Map Rendering
  render() {
    const { width, height } = this.game;

    const GROUND_RADIUS = 2.5 * width;

    WORLD_LAYERS.forEach((layer) => {
      this.game.ctx.save();
      const ord = layer.offset
        ? this.levelPositionTweenValue.x + layer.offset
        : this.levelPositionTweenValue.x;
      if (!!layer.alpha) {
        this.game.ctx.globalAlpha = layer.alpha;
      }
      if (!!layer.translationParallax) {
        this.game.ctx.translate(layer.translationParallax * ord, 0);
      }
      if (!!layer.rotationParallax) {
        this.game.ctx.translate(width / 2, GROUND_RADIUS);
        this.game.ctx.rotate(layer.rotationParallax * ord * 0.01);
        this.game.ctx.translate(-width / 2, -GROUND_RADIUS);
      }
      if (!!layer.filter) {
        this.game.ctx.filter = layer.filter;
      }
      this.game.drawImage(layer.image, 0, 0, width, height);
      this.game.ctx.restore();
    });

    this.game.ctx.save();
    const levelRotation = this.levelRotationTweenValue.x;
    this.game.ctx.translate(width / 2, GROUND_RADIUS);
    this.game.ctx.rotate(levelRotation);
    this.game.ctx.translate(-width / 2, -GROUND_RADIUS);
    if (this.levelIndex > 0 && WORLD_MAP_LOCATIONS[this.levelIndex]?.asset) {
      this.game.drawImage(
        WORLD_MAP_LOCATIONS[this.levelIndex].asset,
        0,
        0,
        width,
        height
      );
    }
    this.game.ctx.restore();

    // Game area background
    // this.game.drawRect(0, 0, width, height, { fill: "#C5BAB5" });

    // this.game.drawImage(
    //   ASSETS.WORLD.MAP,
    //   BOARD_PADDING,
    //   BOARD_PADDING,
    //   BOARD_SIZE,
    //   BOARD_SIZE
    // );

    // // World Outline
    // this.game.drawRect(32, 32, 512, 512, {
    //   fill: "",
    //   stroke: "#BDAFA1",
    //   strokeWidth: 4,
    // });

    // this.game.ctx.globalAlpha = 0.75;
    // this.game.drawImage(ASSETS.UI.TITLE, 54, 96, 384, 128);
    // this.game.ctx.globalAlpha = 0.5;
    // this.game.drawImage(ASSETS.UI.CREDITS, 320, 224, 128, 64);
    // this.game.ctx.globalAlpha = 1;

    // this.currentLocation = WORLD_MAP_LOCATIONS.find(
    //   (location) =>
    //     location.x === this.state.player.x && location.y === this.state.player.y
    // );

    // if (this.currentLocation) {
    //   this.renderZoneSidebar();
    // } else {
    //   this.renderEmptySidebar();
    // }

    // WORLD_MAP_LOCATIONS.forEach((location) => {
    //   if (!location.asset) return;
    //   const silverStars = this.game.progress.getLevelSilver(location.id);
    //   const isZoneDone = silverStars == location.levels;
    //   const status = isZoneDone ? "CLEAR" : "GOB";
    //   const asset = location.asset[status];
    //   this.game.drawImage(
    //     asset,
    //     cellCorner(location.x) + BOARD_PADDING,
    //     cellCorner(location.y) + BOARD_PADDING,
    //     SQUARE_SIZE,
    //     SQUARE_SIZE
    //   );
    // });

    this.game.ctx.beginPath();
    this.game.ctx.fillStyle = "#00000044";
    this.game.ctx.ellipse(
      0.3 * width + WORLD_WIZ_SIZE * 0.28,
      0.75 * height + WORLD_WIZ_SIZE * 0.97,
      WORLD_WIZ_SIZE * 0.29,
      WORLD_WIZ_SIZE * 0.1,
      0,
      0,
      Math.PI * 2
    );
    this.game.ctx.ellipse(
      0.3 * width + WORLD_WIZ_SIZE * 0.65,
      0.75 * height + WORLD_WIZ_SIZE * 0.97,
      WORLD_WIZ_SIZE * 0.18,
      WORLD_WIZ_SIZE * 0.06,
      0,
      0,
      Math.PI * 2
    );
    this.game.ctx.fill();

    // const wizardX = this.wizardTweenPosition.x + this.wizardSinePosition.x;
    // const wizardY = this.wizardTweenPosition.y// + this.wizardSinePosition.x;

    this.game.ctx.save();

    this.game.ctx.translate(width / 2, GROUND_RADIUS);
    this.game.ctx.rotate(layer.rotationParallax * ord * 0.01);
    this.game.ctx.translate(-width / 2, -GROUND_RADIUS);
    
    this.game.drawImage(
      ASSETS.SPRITE.WIZ,
      wizardX,
      wizardY,
      WORLD_WIZ_SIZE,
      WORLD_WIZ_SIZE
    );

    this.game.ctx.restore();

    this.animations.forEach((anim) => anim.tick(this.game));

    console.log("animations", this.animations);

    const hadAnimations = this.animations.length > 0;

    this.animations = this.animations.filter((anim) => !anim.finished);

    // return true;
    return hadAnimations;
  }

  getDirVec(direction) {
    switch (direction) {
      case Direction.UP:
        return [0, -1];
        break;
      case Direction.DOWN:
        return [0, 1];
        break;
      case Direction.LEFT:
        return [-1, 0];
        break;
      case Direction.RIGHT:
        return [1, 0];
        break;
    }
    return [0, 0];
  }

  verifyMoveBounds(srcX, srcY, moveX, moveY) {
    const newX = srcX + moveX;
    const newY = srcY + moveY;
    if (isOutOfBounds(this.state.size, newX, newY)) {
      return false;
    }
    if (this.state.crates.some((wall) => wall.x === newX && wall.y === newY)) {
      return false;
    }
    return true;
  }

  tryMove(src, moveX, moveY) {
    if (!this.verifyMoveBounds(src.x, src.y, moveX, moveY)) return false;
    src.x += moveX;
    src.y += moveY;
    return true;
  }

  // Game Logic
  makeMove(direction) {
    const dirVec = this.getDirVec(direction);
    const ok = this.tryMove(this.state.player, dirVec[0], dirVec[1]);
  }

  // Handle player movement
  handleMovement(deltaX, deltaY) {
    if (
      this.state.player.x + deltaX < 0 ||
      this.state.player.x + deltaX > 7 ||
      this.state.player.y + deltaY < 0 ||
      this.state.player.y + deltaY > 7
    ) {
      return false;
    }

    this.state.player.x += deltaX;
    this.state.player.y += deltaY;
  }

  renderEmptySidebar() {
    this.animations = [];

    const SIDEBAR_WIDTH = 224;
    const SIDEBAR_CENTER = 688;

    let topPosition = 32;

    // Sidebar background
    this.game.drawRect(576, 32, SIDEBAR_WIDTH, 512, {
      fill: "#E2D8D4",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    // Shtuff
    topPosition += 24;

    this.game.drawImage(
      ASSETS.UI.TITLE,
      SIDEBAR_CENTER - 192 / 2,
      topPosition,
      192,
      64
    );

    topPosition += 80;

    this.game.drawImage(
      ASSETS.UI.CREDITS,
      SIDEBAR_CENTER - 64,
      topPosition,
      128,
      64
    );

    topPosition += 80;

    this.game.drawRect(576, topPosition, SIDEBAR_WIDTH, 0, {
      fill: "",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    topPosition += 40;

    this.game.drawImage(
      ASSETS.TUTORIAL.MOVE,
      SIDEBAR_CENTER - 128 / 2,
      topPosition,
      128,
      128
    );
  }

  renderZoneSidebar() {
    const SIDEBAR_WIDTH = 224;
    const SIDEBAR_CENTER = 688;

    let topPosition = 32;

    this.game.drawRect(576, 32, SIDEBAR_WIDTH, 512, {
      fill: "#E2D8D4",
      stroke: "#BDAFA1",
      strokeWidth: 4,
    });

    topPosition += 24;

    this.game.drawText(
      this.currentLocation.title,
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: "700 10px Edu-SA",
        align: "center",
      }
    );

    topPosition += 10;
    topPosition += 16;

    const titleFontSize = this.state.title.length > 10 ? 14 : 18;

    this.game.drawText(
      this.currentLocation.subtitle,
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: `500 ${titleFontSize}px Edu-SA`,
        align: "center",
      }
    );

    topPosition += titleFontSize;
    topPosition += 12;

    this.game.drawRect(600, topPosition, 176, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });

    topPosition += 24;

    topPosition = this.game.drawText(
      this.currentLocation.text.split("\n"),
      SIDEBAR_CENTER,
      topPosition,
      {
        color: "#000",
        font: `500 12px Edu-SA`,
        align: "center",
        lineSpacing: 20,
      }
    );

    if (!this.currentLocation.isZone) return;

    topPosition += 24;

    this.game.drawImage(
      ASSETS.UI.STAR.SILVER,
      SIDEBAR_CENTER - 36,
      topPosition - 12,
      24,
      24
    );

    const silverStars = this.game.progress.getLevelSilver(
      this.currentLocation.id
    );

    const isZoneDone = silverStars == this.currentLocation.levels;

    this.game.drawText(
      `× ${silverStars}/${this.currentLocation.levels}`,
      SIDEBAR_CENTER,
      topPosition - 10,
      {
        color: isZoneDone ? "#551280" : "#000",
        font: `500 24px Tiny5`,
        align: "left",
      }
    );

    if (isZoneDone) {
      // woohoo!
      const pushAnimation = (top, current) => {
        if (this.currentLocation != current) return;
        this.animations.push(
          new EtherealAnimation(
            SIDEBAR_CENTER - 24,
            top,
            ASSETS.UI.STAR.SILVER,
            24,
            {
              etherealInFrames: 1,
              etherealOutFrames: 30,
              etherealEnd: 1.8,
              etherealStart: 1,
            },
            () => {
              setTimeout(() => {
                pushAnimation(top, current);
              }, 100);
            }
          )
        );
      };

      if (this.animations.length == 0) {
        pushAnimation(topPosition, this.currentLocation);
      }

      topPosition += 24;

      topPosition = this.game.drawText(
        `Great job!!!`,
        SIDEBAR_CENTER,
        topPosition,
        {
          color: "#551280",
          font: `500 14px Edu-SA`,
          align: "center",
        }
      );
    } else {
      topPosition += 12;
    }

    topPosition += 24;

    this.game.drawImage(
      ASSETS.UI.STAR.GOLD,
      SIDEBAR_CENTER - 36,
      topPosition - 12,
      24,
      24
    );

    const goldStars = this.game.progress.getLevelGold(this.currentLocation.id);

    const isGoldDone = goldStars == this.currentLocation.levels;

    this.game.drawText(
      `× ${goldStars}/${this.currentLocation.levels}`,
      SIDEBAR_CENTER,
      topPosition - 10,
      {
        color: isGoldDone ? "#551280" : "#000",
        font: `500 24px Tiny5`,
        align: "left",
      }
    );

    topPosition += 24;

    if (isZoneDone) {
      topPosition = this.game.drawText(
        "Try for all gold stars!\nYou can do it!".split("\n"),
        SIDEBAR_CENTER,
        topPosition,
        {
          color: "#000",
          font: `500 12px Edu-SA`,
          align: "center",
          lineSpacing: 16,
        }
      );
    } else {
      topPosition = this.game.drawText(
        this.currentLocation.cta.split("\n"),
        SIDEBAR_CENTER,
        topPosition,
        {
          color: "#000",
          font: `500 12px Edu-SA`,
          align: "center",
          lineSpacing: 16,
        }
      );
    }

    topPosition += 24;

    // Press Space

    this.game.drawImage(
      ASSETS.UI.SPACEBAR,
      SIDEBAR_CENTER + 2,
      topPosition - 9,
      54,
      18
    );

    this.game.drawText("Press ", SIDEBAR_CENTER - 2, topPosition - 8, {
      color: "#000",
      font: `500 16px Tiny5`,
      align: "right",
    });

    this.game.drawRect(624, topPosition, 12, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });

    this.game.drawRect(752, topPosition, 12, 0, {
      fill: "",
      stroke: "#000",
      strokeWidth: 2,
    });
  }

  goToZone() {
    if (this.currentLocation && this.currentLocation.isWizardTower) {
      this.game.scene = "comic";
      this.game.comic = new IntroComic(this.game);
      return;
    }

    if (!this.currentLocation || !this.currentLocation.isZone) return;

    this.animations.push(
      new TransitionAnimation(TRANSITION_DIRECTION.OUT, () => {
        this.game.zoneMap.animations.push(
          new TransitionAnimation(TRANSITION_DIRECTION.IN)
        );
        this.game.scene = "zone";
      })
    );

    this.game.currentZone = this.currentLocation;
    this.game.zoneMap = new ZoneMap(this.game);
    this.game.zoneMap.currentLevel = null;
  }

  resetProgress() {
    if (this.currentLocation && this.currentLocation.id == "wiz") {
      this.game.progress = new GameProgress();
      this.game.progress.saveProgress();
    }
  }
}
