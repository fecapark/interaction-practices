import SpinnerGuide from "./SpinnerGuide.js";
import BallGuide from "./BallGuide.js";

class GuideManager {
  constructor(app) {
    this.app = app;

    // About guide canvas
    this.$canvas = null;
    this.ctx = null;
    this.createGuideCanvas();

    // Guides
    this.currentGuideIndex = -1;
    this.guides = [];

    // Parameters
    this.guideInterval = 1;

    // About resize
    this.resize();
  }

  setGuide() {
    this.currentGuideIndex = 0;
    this.guides = [
      new SpinnerGuide(this.$canvas, this.ctx, this.app),
      new BallGuide(this.$canvas, this.ctx, this.app)
    ];
    this.resize();
  }

  startNextGuide(jump = 1) {
    this.currentGuideIndex += jump;
  }

  draw() {
    if (this.isGuideNotStart() || this.isAllGuideEnd()) return;
    this.guides[this.currentGuideIndex].draw();
  }

  update() {
    if (this.isGuideNotStart() || this.isAllGuideEnd()) return;
    this.guides[this.currentGuideIndex].update();
  }

  resize() {
    if (this.isGuideNotStart()) return;

    const stageWidth = document.body.clientWidth;
    const stageHeight = document.body.clientHeight;

    for (const guide of this.guides) {
      guide.resize(stageWidth, stageHeight);
    }
  }

  createGuideCanvas() {
    this.$canvas = document.createElement("canvas");
    this.ctx = this.$canvas.getContext("2d");
    this.$canvas.id = "guide-canvas";

    document.body.appendChild(this.$canvas);
  }

  isGuideNotStart() {
    return this.currentGuideIndex < 0;
  }

  isAllGuideEnd() {
    return this.currentGuideIndex >= this.guides.length;
  }
}

export default GuideManager;
