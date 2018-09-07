// Workerでの処理に必要な外部スクリプトを読み込む
importScripts('heavyrendering2d.js');

/**
 * Workerスレッドで動作する処理です。
 */
class WorkerMain {

  /**
   * コンストラクタです。
   *
   * @param canvas メインスレッドから渡されたOffscreenCanvasオブジェクト
   */
  constructor(canvas) {
    this.renderer = new HeavyRendering2D(canvas);

    this.render();
  };

  /**
   * レンダラーの設定を更新します。
   *
   * @param value メインスレッドから渡された更新プロパティ
   */
  update(value) {
    this.renderer.update(value);
  }

  /**
   * 画面を描画します。
   * 実際の処理はレンダラーが行います。
   */
  render() {
    this.renderer.render();

    requestAnimationFrame(() => this.render());
  }
}

let workerMain = null;
// onmessageイベントハンドラーでメインスレッドからのメッセージを受け取る
onmessage = (event) => {
  // メインスレッドから渡されたtypeに応じて処理を分岐
  switch (event.data.type) {
    case 'init':
      // Workerの処理を初期化
      workerMain = new WorkerMain(event.data.canvas);

      // レンダラーの設定を更新
      workerMain.update(event.data.num);
      break;
    case 'update':
      // レンダラーの設定を更新
      workerMain.update(event.data.num);
      break;
    default:
      break;
  }
};