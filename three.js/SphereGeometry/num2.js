var CanvasDetector = {
    canCanvas: function () {
        return !!window.CanvasRenderingContext2D;
    },
    canWebGL: function () {
        try {
            return !!window.WebGLRenderingContext && !!document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
        } catch( e ) {
            return false;
        }
    }
};

// ページをすべて読み込んだあとに関数の中を実行
window.addEventListener("load",function() {

    /*-------------------------------------------------------
      ここから変数の宣言と定義
    -------------------------------------------------------*/

    // レンダラ、シーン、カメラ、ジオメトリ、マテリアル、メッシュ用の変数を宣言
    var renderer, scene, camera, geometry, material, mesh, texture;

    // 描画領域をHTMLに確保するためのコンテナ用変数
    var container = document.getElementById('num2');

    // 描画領域の幅と高さをウィンドウの幅と高さに設定
    var canvasWidth  = container.clientWidth;
    var canvasHeight = container.clientHeight;


    /*-------------------------------------------------------
      ここからレンダラ（描画領域）の生成と設定
    -------------------------------------------------------*/

    // レンダラの生成
    if(CanvasDetector.canWebGL()){
        renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
    }else if(CanvasDetector.canCanvas()){
        renderer = new THREE.CanvasRenderer({ alpha: true } );
    }

    // レンダラの大きさをウィンドウの幅と高さに設定
    renderer.setSize( canvasWidth, canvasHeight );

    // レンダラの背景色を白に、透明度を100%に設定
    renderer.setClearColor( 0xffffff, 0 );

    // div要素をつくってHTMLのbody要素内に追加し、その中にレンダラがもつDOM要素を追加
    container.appendChild( renderer.domElement );

    /*-------------------------------------------------------
      ここからシーンの生成
    -------------------------------------------------------*/

    // シーンの生成
    scene = new THREE.Scene();

    /*-------------------------------------------------------
      ここからカメラの生成と設定
    -------------------------------------------------------*/

    // 画角20度、画面アスペクト比はウィンドウのアスペクト比と同様、手前1、後方10000までを描画できる
    // 投資投影カメラ（遠近法的に映る）を生成
    camera = new THREE.PerspectiveCamera( 20, canvasWidth / canvasHeight, 1 , 10000);

    // カメラの位置を座標(x,y,z)=(0,500,1000)に設定
    camera.position.set( 0, 0, 1000 );

    // カメラの向きを座標の原点(x,y,z)=(0,0,0)に設定
    camera.lookAt( { x:0, y:0, z:0 } );

    /*-------------------------------------------------------
      ここからジオメトリの生成
    -------------------------------------------------------*/

    // 半径150、経度分割数と緯度分割数が32の球体ジオメトリを生成
    geometry = new THREE.SphereGeometry( 150, 40, 40 );

    /*-------------------------------------------------------
      ここからテクスチャの生成
    -------------------------------------------------------*/
    // テクスチャの作成
    texture = THREE.ImageUtils.loadTexture( 'texture1.jpg' );
    texture.anisotropy = renderer.getMaxAnisotropy();

    /*-------------------------------------------------------
      ここからマテリアルの生成
    -------------------------------------------------------*/

    // hexコードff00ffの色をもち、ワイヤーフレームを有効にしたマテリアルの生成
    // BasicMaterialは光源を必要としない
    material = new THREE.MeshBasicMaterial( { color: 0xE5E5E5, map: texture } );

    /*-------------------------------------------------------
      ここからメッシュの生成
    -------------------------------------------------------*/

    // ジオメトリとマテリアルを渡してメッシュを生成
    mesh = new THREE.Mesh( geometry, material );

    /*-------------------------------------------------------
      ここから描画
    -------------------------------------------------------*/

    // メッシュをシーンに追加
    scene.add( mesh );

    // レンダラにシーンとカメラを渡してブラウザの画面に描画
    renderer.render( scene, camera );

    // 回転角のための変数を宣言
    var theta_x = 0;
    var theta_y = 0;

    // 回転アニメーション用の関数
    var rotationAnimation = function() {
        // カメラの位置をx-z平面で回転するように設定
        // camera.position.set( 1000 * Math.sin( theta ), 500, 1000 * Math.cos( theta ) );
        mesh.rotation.x = theta_x;
        mesh.rotation.y = theta_y;

        // カメラを座標の原点に向き直させるように設定
        // camera.lookAt( { x:0, y:0, z:0 } );

        // レンダラにシーンとカメラを渡してブラウザの画面に描画
        renderer.render( scene, camera );

        // 回転角を増やす
        theta_x += 0.002;
        theta_y += 0.001;

        // 回転角が360度を超えたらまたゼロに戻す
        theta_x %= 2 * Math.PI;    
        theta_y %= 2 * Math.PI;    

        // アニメーション用の関数を渡す
        // これで1秒間に60回描画される
        requestAnimationFrame( rotationAnimation );
    };

    // アニメーションを実行
    rotationAnimation();

});
