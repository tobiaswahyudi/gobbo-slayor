const WORLD_WIZ_SIZE = 96;
const MOVE_DISTANCE = 50;
const LEVEL_MOVE_ANIM_HALF_DUR = 16;

const HALF_SCREEN_WIDTH = 0.5 * GAME_WIDTH;
const WIZARD_TARGET_POSITION_X = 0.3 * GAME_WIDTH;
const WIZARD_TARGET_POSITION_Y = 0.75 * GAME_HEIGHT;

const WIZARD_TARGET_POSITION_THETA = -0.2;

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
    asset: ASSETS.WORLD.LEVEL.TOWER,
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
  {
    id: "castle",
    x: 7,
    y: 5,
    title: "GOBLIN CAMP 3",
    subtitle: "Ransacked Castle",
    text: "They've taken over a castle and loaded up with Anti-Magic armor! Magic-proof doesn't mean Revenge-proof! Get em!",
    asset: ASSETS.WORLD.LEVEL.CASTLE,
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
    this.currentLocation = null;

    this.levelIndex = 0;
    this.ordinate = 0;

    this.levelRotationTweenValue = new Position(0, 0);
    this.levelPositionTweenValue = new Position(0, 0);

    this.animations = [];

    this.silverAnimation = false;
    this.goldAnimation = false;

    // When starting, wizard is on the left
    this.wizardTheta = WIZARD_TARGET_POSITION_THETA;
    this.wizardTweenTheta = new Position(0, 0);
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
      case "ArrowRight":
      case "KeyD":
        this.levelMove(true);
        return true;
      case "Space":
        this.goToZone();
        return true;
      case "KeyR":
        this.resetProgress();
        return true;
      default:
        return false;
    }
  }

  levelMove(goingRight) {
    const delta = goingRight ? 1 : -1;

    this.animations.push(
      new MotionTweenAnimation(
        this.levelRotationTweenValue,
        new Position(0, 0),
        new Position(delta * -0.377, 0),
        LEVEL_MOVE_ANIM_HALF_DUR,
        {
          callback: () => {
            this.levelIndex += delta;
            this.wizardOnLeft = goingRight;
            this.animations.push(
              new MotionTweenAnimation(
                this.levelRotationTweenValue,
                new Position(delta * 0.377, 0),
                new Position(0, 0),
                LEVEL_MOVE_ANIM_HALF_DUR
              )
            );
            this.animations.push(
              new MotionTweenAnimation(
                this.wizardTweenTheta,
                new Position(-2 * delta * 0.377, 0),
                new Position(0, 0),
                LEVEL_MOVE_ANIM_HALF_DUR * 2
              )
            )
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
    if (WORLD_MAP_LOCATIONS[this.levelIndex]?.asset) {
      this.game.drawImage(
        WORLD_MAP_LOCATIONS[this.levelIndex].asset,
        0,
        0,
        width,
        height
      );
    }
    this.game.ctx.restore();

    this.game.ctx.save();

    const heightRad = height - WIZARD_TARGET_POSITION_Y;

    this.game.ctx.translate(width / 2, GROUND_RADIUS + heightRad);
    this.game.ctx.rotate(this.levelRotationTweenValue.x + this.wizardTweenTheta.x);
    this.game.ctx.translate(-width / 2, -(GROUND_RADIUS + heightRad));

    const scaleX = this.wizardOnLeft ? 1 : -1;

    this.game.ctx.scale(scaleX, 1);

    this.game.ctx.beginPath();
    this.game.ctx.fillStyle = "#00000044";

    const shadowY = 0.75 * height + WORLD_WIZ_SIZE * 0.97;
    const wizardX = -HALF_SCREEN_WIDTH + scaleX * HALF_SCREEN_WIDTH + WIZARD_TARGET_POSITION_X;

    this.game.ctx.ellipse(
      wizardX + WORLD_WIZ_SIZE * 0.28,
      shadowY,
      WORLD_WIZ_SIZE * 0.29,
      WORLD_WIZ_SIZE * 0.1,
      0,
      0,
      Math.PI * 2
    );
    this.game.ctx.ellipse(
      wizardX + WORLD_WIZ_SIZE * 0.65,
      shadowY,
      WORLD_WIZ_SIZE * 0.18,
      WORLD_WIZ_SIZE * 0.06,
      0,
      0,
      Math.PI * 2
    );
    this.game.ctx.fill();

    this.game.drawImage(
      ASSETS.SPRITE.WIZ,
      wizardX,
      WIZARD_TARGET_POSITION_Y,
      WORLD_WIZ_SIZE,
      WORLD_WIZ_SIZE
    );

    this.game.ctx.restore();

    this.animations.forEach((anim) => anim.tick(this.game));

    const hadAnimations = this.animations.length > 0;

    this.animations = this.animations.filter((anim) => !anim.finished);

    return hadAnimations;
  }

  // Handle player movement
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
