/**
 * Canvasにレンダリングを行う処理です。
 * メイン/Workerどちらのスレッドからでも使用できるようになっています。
 */
class HeavyRendering2D {
  /**
   * コンストラクタです。
   *
   * @param canvas Canvasオブジェクト、もしくはOffscreenCanvasオブジェクト
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.context.globalCompositeOperation = "lighter";
    this.stageWidth = this.canvas.width;
    this.stageHeight = this.canvas.height;
    this.particleList = [];
  }

  /**
   * パーティクルを初期化します。
   *
   * @param num パーティクル数
   */
  initParticleList(num) {
    this.particleList = [];

    const SPEED = 5;
    for (let i = 0; i < num; i++) {
      const vr = Math.PI * 2 * Math.random();
      this.particleList.push({
        x: this.stageWidth * Math.random(),
        y: this.stageHeight * Math.random(),
        vx: SPEED * Math.cos(vr),
        vy: SPEED * Math.sin(vr),
        color: `hsl(${Math.floor(360 * Math.random())}, 70%, 40%)`,
      });
    }
  }

  /**
   * レンダラーの設定を更新します。
   *
   * @param value 更新プロパティ
   */
  update(value) {
    this.initParticleList(value);
  }

  /**
   * 画面を描画します。
   */
  render() {
    this.drawPraticle();
  }

  drawPraticle() {
    this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);

    const length = this.particleList.length;
    for (let i = 0; i < length; i++) {
      const particle = this.particleList[i];

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > this.stageWidth) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.stageHeight) {
        particle.vy *= -1;
      }

      this.context.beginPath();
      this.context.fillStyle = particle.color;
      this.context.arc(particle.x, particle.y, 2, 0, Math.PI * 2, false);
      this.context.fill();
      this.context.closePath();
    }
  }
}

// HeavyRendering2Dクラスをスコープに展開する。
// selfはメインスレッドではWindow、WorkerスレッドではDedicatedWorkerGlobalScopeになる
self.HeavyRendering2D = HeavyRendering2D;
