let MOUSE_POSITION = new Position(0, 0);
let MOUSE_DOWN = false;

window.addEventListener("mousemove", (ev) => {
})

const SETUP_CANVAS_TEST_LISTENERS = (canvas) => {
  canvas.addEventListener("mousedown", () => {
    MOUSE_DOWN = true;
  });

  canvas.addEventListener("mouseup", () => {
    MOUSE_DOWN = false;
  });

  canvas.addEventListener("mousemove", (ev) => {
    if (MOUSE_DOWN) {
      MOUSE_POSITION.x = ev.offsetX - 100;
      MOUSE_POSITION.y = ev.offsetY - 100;

      console.log(MOUSE_POSITION);
    }
  });
};

const COMIC_TEST = (game) => {
  game.ctx.save();
  game.ctx.scale(2, 2);

  const renderSimpleImage = (image, affected = false) => {
    const offset = affected ? MOUSE_POSITION : new Position(0, 0);
    game.drawImage(image, 16 + offset.x, 16 + offset.y);
  };

  renderSimpleImage(ASSETS.COMIC.P1.SKY);
  renderSimpleImage(ASSETS.COMIC.P1.TOWER);
  // renderSimpleImage(ASSETS.COMIC.P1.ONE.DOOR)
  // renderSimpleImage(ASSETS.COMIC.P1.ONE.WINDOW)
  renderSimpleImage(ASSETS.COMIC.P1.SIGN);
  renderSimpleImage(ASSETS.COMIC.P1.GROUND);
  renderSimpleImage(ASSETS.COMIC.P1.TWO.DOOR);
  renderSimpleImage(ASSETS.COMIC.P1.TWO.WINDOW);
  renderSimpleImage(ASSETS.COMIC.P1.TWO.WIZ);
  renderSimpleImage(ASSETS.COMIC.P1.TWO.DOOR_FRAGMENTS);
  renderSimpleImage(ASSETS.COMIC.P1.TWO.GOBBO.WINDOW);
  renderSimpleImage(ASSETS.COMIC.P1.TWO.GOBBO.LEFT);
  renderSimpleImage(ASSETS.COMIC.P1.TWO.GOBBO.RIGHT);

  renderSimpleImage(ASSETS.COMIC.P2.ONE.BG);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.SHADOW);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.HOLDER);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.STAFF);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.HAND);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.WIZ);
  renderSimpleImage(ASSETS.COMIC.P2.MASK);
  renderSimpleImage(ASSETS.COMIC.OUTLINE);

  renderSimpleImage(ASSETS.COMIC.P3.SKY);
  renderSimpleImage(ASSETS.COMIC.P3.BACKGROUND);
  renderSimpleImage(ASSETS.COMIC.P3.TWO.BOOM);
  renderSimpleImage(ASSETS.COMIC.P3.TWO.GOB_EXPLODE);
  renderSimpleImage(ASSETS.COMIC.P3.GOB_RUN.ONE, true);
  renderSimpleImage(ASSETS.COMIC.P3.GOB_RUN.TWO);
  renderSimpleImage(ASSETS.COMIC.P3.FOREGROUND);
  // renderSimpleImage(ASSETS.COMIC.FG_D);
  renderSimpleImage(ASSETS.COMIC.P3.TWO.WIZ);
  renderSimpleImage(ASSETS.COMIC.P3.ONE.WIZ);
  renderSimpleImage(ASSETS.COMIC.OUTLINE);

  game.ctx.restore();

  return true;
};
