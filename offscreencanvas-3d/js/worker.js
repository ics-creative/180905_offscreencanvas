importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/96/three.js');
importScripts('heavyrendering3d.js');

class WorkerMain {
  constructor(canvas) {
    this.renderer = new HeavyRendering3D(canvas);

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

workerMain = null;
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