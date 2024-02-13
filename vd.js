let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

    document.addEventListener(isTouchDevice ? 'touchmove' : 'mousemove', (e) => {
      const touchEvent = isTouchDevice ? e.touches[0] : e;

      if (!this.rotating) {
        this.mouseX = touchEvent.clientX;
        this.mouseY = touchEvent.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = touchEvent.clientX - this.touchX;
      const dirY = touchEvent.clientY - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener(isTouchDevice ? 'touchstart' : 'mousedown', (e) => {
      if (this.holdingPaper) return;

      const touchEvent = isTouchDevice ? e.touches[0] : e;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0 || isTouchDevice) {
        this.touchX = touchEvent.clientX;
        this.touchY = touchEvent.clientY;
        this.prevMouseX = this.touchX;
        this.prevMouseY = this.touchY;
      }

      if (e.button === 2 && !isTouchDevice) {
        this.rotating = true;
      }
    });

    window.addEventListener(isTouchDevice ? 'touchend' : 'mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
