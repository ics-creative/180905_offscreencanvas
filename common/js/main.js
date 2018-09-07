import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.js';

export class Main {
  constructor(renderingClass) {
    this.useWorker = true;
    this.stats = null;
    this.renderer = null;
    this.worker = null;
    this.renderingClass = renderingClass;
    this.init();
  };

  init() {
    if (location.hash) {
      const hashValue = location.hash.split('#').join('');
      this.useWorker = hashValue === 'on';
    }

    const canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!canvas.transferControlToOffscreen) {
      canvas.style.display = 'none';
      document.getElementById('btn').style.display = 'none';
      document.getElementById('notSupportedDescription').style.display = 'block';
      return;
    }

    const btn = document.getElementById('btn');
    let clicked = false;
    btn.addEventListener('click', () => {
      if (clicked) {
        btn.classList.remove('clicked');
      } else {
        btn.classList.add('clicked');
      }
      clicked = !clicked;
    });

    this.stats = new Stats();
    document.getElementById('contents').appendChild(this.stats.domElement);

    var GUI = function () {
      this.num = 30000;
    };
    const data = new GUI();

    var gui = new dat.GUI({autoPlace: false});
    const numSlider = gui.add(data, 'num', 500, 30000).step(500);
    numSlider.onFinishChange((value) => {
      if (this.useWorker) {
        this.worker.postMessage({type: 'update', num: value});
      } else {
        this.renderer.update(value);
      }
    });
    document.getElementById('guiContainer').appendChild(gui.domElement);

    if (this.useWorker) {
      const offscreenCanvas = canvas.transferControlToOffscreen();
      this.worker = new Worker('js/worker.js');
      this.worker.postMessage({type: 'init', canvas: offscreenCanvas, num: data.num}, [offscreenCanvas]);
    } else {
      this.renderer = new (this.renderingClass)(canvas);
      this.renderer.update(data.num);
    }

    this.render();
  }

  render() {
    this.stats.begin();

    if (!this.useWorker) {
      this.renderer.render();
    }

    this.stats.end();

    requestAnimationFrame(() => this.render())
  }
}