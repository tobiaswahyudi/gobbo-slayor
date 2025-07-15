class IntroComicPanel {
  constructor(game, keyframes) {
    this.game = game;
    this.keyframes = keyframes;
    this.frame = 0;
    this.animations = [];
    this.renderFunctions = [];
  }

  tick(game, state) {
    this.keyframes = this.keyframes.filter(([frame, render, remove]) => {
      if (this.frame == frame) {
        if (isGsAnimation(render)) {
          this.animations.push(render);
        } else {
          this.renderFunctions.push([remove, render]);
        }
        return false;
      }
      return true;
    });

    this.animations.forEach((anim) => anim.tick(game));
    this.animations = this.animations.filter((anim) => !anim.finished);

    this.renderFunctions.forEach(([frame, render]) =>
      render(game, state, this.frame)
    );
    this.renderFunctions = this.renderFunctions.filter(
      ([frame, render]) => frame != this.frame
    );

    this.frame++;

    const keyframesLeft = this.keyframes.length > 0;
    return keyframesLeft;
  }
}

const juicer =
  (juiceFactor, juice = "juice") =>
  (state) =>
    state[juice].clone().scale(juiceFactor);

const renderImage = (image, positionOffsetter) => (game, state) => {
  const offset = !!positionOffsetter
    ? positionOffsetter(state).clone()
    : { x: 0, y: 0 };

  game.drawImage(image, 16 + offset.x, 16 + offset.y);
};

const renderAlternatingImages =
  (
    image1,
    image2,
    alignment = new Position(0, 0),
    alternateFrame,
    positionOffsetter
  ) =>
  (game, state, frame) => {
    const isImageTwo = Math.floor(frame / alternateFrame) % 2 == 0;
    const image = isImageTwo ? image2 : image1;

    const position = !!positionOffsetter
      ? positionOffsetter(state)
      : new Position(0, 0);

    const offset = isImageTwo ? alignment.add(position) : position;

    game.drawImage(image, 16 + offset.x, 16 + offset.y);
  };

const fetcher = (key) => (obj) => obj[key];

const chain =
  (...fns) =>
  (state) => {
    return fns.reduce((acc, fn) => fn(state).add(acc), new Position(0, 0));
  };

const imageFade = (image, fadeInFrames, fadeOutFrames) => (game, state, frame) => {
  const progress = frame / (fadeInFrames + fadeOutFrames);
  game.ctx.save();
  game.ctx.globalAlpha = progress;
  game.drawImage(image, 0, 0);
  game.ctx.restore();
};

