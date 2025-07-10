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
      MOUSE_POSITION.x = ev.offsetX - 16;
      MOUSE_POSITION.y = ev.offsetY - 16;

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
  renderSimpleImage(ASSETS.COMIC.P1.TWO.GOBBO.WINDOW, true);
  renderSimpleImage(ASSETS.COMIC.P1.TWO.GOBBO.LEFT, true);
  renderSimpleImage(ASSETS.COMIC.P1.TWO.GOBBO.RIGHT, true);

  renderSimpleImage(ASSETS.COMIC.P2.ONE.BG);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.SHADOW);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.HOLDER);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.STAFF);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.HAND, true);
  renderSimpleImage(ASSETS.COMIC.P2.ONE.WIZ);
  renderSimpleImage(ASSETS.COMIC.P2.MASK);
  renderSimpleImage(ASSETS.COMIC.OUTLINE);

  game.ctx.restore();

  return true;
};
