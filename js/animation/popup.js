const POPUP_FRAMES_PER_PX = 0.012;
const POPUP_CORNER_SIZE = 32;

const RENDER_POPUP = (width, height, renderContents) => {
  const VERTICAL_FRAMES = height * POPUP_FRAMES_PER_PX;
  const HORIZONTAL_FRAMES = width * POPUP_FRAMES_PER_PX;
  return (game, frame) => {
    const hMid = BOARD_PADDING + H_BOARD_SIZE;
    const vMid = BOARD_PADDING + H_BOARD_SIZE;

    let left = 0;
    let top = 0;
    let innerWidth = 0;
    let innerHeight = 0;

    if (frame < VERTICAL_FRAMES) {
      innerWidth = 0;
      innerHeight = height * (frame / VERTICAL_FRAMES);
    } else if (frame < VERTICAL_FRAMES + HORIZONTAL_FRAMES) {
      innerWidth = width * ((frame - VERTICAL_FRAMES) / HORIZONTAL_FRAMES);
      innerHeight = height;
    } else {
      innerHeight = height;
      innerWidth = width;
    }

    left = hMid - POPUP_CORNER_SIZE - innerWidth / 2;
    top = vMid - POPUP_CORNER_SIZE - innerHeight / 2;

    // console.log({ left, top });

    game.drawRect(32, 32, BOARD_SIZE, BOARD_SIZE, {
      fill: "#BDAFA1",
    });

    // draw corners
    game.drawImage(
      ASSETS.UI.POPUP,
      left,
      top,
      POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE + innerWidth,
      top,
      POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      {
        x: 96,
        y: 0,
        width: 32,
        height: 32,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left,
      top + POPUP_CORNER_SIZE + innerHeight,
      POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      {
        x: 0,
        y: 96,
        width: 32,
        height: 32,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE + innerWidth,
      top + POPUP_CORNER_SIZE + innerHeight,
      POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      {
        x: 96,
        y: 96,
        width: 32,
        height: 32,
      }
    );
    // draw center
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE,
      top + POPUP_CORNER_SIZE,
      innerWidth,
      innerHeight,
      {
        x: 32,
        y: 32,
        width: 64,
        height: 64,
      }
    );
    // draw edges
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE,
      top,
      innerWidth,
      POPUP_CORNER_SIZE,
      {
        x: 32,
        y: 0,
        width: 64,
        height: 32,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE,
      top + POPUP_CORNER_SIZE + innerHeight,
      innerWidth,
      POPUP_CORNER_SIZE,
      {
        x: 32,
        y: 96,
        width: 64,
        height: 32,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left,
      top + POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      innerHeight,
      {
        x: 0,
        y: 32,
        width: 32,
        height: 64,
      }
    );
    game.drawImage(
      ASSETS.UI.POPUP,
      left + POPUP_CORNER_SIZE + innerWidth,
      top + POPUP_CORNER_SIZE,
      POPUP_CORNER_SIZE,
      innerHeight,
      {
        x: 96,
        y: 32,
        width: 32,
        height: 64,
      }
    );

    const mask = new Path2D();

    mask.rect(
      left + POPUP_CORNER_SIZE,
      top + POPUP_CORNER_SIZE,
      innerWidth,
      innerHeight
    );

    if (renderContents) {
      game.ctx.save();
      game.ctx.clip(mask);
      renderContents(game, frame);
      game.ctx.restore();
    }
  };
};

class PopupAnimation extends GSAnimation {
  constructor(width, height, renderContents, callback) {
    const handleInput = () => {
      return this.frame > this.frames;
    };

    super({
      frames: Math.ceil((width + height) * POPUP_FRAMES_PER_PX),
      render: RENDER_POPUP(width, height, renderContents),
      blocksInput: true,
      needsInput: true,
      handleInput,
      callback,
    });
  }
}
