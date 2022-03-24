import Vector2 from "../lib/Vector.js";
class Spinner {
  constructor(ctx, app) {
    this.ctx = ctx;
    this.app = app;

    // Sizes
    this.width = 0;
    this.height = 0;
    this.heightRatio = 0.15;
    this.stageWidth = 0;
    this.stageHeight = 0;
    this.interactionAreaRadius = 0;

    // Positions
    this.pos = new Vector2(0, 0); // Represents center position
    this.topLeft = new Vector2(0, 0); // Top-left position

    // Parameters
    this.rotate = 0;
    this.rspeed = -0.04; // 0.05
    this.maxRspeed = 0.05;
    this.sizeSpeed = 0;
    this.shadowOpacity = 0.4;

    // States
    this.pauseSpining = false;
    this.appears = false;
    this.rotateClockWise = true;
  }

  update() {
    this.rePosition();
    this.spin();

    if (!this.appears) {
      this.appearAnimation();
    }
  }

  draw() {
    this.ctx.save();
    this.setRotated();
    this.drawShadow();
    this.drawSpinner();
    this.drawScrew();
    this.ctx.restore();
  }

  spin() {
    const pointerManager = this.app.getModules().pointerManager;
    const accel = 0.001;

    if (!this.appears || this.pauseSpining) return;

    if (!pointerManager.isSpinnerDown) {
      this.rspeed += accel;
      this.rspeed = Math.min(this.rspeed, this.maxRspeed);
      this.rotate += this.rspeed * (this.rotateClockWise ? 1 : -1);
    }
    this.rotate %= 2 * Math.PI;

    // console.log(this.rspeed);
  }

  setRotated() {
    this.ctx.translate(this.pos.x, this.pos.y);
    this.ctx.rotate(this.rotate);
    this.ctx.translate(-this.pos.x, -this.pos.y);
  }

  drawShadow() {
    if (this.appears) {
      this.shadowOpacity -= 0.06;
      this.shadowOpacity = Math.max(this.shadowOpacity, 0);
    }

    this.ctx.shadowColor = `rgba(0, 0, 0, ${this.shadowOpacity})`;
    this.ctx.shadowBlur = 5;

    const pointerManager = this.app.getModules().pointerManager;

    if (pointerManager.isSpinnerDown) {
      this.shadowOpacity = 0.4;
      this.ctx.shadowOffsetX = 7;
      this.ctx.shadowOffsetY = 7;
    } else {
      this.ctx.shadowOffsetX = 4;
      this.ctx.shadowOffsetY = 4;
    }
  }

  drawSpinner() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.topLeft.x, this.topLeft.y, this.width, this.height);
  }

  drawScrew() {
    const screwRadius = this.height / 6;

    // Draw screw's body
    this.ctx.beginPath();
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.fillStyle = "#c3c3c3";
    this.ctx.arc(this.pos.x, this.pos.y, screwRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw screw's hole
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#858585";
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(this.pos.x - screwRadius * 0.6, this.pos.y);
    this.ctx.lineTo(this.pos.x + screwRadius * 0.6, this.pos.y);
    this.ctx.moveTo(this.pos.x, this.pos.y - screwRadius * 0.6);
    this.ctx.lineTo(this.pos.x, this.pos.y + screwRadius * 0.6);
    this.ctx.stroke();
  }

  appearAnimation() {
    const bounceFactor = 0.8;
    const accel = (this.maxWidth - this.width) / 6;

    this.sizeSpeed += accel;
    this.sizeSpeed *= bounceFactor;
    this.width += this.sizeSpeed;
    this.height = this.width * this.heightRatio;

    if (Math.abs(this.maxWidth - this.width) < 0.01) {
      this.appears = true;
      this.app.getModules().guideManager.guidingSpinner = true;
      this.app.getModules().guideManager.startFadeIn = true;
    }
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    // Resize
    this.maxWidth = 400;

    // this.maxWidth = Math.max(Math.min(stageWidth / 2.5, 400), 200);
    this.balanceSize();
    // this.previousMaxWidth = this.maxWidth;

    // Reposition
    this.rePosition();
  }

  rePosition() {
    this.pos.x = this.app.stageWidth / 2;
    this.pos.y = this.app.stageHeight / 2;
    this.topLeft.x = this.pos.x - this.width / 2;
    this.topLeft.y = this.pos.y - this.height / 2;
  }

  balanceSize() {
    // this.width *=
    //   this.maxWidth /
    //   (this.previousMaxWidth ? this.previousMaxWidth : this.maxWidth);
    // this.height = this.width * this.heightRatio;

    this.interactionAreaRadius = Math.sqrt(
      Math.pow(this.maxWidth / 2, 2) +
        Math.pow((this.maxWidth * this.heightRatio) / 2, 2)
    );
  }
}

export default Spinner;
