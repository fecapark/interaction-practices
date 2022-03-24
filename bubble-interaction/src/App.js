// // Todo
// 1. BallGuide - BallManager간 radius, position 코드 최적화 (완료)
// 2. BallGuide resize시 위치 resize안되는 버그 수정 (완료)
// 3. globalComposite <- 이거 적용된 위치는 색깔이 약간 빛바래는 버그 수정 (완료)
// 4. guide 실행시 화면 터치하면 바로 가이드 끝내는 코드 추가 (완료)
// 5. ball creation 위치 조정 (완료)
// 6. 문서 작성!

import Spinner from "./objects/Spinner.js";
import BallManager from "./managers/BallManager.js";
import PointerManager from "./managers/pointerManager.js";
import GuideManager from "./managers/GuideManager.js";

class App {
  constructor($target) {
    this.$canvas = $target;
    this.ctx = this.$canvas.getContext("2d");

    // States
    this.startSpinner = false;
    this.startInteraction = false;
    this.previousWidth = document.body.clientWidth;
    this.previousHeight = document.body.clientHeight;

    // Game instances
    this.spinner = new Spinner(this.ctx, this);
    this.ballManager = new BallManager(this.ctx, this);

    // Manage guides
    this.guideManager = new GuideManager(this);

    // About resize
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    // About animations
    this.animate();
    this.initTransitions();

    // Manage pointer events
    this.pointerManager = new PointerManager(this.ctx, this);
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.$canvas.width = this.stageWidth * this.pixelRatio;
    this.$canvas.height = this.stageHeight * this.pixelRatio;

    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.spinner.resize(this.stageWidth, this.stageHeight);
    this.ballManager.resize(
      this.stageWidth,
      this.stageHeight,
      this.previousWidth,
      this.previousHeight
    );
    this.guideManager.resize();

    this.previousWidth = this.stageWidth;
    this.previousHeight = this.stageHeight;
  }

  animate() {
    const makeBackground = () => {
      this.ctx.beginPath();
      this.ctx.fillStyle = "#0ebbaa";
      this.ctx.fillRect(0, 0, this.$canvas.width, this.$canvas.height);
    };

    const animateSpinner = () => {
      if (!this.startSpinner) return;

      this.spinner.update(this.stageWidth);
      this.spinner.draw();
    };

    const animateBalls = () => {
      this.ballManager.update();
      this.ballManager.draw();
    };

    this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

    // Make background color
    makeBackground();

    // About guides
    if (this.guideManager.isGuideNotStart() && this.spinner.appears) {
      this.guideManager.setGuide();
    }

    if (!this.guideManager.isAllGuideEnd()) {
      this.guideManager.update();
      this.guideManager.draw();
    } else {
      document.querySelector(".about").style.display = "block";
      this.startInteraction = true;
    }

    // About spinner
    animateSpinner();

    // About balls
    animateBalls();

    requestAnimationFrame(this.animate.bind(this));
  }

  initTransitions() {
    document.body.style.animation = `darker linear 1s`;

    const transitionInterval = 100;
    const masks = document.querySelectorAll(".mask");
    for (let i = 0; i < masks.length; i++) {
      (function(x) {
        setTimeout(function() {
          masks[i].classList.add("animate");
        }, x * transitionInterval);
      })(i);
    }

    setTimeout(() => {
      this.$canvas.classList.add("animate");
    }, transitionInterval * masks.length);
    this.$canvas.addEventListener("transitionend", () => {
      this.startSpinner = true;
      document.querySelector(".logo").style.display = "block";
    });
  }

  getModules() {
    return {
      spinner: this.spinner,
      ballManager: this.ballManager,
      pointerManager: this.pointerManager,
      guideManager: this.guideManager
    };
  }
}

export default App;
