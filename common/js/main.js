import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.js';

/**
 * メインスレッドで動作する共通処理です。
 */
export class Main {

  /**
   * コンストラクタです。
   *
   * @param renderingClass レンダリングに使用するクラス
   */
  constructor(renderingClass) {
    this.useWorker = true;
    this.stats = null;
    this.renderingClass = renderingClass;
    this.renderer = null;
    this.worker = null;
    this.init();
  };

  init() {
    // ハッシュ値によってOffscreenCanvasおよびWorkerの有効/無効を設定
    if (location.hash) {
      const hashValue = location.hash.split('#').join('');
      this.useWorker = hashValue === 'on';
    }

    // Canvas要素を取得
    const canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // OffscreenCanvasに対応していない環境の場合
    if (!canvas.transferControlToOffscreen) {
      canvas.style.display = 'none';
      document.getElementById('btn').style.display = 'none';
      document.getElementById('notSupportedDescription').style.display = 'block';
      return;
    }

    // ハートボタンの初期化
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

    // Statsの初期化
    this.stats = new Stats();
    document.getElementById('contents').appendChild(this.stats.domElement);

    // UIの初期化
    var GUI = function () {
      this.num = 30000;
    };
    const data = new GUI();

    var gui = new dat.GUI({autoPlace: false});
    const numSlider = gui.add(data, 'num', 500, 30000).step(500);
    numSlider.onFinishChange((value) => {
      if (this.useWorker) {
        // Workerスレッドでレンダリングする場合

        // Workerに変更する値を渡す
        this.worker.postMessage({type: 'update', num: value});
      } else {
        // メインスレッドでレンダリングする場合
        this.renderer.update(value);
      }
    });
    document.getElementById('guiContainer').appendChild(gui.domElement);

    // レンダラーの初期化
    if (this.useWorker) {
      // Workerスレッドでレンダリングする場合

      // Canvas要素の描画コントロールをOffscreenCanvasに移譲
      const offscreenCanvas = canvas.transferControlToOffscreen();

      // Workerを作成し、OffscreenCanvasを渡す
      this.worker = new Worker('js/worker.js');
      this.worker.postMessage({type: 'init', canvas: offscreenCanvas, num: data.num}, [offscreenCanvas]);
    } else {
      // メインスレッドでレンダリングする場合
      this.renderer = new (this.renderingClass)(canvas);
      this.renderer.update(data.num);
    }

    this.render();
  }

  render() {
    this.stats.begin();

    // メインスレッドでレンダリングする場合
    if (!this.useWorker) {
      this.renderer.render();
    }

    this.stats.end();

    requestAnimationFrame(() => this.render())
  }
}