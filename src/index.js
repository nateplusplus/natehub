
import 'babylonjs';
import PlayerInput from './playerInput';
import './style.scss';

class NateHub extends HTMLElement
{
	connectedCallback() {
		this.canvas = document.createElement( 'canvas' );
		this.canvas.setAttribute( 'tabindex', '1' );
		this.appendChild( this.canvas );

		if (document.activeElement.tagName === 'BODY') {
			this.canvas.focus();
		}

		// navigator is required for babylon and doesn't exist in node
		if ( typeof navigator !== 'undefined' ) {
			this.engine  = new BABYLON.Engine( this.canvas, true );
			this.createScene();
			this.run();
		}
	}

	createScene() {
		this.scene = new BABYLON.Scene( this.engine );
		this.scene.clearColor = new BABYLON.Color3.White();

		// this.home = BABYLON.Mesh.CreateSphere( "Home", 32, 4, this.scene );
		this.home = BABYLON.Mesh.CreateBox('Home', 4, this.scene);
		this.home.position = new BABYLON.Vector3( 0, 0, 0 );

		this.player = BABYLON.Mesh.CreateSphere( "Player", 32, 2, this.scene );
		this.player.position = new BABYLON.Vector3( 0, 0, -10 );

		this.base1 = BABYLON.Mesh.CreateSphere( "Code", 32, 4, this.scene );
		this.base1.position = new BABYLON.Vector3( 200, 0, 200 );

		this.base2 = BABYLON.Mesh.CreateSphere( "Art", 32, 4, this.scene );
		this.base2.position = new BABYLON.Vector3( 200, 0, -200 );

		this.base3 = BABYLON.Mesh.CreateSphere( "Career", 32, 4, this.scene );
		this.base3.position = new BABYLON.Vector3( -200, 0, -200 );
		
		this.base4 = BABYLON.Mesh.CreateSphere( "Contact", 32, 4, this.scene );
		this.base4.position = new BABYLON.Vector3( -200, 0, 200 );

		this.createCamera( 'player' );

		this.input = new PlayerInput( this.scene );
	}

	createCamera( type ) {
		type = type || 'free';

		if ( type === 'free' ) {
			this.camera = new BABYLON.FreeCamera(
				'camera1',
				new BABYLON.Vector3( 50, 500, -400 ),
				this.scene
			);
			this.camera.setTarget( BABYLON.Vector3.Zero() );
		} else {
			this.camera = new BABYLON.FollowCamera(
				'followCam',
				new BABYLON.Vector3( 0, 0, 0 ),
				this.scene,
				this.player
			);
			this.camera.heightOffset = 50;
			this.camera.radius = 50;
			this.camera.rotationOffset = 180;
			this.camera.attachControl( this.engine._renderingCanvas, true );
		}

	}

	run() {
		this.engine.runRenderLoop( () => {
			this.scene.render();
		} );
	}

}

customElements.define( 'nate-hub', NateHub );
document.body.innerHTML = '<nate-hub></nate-hub>';

// For mocha tests via nodejs
if ( module?.exports ) {
	module.exports.NateHub = NateHub;
}