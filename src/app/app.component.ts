import { AfterViewInit, Component, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  /**
   * list of element to be shown on circle
   */
  list = 'ABCDEFGHI'.split('');
  /**
   * MATH objecyt reference
   */
  Math = Math;
  /**
   * interval reference
   */
  intervalId;
  /**
   * current face of 3d rotation
   */
  selectedIndex = 0;
  /**
   * item width in circle
   */
  cellWidth;
  /**
   * item height  in circle
   */
  cellHeight;
  /**
   * show horizontal mode
   */
  isHorizontal = true;
  /**
   * chage rotation
   */
  rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
  /**
   * radius of circle
   */
  radius;
  /**
   * angle between item
   */
  theta;
  /**
   * wrapper element where content will be rendered
   */
  apphabetsContainer;
  /**
   * each alphabet container width
   */
  cells;
  /**
   * select 2d circle index
   */
  setected2d = 0;
  /**
   * transform of 2d circle
   */
  transformStyle = 'rotate(0deg)';
  transformStyle3d = '';

  constructor(private renderer: Renderer2) {}
  rotateCarousel() {
    let angle = this.theta * this.selectedIndex * -1;
    this.apphabetsContainer.style.transform =
      'translateZ(' +
      -this.radius +
      'px) ' +
      this.rotateFn +
      '(' +
      angle +
      'deg)';
  }

  changeCarousel() {
    this.theta = 360 / this.list.length;
    let cellSize = this.isHorizontal ? this.cellWidth : this.cellHeight;
    this.radius = Math.round(
      cellSize / 2 / Math.tan(Math.PI / this.list.length)
    );
    for (let i = 0; i < this.cells.length; i++) {
      let cell = this.cells[i];
      if (i < this.list.length) {
        // visible cell
        cell.style.opacity = 1;
        let cellAngle = this.theta * i;
        cell.style.transform =
          this.rotateFn +
          '(' +
          cellAngle +
          'deg) translateZ(' +
          this.radius +
          'px)';
      } else {
        // hidden cell
        cell.style.opacity = 0;
        cell.style.transform = 'none';
      }
    }

    this.rotateCarousel();
  }
  ngAfterViewInit() {
    this.apphabetsContainer = document.querySelector('.apphabetsContainer');
    this.cells = this.apphabetsContainer.querySelectorAll('.apphabets');
    this.cellWidth = this.apphabetsContainer.offsetWidth;
    this.cellHeight = this.apphabetsContainer.offsetHeight;
    this.changeCarousel();
    // this.intervalId= setInterval(()=>{
    //    this.selectedIndex= (( this.selectedIndex + 1) % Number.MAX_SAFE_INTEGER);
    //   this.rotateCarousel();
    // },2000)

    //create partecles

    /* create canvas element */
    let canvas_el = document.createElement('canvas');
    canvas_el.className = 'dheeru-js-canvas-el';

    /* set size canvas */
    canvas_el.style.width = '100%';
    canvas_el.style.height = '100%';

    /* append canvas */
    let canvas = document.getElementById('dheeru-js').appendChild(canvas_el);

    this.particles(canvas);
  }

  next2d(container) {
    this.setected2d++;
    if (container.classList.contains('three-d')) {
      this.transformStyle = `rotateX(60deg) rotateZ(${
        this.theta * this.setected2d
      }deg)`;
    } else {
      this.transformStyle = `rotate(${this.theta * this.setected2d}deg)`;
    }
  }

  prev2d(container) {
    this.setected2d--;
    if (container.classList.contains('three-d')) {
      this.transformStyle = `rotateX(60deg) rotate(${
        this.theta * this.setected2d
      }deg)`;
    } else {
      this.transformStyle = `rotate(${this.theta * this.setected2d}deg)`;
    }
  }

  next() {
    this.selectedIndex++;
    this.rotateCarousel();
  }

  prev() {
    this.selectedIndex--;
    this.rotateCarousel();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  changeOrientation() {
    this.isHorizontal = !this.isHorizontal;
    this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
    this.changeCarousel();
  }

  changeView(container) {
    container.classList.toggle('three-d');
    if (container.classList.contains('three-d')) {
      this.transformStyle = `rotateX(60deg) rotate(${
        this.theta * this.setected2d
      }deg)`;
    } else {
      this.transformStyle = `rotate(${this.theta * this.setected2d}deg)`;
    }
  }

  particles(canvas) {
    let W,
      H,
      ctx,
      particleCount = 2000,
      particles = [];

    W = canvas.getBoundingClientRect().width * 0.9;
    H = canvas.getBoundingClientRect().height * 0.9;
    ctx = canvas.getContext('2d'); // settng the context to 2d rather than the 3d WEBGL
    ctx.globalCompositeOperation = 'multiply';

    //Setup particle class
    function Particle() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.direction = {
        x: 0 + Math.random() * 2,
        y: 1 + Math.random() * 2,
      };
      this.vx = (2 * Math.random() + 1) * 0.1;
      this.vy = (2 * Math.random() + 1) * 0.1;
      this.radius = Math.random() * 2; //1 * Math.random() + 1;
      this.move = function () {
        this.x += this.vx * this.direction.x;
        this.y += this.vy * this.direction.y;
      };
      this.changeDirection = function (axis) {
        this.direction[axis] *= -1;
      };
      this.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,0.5)`;
        // ctx.fillStyle = `rgba(${(Math.floor(Math.random() * (255 - 0 + 1)) + 0)},${(Math.floor(Math.random() * (255 - 0 + 1)) + 0)},${(Math.floor(Math.random() * (255 - 0 + 1)) + 0)},0.5)`;

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
      };
      this.boundaryCheck = function () {
        if (this.x >= W) {
          this.x = W;
          this.changeDirection('x');
        } else if (this.x <= 0) {
          this.x = 0;
          this.changeDirection('x');
        }
        if (this.y >= H) {
          this.y = H;
          this.changeDirection('y');
        } else if (this.y <= 0) {
          this.y = 0;
          this.changeDirection('y');
        }
      };
    } //end particle class

    function clearCanvas() {
      ctx.clearRect(0, 0, W, H);
    } //end clear canvas

    function createParticles() {
      for (let i = particleCount - 1; i >= 0; i--) {
        let p = new Particle();
        particles.push(p);
      }
    } // end createParticles

    function drawParticles() {
      for (let i = particleCount - 1; i >= 0; i--) {
        let p = particles[i];
        p.draw();
      }
    } //end drawParticles

    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.move();
        p.boundaryCheck();
      }
    } //end updateParticles

    function animateParticles() {
      clearCanvas();
      drawParticles();
      updateParticles();
      requestAnimationFrame(animateParticles);
    }
    createParticles();
    drawParticles();
    requestAnimationFrame(animateParticles);
  }
}
