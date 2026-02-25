const WORLD_WIZ_SIZE = 96;

const MOVE_DISTANCE = 50;
const LEVEL_MOVE_ANIM_HALF_DUR = 16;

const HALF_SCREEN_WIDTH = 0.5 * GAME_WIDTH;
const WIZARD_TARGET_POSITION_X = 0.3 * GAME_WIDTH;
const WIZARD_TARGET_POSITION_Y = 0.75 * GAME_HEIGHT;

const WIZARD_TARGET_POSITION_THETA = -0.2;

const POPUP_WIDTH = 320;
const POPUP_HEIGHT = 220;
const POPUP_H_POS = HALF_SCREEN_WIDTH;
const POPUP_V_POS = 200;

const WORLD_MAP_BORDERS_AND_SQUISH = true;

const WORLD_MAP_LOCATIONS = [
  {
    id: "wiz",
    title: "HOME BASE",
    subtitle: "Wizard Tower",
    text: "The goblins stole your magic hats!!  >:(\nTheir tracks lead east...\n\n\n\nOr press [space] to watch the intro again",
    isZone: false,
    isWizardTower: true,
    asset: ASSETS.WORLD.LEVEL.TOWER,
  },
  {
    id: "camp",
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
    title: "GOBLIN CAMP 2",
    subtitle: "Ruined Fort",
    text: "Goblins are running around the old ruined fort.\n (They're actually keeping it pretty clean.)",
    asset: ASSETS.WORLD.LEVEL.FORT,
    isZone: true,
    levels: ZONE_2_LEVELS.length,
    cta: "Don't care! Blow up the fort!\nGet your hats back!!",
  },
  {
    id: "castle",
    title: "GOBLIN CAMP 3",
    subtitle: "Ransacked Castle",
    text: "They've taken over a castle and loaded up with\nAnti-Magic armor! Nasty scheming goblins!",
    asset: ASSETS.WORLD.LEVEL.CASTLE,
    isZone: true,
    levels: ZONE_2_LEVELS.length,
    cta: "Magic-proof doesn't mean Revenge-proof!\nGet em!",
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

    this.popup = undefined;

    this.silverAnimation = undefined;
    this.goldAnimation = undefined;

    this.showPopup();
  }

  closePopup() {
    if (!this.popup) return;
    this.animations = [];
    this.popup = undefined;
    this.silverAnimation = undefined;
    this.goldAnimation = undefined;
  }

  showPopup(stuff) {
    this.currentLocation =
      WORLD_MAP_LOCATIONS[this.levelIndex] ?? WORLD_MAP_LOCATIONS[0];

    this.popup = new PopupAnimation(
      POPUP_WIDTH,
      POPUP_HEIGHT,
      POPUP_H_POS,
      POPUP_V_POS,
      false,
      (game, frame) => {
        // render stuff
        this.renderZoneSidebar(frame);
      },
      undefined,
      {
        blocksInput: false,
        handleInput: () => false,
        opacity: 0.8,
      },
    );
    this.animations.push(this.popup);
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

    this.closePopup();

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
                LEVEL_MOVE_ANIM_HALF_DUR,
                {
                  callback: () => {
                    this.showPopup();
                  },
                },
              ),
            );
            this.animations.push(
              new MotionTweenAnimation(
                this.wizardTweenTheta,
                new Position(-2 * delta * 0.377, 0),
                new Position(0, 0),
                LEVEL_MOVE_ANIM_HALF_DUR * 2,
              ),
            );
          },
        },
      ),
    );
    this.animations.push(
      new MotionTweenAnimation(
        this.levelPositionTweenValue,
        this.levelPositionTweenValue.clone(),
        this.levelPositionTweenValue.add(
          new Position(delta * -MOVE_DISTANCE, 0),
        ),
        LEVEL_MOVE_ANIM_HALF_DUR * 2,
        {
          blocksInput: true,
        },
      ),
    );
  }

  // World Map Rendering
  render() {
    const { width, height } = this.game;

    // squish that shit
    if (WORLD_MAP_BORDERS_AND_SQUISH) {
      this.game.drawRect(0, 0, width, height, { fill: "#C5BAB5" });

      this.game.ctx.save();
      this.game.ctx.translate(BOARD_PADDING, BOARD_PADDING);
      this.game.ctx.scale(
        1 - (2 * BOARD_PADDING) / width,
        1 - (2 * BOARD_PADDING) / height,
      );
      const bounds = new Path2D();

      bounds.moveTo(0, 0);
      bounds.lineTo(width, 0);
      bounds.lineTo(width, height);
      bounds.lineTo(0, height);
      bounds.closePath();
      this.game.ctx.clip(bounds, "evenodd");
    }

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
        height,
      );
    }
    this.game.ctx.restore();

    this.game.ctx.save();

    const heightRad = height - WIZARD_TARGET_POSITION_Y;

    this.game.ctx.translate(width / 2, GROUND_RADIUS + heightRad);
    this.game.ctx.rotate(
      this.levelRotationTweenValue.x + this.wizardTweenTheta.x,
    );
    this.game.ctx.translate(-width / 2, -(GROUND_RADIUS + heightRad));

    const scaleX = this.wizardOnLeft ? 1 : -1;

    this.game.ctx.scale(scaleX, 1);

    this.game.ctx.beginPath();
    this.game.ctx.fillStyle = "#00000044";

    const shadowY = 0.75 * height + WORLD_WIZ_SIZE * 0.97;
    const wizardX =
      -HALF_SCREEN_WIDTH +
      scaleX * HALF_SCREEN_WIDTH +
      WIZARD_TARGET_POSITION_X;

    this.game.ctx.ellipse(
      wizardX + WORLD_WIZ_SIZE * 0.28,
      shadowY,
      WORLD_WIZ_SIZE * 0.29,
      WORLD_WIZ_SIZE * 0.1,
      0,
      0,
      Math.PI * 2,
    );
    this.game.ctx.ellipse(
      wizardX + WORLD_WIZ_SIZE * 0.65,
      shadowY,
      WORLD_WIZ_SIZE * 0.18,
      WORLD_WIZ_SIZE * 0.06,
      0,
      0,
      Math.PI * 2,
    );
    this.game.ctx.fill();

    this.game.drawImage(
      ASSETS.SPRITE.WIZ,
      wizardX,
      WIZARD_TARGET_POSITION_Y,
      WORLD_WIZ_SIZE,
      WORLD_WIZ_SIZE,
    );

    this.game.ctx.restore();

    // unsquish
    if (WORLD_MAP_BORDERS_AND_SQUISH) {
      this.game.ctx.restore();
      this.game.drawRect(
        BOARD_PADDING,
        BOARD_PADDING,
        width - 2 * BOARD_PADDING,
        height - 2 * BOARD_PADDING,
        {
          fill: "",
          stroke: "#BDAFA1",
          strokeWidth: 4,
        },
      );
    }

    this.animations.forEach((anim) => anim.tick(this.game));

    const hadAnimations = this.animations.length > 0;

    this.animations = this.animations.filter((anim) => !anim.finished);

    return hadAnimations;
  }

  renderZoneSidebar(frame) {
    let topPosition = POPUP_V_POS - POPUP_HEIGHT / 2;

    topPosition += 4;

    this.game.drawText(this.currentLocation.title, POPUP_H_POS, topPosition, {
      color: "#000",
      font: "700 10px Edu-SA",
      align: "center",
    });

    topPosition += 10;
    topPosition += 16;

    //const titleFontSize = this.currentLocation.title.length > 10 ? 14 : 18;
    const titleFontSize = 18;

    this.game.drawText(
      this.currentLocation.subtitle,
      POPUP_H_POS,
      topPosition,
      {
        color: "#000",
        font: `500 ${titleFontSize}px Edu-SA`,
        align: "center",
      },
    );

    topPosition += titleFontSize;
    topPosition += 16;

    // this.game.drawRect(600, topPosition, 176, 0, {
    //   fill: "",
    //   stroke: "#000",
    //   strokeWidth: 2,
    // });

    // topPosition += 24;

    topPosition = this.game.drawText(
      this.currentLocation.text.split("\n"),
      POPUP_H_POS,
      topPosition,
      {
        color: "#000",
        font: `500 12px Edu-SA`,
        align: "center",
        lineSpacing: 20,
      },
    );

    if (!this.currentLocation.isZone) return;

    topPosition += 16;

    const STAR_OFFSET = 80;

    // Silver Stars

    this.game.drawImage(
      ASSETS.UI.STAR.SILVER,
      POPUP_H_POS - 36 - STAR_OFFSET,
      topPosition - 12,
      24,
      24,
    );

    const silverStars = this.game.progress.getLevelSilver(
      this.currentLocation.id,
    );

    const isZoneDone = silverStars == this.currentLocation.levels;

    this.game.drawText(
      `× ${silverStars}/${this.currentLocation.levels}`,
      POPUP_H_POS - STAR_OFFSET,
      topPosition - 10,
      {
        color: isZoneDone ? "#551280" : "#000",
        font: `500 24px Tiny5`,
        align: "left",
      },
    );

    if (isZoneDone && frame > 5) {
      // woohoo!

      const pushAnimation = (top, current) => {
        if (this.currentLocation != current) return;
        this.silverAnimation = new EtherealAnimation(
          POPUP_H_POS - 24 - STAR_OFFSET,
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
              // If nav closed; don't repeat
              if (this.silverAnimation) pushAnimation(top, current);
            }, 100);
          },
        );

        this.animations.push(this.silverAnimation);
      };

      if (!this.silverAnimation) {
        pushAnimation(topPosition, this.currentLocation);
      }
    }

    this.game.drawImage(
      ASSETS.UI.STAR.GOLD,
      POPUP_H_POS - 36 + STAR_OFFSET,
      topPosition - 12,
      24,
      24,
    );

    const goldStars = this.game.progress.getLevelGold(this.currentLocation.id);

    const isGoldDone = goldStars == this.currentLocation.levels;

    this.game.drawText(
      `× ${goldStars}/${this.currentLocation.levels}`,
      POPUP_H_POS + STAR_OFFSET,
      topPosition - 10,
      {
        color: isGoldDone ? "#551280" : "#000",
        font: `500 24px Tiny5`,
        align: "left",
      },
    );

    if (isGoldDone && frame > 5) {
      // woohoo!

      const pushAnimation = (top, current) => {
        if (this.currentLocation != current) return;
        this.goldAnimation = new EtherealAnimation(
          POPUP_H_POS - 24 + STAR_OFFSET,
          top,
          ASSETS.UI.STAR.GOLD,
          24,
          {
            etherealInFrames: 1,
            etherealOutFrames: 30,
            etherealEnd: 1.8,
            etherealStart: 1,
          },
          () => {
            setTimeout(() => {
              // If nav closed; don't repeat
              if (this.goldAnimation) pushAnimation(top, current);
            }, 100);
          },
        );

        this.animations.push(this.goldAnimation);
      };

      if (!this.goldAnimation) {
        pushAnimation(topPosition, this.currentLocation);
      }
    }

    topPosition += 32;

    if (isGoldDone) {
      topPosition += 6;
      topPosition = this.game.drawText(
        `Perfect clear!!!`,
        POPUP_H_POS,
        topPosition,
        {
          color: "#551280",
          font: `500 18px Edu-SA`,
          align: "center",
        },
      );

      topPosition += 12;
    } else if (isZoneDone) {
      topPosition = this.game.drawText(`Great job!`, POPUP_H_POS, topPosition, {
        color: "#551280",
        font: `500 12px Edu-SA`,
        align: "center",
      });

      topPosition += 12;

      topPosition = this.game.drawText(
        "Try for all gold stars! You can do it!".split("\n"),
        POPUP_H_POS,
        topPosition,
        {
          color: "#000",
          font: `500 12px Edu-SA`,
          align: "center",
          lineSpacing: 16,
        },
      );
    } else {
      topPosition = this.game.drawText(
        this.currentLocation.cta.split("\n"),
        POPUP_H_POS,
        topPosition,
        {
          color: "#000",
          font: `500 12px Edu-SA`,
          align: "center",
          lineSpacing: 16,
        },
      );
    }

    topPosition += 24;

    // Press Space

    this.game.drawImage(
      ASSETS.UI.SPACEBAR,
      POPUP_H_POS + 2,
      topPosition - 9,
      54,
      18,
    );

    this.game.drawText("Press ", POPUP_H_POS - 2, topPosition - 8, {
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
      this.animations.push(
        new TransitionAnimation(
          TRANSITION_DIRECTION.OUT,
          {
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            center: new Position(GAME_WIDTH / 2, GAME_HEIGHT / 2),
            absoluteSize: true,
            color: "#000000",
            frames: 30,
          },
          () => {
            this.game.scene = "comic";
            this.game.comic = new IntroComic(this.game);
          },
        ),
      );
      return;
    }

    if (!this.currentLocation || !this.currentLocation.isZone) return;

    this.game.currentZone = this.currentLocation;
    this.game.zoneMap = new ZoneMap(this.game);
    this.game.zoneMap.currentLevel = null;

    this.animations.push(
      new TransitionAnimation(
        TRANSITION_DIRECTION.OUT,
        {
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          center: new Position(GAME_WIDTH / 2, GAME_HEIGHT / 2),
        },
        () => {
          this.game.zoneMap.animations.push(
            new TransitionAnimation(TRANSITION_DIRECTION.IN, {
              width: GAME_WIDTH_NET,
              height: GAME_HEIGHT_NET,
              center: new Position(GAME_WIDTH / 2, GAME_HEIGHT / 2),
            }),
          );
          this.game.scene = "zone";
        },
      ),
    );
  }

  resetProgress() {
    if (this.currentLocation && this.currentLocation.id == "wiz") {
      this.game.progress = new GameProgress();
      this.game.progress.saveProgress();
    }
  }
}
