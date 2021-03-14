
import 'babylonjs';
import 'meshwriter/dist/meshwriter.min.js';
import PlayerInput from './playerInput';
import './style.scss';

// TODO: Put this in an env variable for use with webpack and stuff
const build = 'alpha';

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
		// 252, 205, 224
		this.scene.clearColor = new BABYLON.Color3( 0.98, .8, 0.88 );

		this.light = new BABYLON.HemisphericLight( "light", new BABYLON.Vector3( -100, 200, 100 ), this.scene );
		this.light.intensity = .5;

		this.ground = BABYLON.MeshBuilder.CreateGround( "ground", { width: 500, height: 500 } );

		const groundMat = new BABYLON.StandardMaterial("groundMat");
		// 96, 135, 192
		groundMat.diffuseColor = new BABYLON.Color3( 96/255, 135/255, 192/255 );
		this.ground.material = groundMat;

		this.home = BABYLON.Mesh.CreateSphere( 'Home', 16, 0.1, this.scene );
		this.home.position = new BABYLON.Vector3( 10, -1, -15 );

		let Writer = MeshWriter( this.scene, { scale: 1 } );
		this.nateHubText = new Writer( "NATEHUB", {
			"anchor": "center",
			"font-family": "Helvetica",
			"letter-height": 15,
			"letter-thickness": 2.3,
			"color": "#1C3870",
			"position": {
				"x": 0,
				"y": 0.2,
				"z": 0
			}
		});
		this.nateHubText.getMesh().rotation = new BABYLON.Vector3( Math.PI / -2, 0, 0 );

		this.linkedin = new Writer( "LinkedIn:    linkedin.com/in/nateplusplus", {
			"anchor": "left",
			"font-family": "Helvetica",
			"letter-height": 2,
			"letter-thickness": .25,
			"color": "#1C3870",
			"position": {
				"x": 5,
				"y": .2,
				"z": -18
			}
		});
		this.liIcon = BABYLON.MeshBuilder.CreatePlane( "liIcon", { size: 2 }, this.scene );
		this.liIcon.rotation = new BABYLON.Vector3( Math.PI / 2, 0, 0 );
		this.liIcon.position = new BABYLON.Vector3( 2, 0.1, -17 );

		this.instagram = new Writer( "Instagram: @nateplusplus", {
			"anchor": "left",
			"font-family": "Helvetica",
			"letter-height": 2,
			"letter-thickness": .25,
			"color": "#1C3870",
			"position": {
				"x": 5,
				"y": .2,
				"z": -23
			}
		});
		this.istaIcon = BABYLON.MeshBuilder.CreatePlane( "instaIcon", { size: 2 }, this.scene );
		this.istaIcon.rotation = new BABYLON.Vector3( Math.PI / 2, 0, 0 );
		this.istaIcon.position = new BABYLON.Vector3( 2, 0.1, -22 );

		this.twitter = new Writer( "Twitter:      @nateplusplus", {
			"anchor": "left",
			"font-family": "Helvetica",
			"letter-height": 2,
			"letter-thickness": .25,
			"color": "#1C3870",
			"position": {
				"x": 5,
				"y": .2,
				"z": -28
			}
		});
		this.twIcon = BABYLON.MeshBuilder.CreatePlane( "twIcon", { size: 2 }, this.scene );
		this.twIcon.rotation = new BABYLON.Vector3( Math.PI / 2, 0, 0 );
		this.twIcon.position = new BABYLON.Vector3( 2, 0.1, -27 );

		this.photo = BABYLON.MeshBuilder.CreatePlane( "photo", { size: 25 }, this.scene );
		this.photo.rotation = new BABYLON.Vector3( Math.PI / 2, 0, 0 );
		this.photo.position = new BABYLON.Vector3( -20, 0.1, -26 );

		if ( build === 'beta' ) {
			this.player = BABYLON.Mesh.CreateSphere( "Player", 32, 2, this.scene );
			this.player.position = new BABYLON.Vector3( 0, 0, -10 );
			this.createCamera( 1 );
			this.input = new PlayerInput( this.scene );
		} else {
			this.createCamera(2);
		}
	}

	createCamera( index ) {
		index = index || 0;

		switch ( index ) {
			case 1 : 
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
				break;
			case 2 : 
				this.camera = new BABYLON.FollowCamera(
					'followCam',
					new BABYLON.Vector3( 0, 0, 0 ),
					this.scene,
					this.home
				);
				this.camera.heightOffset = 35;
				this.camera.radius = 70;
				this.camera.rotationOffset = 150;
				this.camera.attachControl( this.engine._renderingCanvas, true );
			default:
				this.camera = new BABYLON.FreeCamera(
					'camera1',
					new BABYLON.Vector3( 30, 30, -50 ),
					this.scene
				);
				this.camera.setTarget( BABYLON.Vector3.Zero() );
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