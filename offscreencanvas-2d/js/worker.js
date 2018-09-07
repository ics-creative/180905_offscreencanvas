importScripts('heavyrendering2d.js');

class WorkerMain {
  constructor(canvas) {
    this.renderer = new HeavyRendering2D(canvas);

    this.render();
  };

  update(value) {
    this.renderer.update(value);
  }

  render() {
    this.renderer.render();

    requestAnimationFrame(() => this.render());
  }
}

let workerMain = null;
onmessage = (event) => {
  switch (event.data.type) {
    case 'init':
      workerMain = new WorkerMain(event.data.canvas);
      workerMain.update(event.data.num);
      break;
    case 'update':
      workerMain.update(event.data.num);
      break;
    default:
      break;
  }
};