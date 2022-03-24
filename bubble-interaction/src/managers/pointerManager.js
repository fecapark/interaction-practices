import Vector2 from "../lib/Vector.js";

class PointerManager {
  constructor(ctx, app) {
    this.ctx = ctx;
    this.app = app;

    // Positions
    this.offsetPos = new Vector2(0, 0);

    // States
    this.preventEvent = false;
    this.isSpinnerDown = false;
    this.isBackgroundDown = false;

    // Pointer events
    document.addEventListener("pointerdown", this.onPointerDown.bind(this));
    document.addEventListener("pointermove", this.onPointerMove.bind(this));
    document.addEventListener("pointerup", this.onPointerUp.bind(this));

    // Prevent events
    document.querySelector(".about").addEventListener("pointerdown", () => {
      this.preventEvent = true;
    });
  }

  isDowninSpinnerArea(x, y) {
    const spinner = this.app.getModules().spinner;

    console.log();

    return spinner.pos.dist(new Vector2(x, y)) <= spinner.interactionAreaRadius;
  }

  onPointerDown(e) {
    if (this.preventEvent) return;
    if (!this.app.startInteraction) return;

    const offsetPos = new Vector2(e.clientX, e.clientY).mul(
      1 / this.app.scaleRatio
    );

    if (this.isDowninSpinnerArea(offsetPos.x, offsetPos.y)) {
      this.isSpinnerDown = true;
      this.offsetPos = offsetPos;
    } else {
      this.isBackgroundDown = true;
    }
  }

  onPointerMove(e) {
    const isClockWise = (rotateCenter) => {
      const pointerPos = new Vector2(e.clientX, e.clientY)
        .mul(1 / this.app.scaleRatio)
        .sub(rotateCenter);
      const crossValue = pointerPos.cross(this.offsetPos.sub(rotateCenter));
      const theta = Math.asin(
        crossValue / (pointerPos.norm() * this.offsetPos.norm())
      );

      return theta < 0;
    };

    if (this.isSpinnerDown) {
      const spinner = this.app.getModules().spinner;
      const movePos = new Vector2(e.clientX, e.clientY)
        .mul(1 / this.app.scaleRatio)
        .sub(this.offsetPos);
      const rotateSpeed = Math.max(
        Math.min(movePos.mul(this.app.scaleRatio).norm() * 0.01, 0.05),
        0.01
      );

      console.log(
        `${movePos.mul(this.app.scaleRatio).norm()} vs ${movePos.norm()}`
      );

      if (isClockWise(spinner.pos)) {
        spinner.rotate += rotateSpeed;
        spinner.rotateClockWise = true;
      } else {
        spinner.rotate -= rotateSpeed;
        spinner.rotateClockWise = false;
      }

      this.offsetPos = new Vector2(e.clientX, e.clientY).mul(
        1 / this.app.scaleRatio
      );
    }
  }

  onPointerUp(e) {
    const handleGuides = () => {
      const guideManager = this.app.getModules().guideManager;
      const currentGuide = guideManager.getCurrentGuide();

      if (currentGuide && currentGuide.isFadeIned) {
        currentGuide.triggerExitGuide();
      }
    };

    if (this.preventEvent) {
      this.preventEvent = false;
      return;
    }

    handleGuides();

    if (!this.app.startInteraction) return;

    if (this.isBackgroundDown) {
      const offsetPos = new Vector2(e.clientX, e.clientY).mul(
        1 / this.app.scaleRatio
      );
      this.app.getModules().ballManager.createNewBall(offsetPos.x, offsetPos.y);
    }

    this.isSpinnerDown = false;
    this.isBackgroundDown = false;
  }
}

export default PointerManager;