class IntroComic {
  constructor(game) {
    this.game = game;

    this.state = {
      juice: new Position(0, 0),
      windowGobbo: new Position(0, 0),
      leftGobbo: new Position(0, 0),
      rightGobbo: new Position(0, 0),
      wizHand: new Position(-8, 22),
      fire: new Position(0, 0),

      wizard: new Position(0, 0),
      foreground: new Position(-3, -3),
      background: new Position(-12, 54),
      gobboRun: new Position(18, 12),
      groundShake: new Position(0, 0),
    };

    this.currentPanel = 0;
    this.panels = [
      new IntroComicPanel(game, [
        [0, renderImage(ASSETS.COMIC.P1.SKY)],
        [0, renderImage(ASSETS.COMIC.P1.TOWER, juicer(0.3))],
        [0, renderImage(ASSETS.COMIC.P1.ONE.DOOR, juicer(1.0)), 90],
        [0, renderImage(ASSETS.COMIC.P1.ONE.WINDOW, juicer(0.7)), 90],
        [0, renderImage(ASSETS.COMIC.P1.SIGN, juicer(0.5))],
        [0, renderImage(ASSETS.COMIC.P1.GROUND)],
        [0, renderImage(ASSETS.COMIC.P1.MASK)],
        [20, new JuiceAnimation(this.state.juice, 5, 4)],
        [50, new JuiceAnimation(this.state.juice, 5, 8)],
        [70, new JuiceAnimation(this.state.juice, 5, 12)],
        [90, renderImage(ASSETS.COMIC.P1.TWO.DOOR)],
        [90, renderImage(ASSETS.COMIC.P1.TWO.WINDOW, juicer(1.0))],
        [90, renderImage(ASSETS.COMIC.P1.TWO.WIZ)],
        [90, renderImage(ASSETS.COMIC.P1.TWO.DOOR_FRAGMENTS, juicer(1.5))],
        [
          90,
          renderImage(ASSETS.COMIC.P1.TWO.GOBBO.WINDOW, fetcher("windowGobbo")),
        ],
        [90, renderImage(ASSETS.COMIC.P1.TWO.GOBBO.LEFT, fetcher("leftGobbo"))],
        [
          90,
          renderImage(ASSETS.COMIC.P1.TWO.GOBBO.RIGHT, fetcher("rightGobbo")),
        ],
        [90, new JuiceAnimation(this.state.juice, 30, 3)],
        [
          90,
          new MotionTweenAnimation(
            this.state.windowGobbo,
            new Position(-4, -6),
            new Position(0, 0),
            60
          ),
        ],
        [
          90,
          new MotionTweenAnimation(
            this.state.leftGobbo,
            new Position(7, -11),
            new Position(0, 0),
            60
          ),
        ],
        [
          90,
          new MotionTweenAnimation(
            this.state.rightGobbo,
            new Position(-8, -5),
            new Position(0, 0),
            60
          ),
        ],
        [170, THUNK],
      ]),
      new IntroComicPanel(game, [
        [0, renderImage(ASSETS.COMIC.P2.ONE.BG)],
        [0, renderImage(ASSETS.COMIC.P2.ONE.SHADOW)],
        [0, renderImage(ASSETS.COMIC.P2.ONE.HOLDER)],
        [0, renderImage(ASSETS.COMIC.P2.ONE.STAFF)],
        [0, renderImage(ASSETS.COMIC.P2.ONE.HAND, fetcher("wizHand"))],
        [0, renderImage(ASSETS.COMIC.P2.ONE.WIZ)],
        [0, renderImage(ASSETS.COMIC.P2.MASK)],
        [
          10,
          new MotionTweenAnimation(
            this.state.wizHand,
            new Position(-8, 22),
            new Position(0, 0),
            50
          ),
        ],
        [80, renderImage(ASSETS.COMIC.P2.TWO.BG)],
        [80, renderImage(ASSETS.COMIC.P2.TWO.SHADOW, juicer(0.4, "fire"))],
        [80, renderImage(ASSETS.COMIC.P2.TWO.WIZSTAFF)],
        [80, renderImage(ASSETS.COMIC.P2.TWO.FIRE, juicer(0.8, "fire"))],
        [80, renderImage(ASSETS.COMIC.P2.TWO.BALL, juicer(1, "fire"))],
        [80, renderImage(ASSETS.COMIC.P2.MASK)],
        [80, new JuiceAnimation(this.state.fire, 30, 1)],
        [130, THUNK],
      ]),
      new IntroComicPanel(game, [
        [0, renderImage(ASSETS.COMIC.P3.SKY)],
        [
          0,
          renderImage(
            ASSETS.COMIC.P3.BACKGROUND,
            chain(fetcher("background"), juicer(0.8, "groundShake"))
          ),
        ],
        [
          0,
          renderAlternatingImages(
            ASSETS.COMIC.P3.GOB_RUN.ONE,
            ASSETS.COMIC.P3.GOB_RUN.TWO,
            new Position(-6, 0),
            4,
            fetcher("gobboRun")
          ),
          119,
        ],
        [
          0,
          renderImage(
            ASSETS.COMIC.P3.FOREGROUND,
            chain(fetcher("foreground"), juicer(0.2, "groundShake"))
          ),
        ],
        [0, renderImage(ASSETS.COMIC.P3.ONE.WIZ, fetcher("wizard")), 80],
        [0, renderImage(ASSETS.COMIC.OUTLINE)],
        [
          0,
          new MotionTweenAnimation(
            this.state.foreground,
            new Position(2, 25),
            new Position(0, 37),
            80
          ),
        ],
        [
          0,
          new MotionTweenAnimation(
            this.state.background,
            new Position(-3, 11),
            new Position(0, 0),
            80
          ),
        ],
        [
          0,
          new MotionTweenAnimation(
            this.state.wizard,
            new Position(4, -8),
            new Position(-6, -26),
            80
          ),
        ],
        [81, renderImage(ASSETS.COMIC.P3.TWO.WIZ, juicer(0.1, "groundShake"))],
        [100, renderImage(ASSETS.COMIC.P3.TWO.SAY_BOOM)],
        [
          0,
          new MotionTweenAnimation(
            this.state.gobboRun,
            new Position(18, 12),
            new Position(-8, -31),
            119
          ),
        ],
        [
          120,
          renderImage(
            ASSETS.COMIC.P3.TWO.GROUND_LIGHT,
            juicer(0.7, "groundShake")
          ),
        ],
        [
          120,
          renderImage(ASSETS.COMIC.P3.TWO.BOOM, juicer(0.8, "groundShake")),
        ],
        [
          120,
          renderImage(
            ASSETS.COMIC.P3.TWO.GOB_EXPLODE,
            juicer(1.5, "groundShake")
          ),
        ],
        [120, new JuiceAnimation(this.state.groundShake, 30, 8)],
        [200, THUNK],
      ]),
      new IntroComicPanel(game, [
        [0, new ColorFadeAnimation(30, 5, 0, "#000")],
        [34, THUNK],
      ]),
    ];
  }

  render() {
    this.game.drawRect(0, 0, this.game.width, this.game.height, {
      fill: "#000",
    });

    this.game.ctx.save();

    const mask = new Path2D();
    mask.rect(32, 32, this.game.width - 64, this.game.height - 64);
    this.game.ctx.clip(mask);
    this.game.ctx.scale(2, 2);

    for (let panel = 0; panel < this.currentPanel; panel++) {
      this.panels[panel].tick(this.game, this.state);
    }
    const keepGoing = this.panels[this.currentPanel].tick(
      this.game,
      this.state
    );
    if (!keepGoing) {
      this.currentPanel++;
    }

    renderImage(ASSETS.COMIC.OUTLINE)(this.game);

    this.game.ctx.restore();
    if (this.currentPanel == this.panels.length) return false;
    return true;
  }
}
