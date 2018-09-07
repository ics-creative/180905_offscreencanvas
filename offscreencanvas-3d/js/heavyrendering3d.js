/**
 * Canvasにレンダリングを行う処理です。
 * メイン/Workerどちらのスレッドからでも使用できるようになっています。
 */
class HeavyRendering3D {

  /**
   * コンストラクタです。
   *
   * @param canvas Canvasオブジェクト、もしくはOffscreenCanvasオブジェクト
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.stageWidth = this.canvas.width;
    this.stageHeight = this.canvas.height;

    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.meshList = [];
    this.geometry = null;
    this.theta = 0.0;
    this.phi = 0.0;
    this.cameraTarget = null;

    if (!this.canvas.style) {
      // Three.jsは内部でCanvas要素のstyleにアクセスする
      // Workerスレッドで使用する場合、OffscreenCanvasにはstyleがないため明示的に設定する
      this.canvas.style = {width: 0, height: 0};
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });
    this.renderer.setSize(this.stageWidth, this.stageHeight);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.stageWidth / this.stageHeight, 1, 10000);
    this.camera.position.set(0, 0, 1000);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);

    this.geometry = new THREE.CubeGeometry(10, 10, 10, 1, 1, 1);
  };

  /**
   * メッシュを初期化します。
   *
   * @param num メッシュ数
   */
  iinitMeshList(num) {
    if (this.meshList) {
      // すでにあるメッシュを全て破棄する
      const length = this.meshList.length;
      for (let i = 0; i < length; i++) {
        const mesh = this.meshList[i];
        this.scene.remove(mesh);
        mesh.material.dispose();
      }
    }

    this.meshList = [];

    for (let i = 0; i < num; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: `hsl(${Math.floor(360 * Math.random())}, 70%, 40%)`,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(this.geometry, material);
      mesh.position.x = 900 * (Math.random() - 0.5);
      mesh.position.y = 900 * (Math.random() - 0.5);
      mesh.position.z = 900 * (Math.random() - 0.5);
      this.meshList.push(mesh);
      this.scene.add(mesh);
    }
  }

  /**
   * レンダラーの設定を更新します。
   *
   * @param value 更新プロパティ
   */
  update(value) {
    this.iinitMeshList(value);
  }

  /**
   * 画面を描画します。
   */
  render() {
    this.theta += 0.01;
    this.phi += 0.01;
    this.camera.position.x = 1000 * Math.cos(this.theta);
    this.camera.position.z = 1000 * Math.sin(this.theta);
    this.camera.position.y = 800 * Math.sin(this.phi);
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
  }
}

// HeavyRendering3Dクラスをスコープに展開する。
// selfはメインスレッドではWindow、WorkerスレッドではDedicatedWorkerGlobalScopeになる
self.HeavyRendering3D = HeavyRendering3D;