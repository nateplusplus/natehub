
import 'babylonjs';
import 'meshwriter/dist/meshwriter.min.js';
import PlayerInput from './playerInput';
import './style.scss';

import profilePhoto from './nate-blair_web-developer.jpg';
import iconGithub from './icon-github.png';
import iconBehance from './icon-behance.png';
import iconInstagram from './icon-instagram.png';
import iconLinkedin from './icon-linkedin.png';
import iconTwitter from './icon-twitter.png';

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
		this.scene.fogMode    = BABYLON.Scene.FOGMODE_LINEAR;
		this.scene.fogColor   = new BABYLON.Color3( 0.98, .8, 0.88 );
		this.scene.fogDensity = 0.01;
		this.scene.fogStart   = 100;
		this.scene.fogEnd     = 300;

		this.light = new BABYLON.HemisphericLight( "light", new BABYLON.Vector3( -100, 200, 100 ), this.scene );
		this.light.intensity = .5;

		this.ground = BABYLON.MeshBuilder.CreateGround( "ground", { width: 500, height: 500 } );

		const groundMat = new BABYLON.StandardMaterial("groundMat");
		// 96, 135, 192
		groundMat.diffuseColor = new BABYLON.Color3( 96/255, 135/255, 192/255 );
		this.ground.material = groundMat;

		let homePosition  = new BABYLON.Vector3( 0, -1, -10 );
		let textPosition  = new BABYLON.Vector3( -15, 0.2, 30 );
		let textRotation  = new BABYLON.Vector3( Math.PI / -2, .35, 0 );
		let photoPosition = new BABYLON.Vector3( -30, 0.1, -6 );
		let photoRotation = new BABYLON.Vector3( Math.PI / 2, .3, 0 );
		let cameraRadius  = 90;
		let cameraHeight  = 55;
		if ( this.getBreakpoint() === 'lg' ) {
			homePosition  = new BABYLON.Vector3( 10, -1, -15 );
			textPosition  = new BABYLON.Vector3( 0, 0.2, 0 );
			textRotation  = new BABYLON.Vector3( Math.PI / -2, 0, 0 );
			photoPosition = new BABYLON.Vector3( -20, 0.1, -26 );
			photoRotation = new BABYLON.Vector3( Math.PI / 2, 0, 0 );
			cameraRadius  = 70;
			cameraHeight  = 40;
		}

		this.home = BABYLON.Mesh.CreateSphere( 'Home', 16, 0.1, this.scene );
		this.home.position = homePosition;

		const Writer = MeshWriter( this.scene, { scale: 1 } );

		this.nateHubText = new Writer( "NATEHUB", {
			"anchor": "center",
			"font-family": "Helvetica",
			"letter-height": 15,
			"letter-thickness": 2.3,
			"color": "#1C3870",
			"position": textPosition
		});
		this.nateHubText.getMesh().rotation = textRotation;

		const socialLinks = [
			{
				name  : 'linkedin',
				label : "LinkedIn:    linkedin.com/in/nateplusplus",
				image : iconLinkedin,
				url  : 'https://www.linkedin.com/in/nateplusplus/'
			},
			{
				name  : 'github',
				label : "GitHub:      @nateplusplus",
				image : iconGithub,
				url  : 'https://www.github.com/nateplusplus/'
			},
			{
				name: 'behance',
				label: "Behance:   behance.net/nateplusplus",
				image: iconBehance,
				url  : 'https://www.behance.net/nateplusplus/'
			},
			{
				name: 'instagram',
				label: "Instagram: @nateplusplus",
				image: iconInstagram,
				url  : 'https://www.instagram.com/nateplusplus/'
			},
			{
				name: 'twitter',
				label: "Twitter:      @nateplusplus",
				image: iconTwitter,
				url  : 'https://www.twitter.com/nateplusplus/'
			}
		];

		socialLinks.forEach( ( data, index ) => {
			this.createSocialLink( data.name, data.label, data.image, data.url, index );
		});

		const photoMaterial          = new BABYLON.StandardMaterial( 'photo' );
		photoMaterial.diffuseTexture = new BABYLON.Texture( profilePhoto, this.scene );

		this.photo = BABYLON.MeshBuilder.CreatePlane( "photo", { size: 25 }, this.scene );
		this.photo.rotation = photoRotation;
		this.photo.position = photoPosition;
		this.photo.material = photoMaterial;

		this.camera = new BABYLON.FollowCamera(
			'followCam',
			new BABYLON.Vector3( 0, 0, 0 ),
			this.scene,
			this.home
		);
		this.camera.heightOffset = cameraHeight;
		this.camera.radius = cameraRadius;
		this.camera.rotationOffset = 155;
		this.camera.attachControl( this.engine._renderingCanvas, true );
	}

	createSocialLink( name, label, image, url, index ) {
		const zPosition = -18 - ( index * 5 );
		const openLink  = new BABYLON.ExecuteCodeAction(
			BABYLON.ActionManager.OnPickTrigger,
			function() {
				window.open( url );
			}
		)

		let xPosition = -5;
		if ( this.getBreakpoint() === 'lg' ) {
			xPosition = 5;
		}

		const Writer = MeshWriter( this.scene, { scale: 1 } );
		const socialLink = new Writer( label, {
			"anchor": "left",
			"font-family": "Helvetica",
			"letter-height": 2,
			"letter-thickness": .25,
			"color": "#1C3870",
			"position": {
				"x": xPosition,
				"y": .2,
				"z": zPosition
			}
		});

		const width  = socialLink.getMesh()._boundingInfo.boundingBox.maximum.x + 1;
		const height = socialLink.getMesh()._boundingInfo.boundingBox.maximum.z + 1;

		const clickable      = BABYLON.MeshBuilder.CreatePlane( `${name}Box`, { width, height }, this.scene );
		clickable.position   = socialLink.getMesh()._boundingInfo.boundingBox.centerWorld;
		clickable.rotation   = new BABYLON.Vector3( Math.PI / 2, 0, 0 );
		clickable.visibility = 0;

		clickable.actionManager = new BABYLON.ActionManager( this.scene );
		clickable.actionManager.registerAction( openLink );

		const material          = new BABYLON.StandardMaterial( `${name}Material` );
		material.diffuseTexture = new BABYLON.Texture( image, this.scene );
		material.opacityTexture = new BABYLON.Texture( image, this.scene );
		material.hasAlpha       = true;

		const icon    = BABYLON.MeshBuilder.CreatePlane( `${name}Icon`, { size: 2 }, this.scene );
		icon.rotation = new BABYLON.Vector3( Math.PI / 2, 0, 0 );
		icon.position = new BABYLON.Vector3( xPosition - 3, 0.1, zPosition + 1 );
		icon.material = material;

		icon.actionManager = new BABYLON.ActionManager( this.scene );
		icon.actionManager.registerAction( openLink );
	}

	run() {
		this.engine.runRenderLoop( () => {
			this.scene.render();
		} );
	}

	getBreakpoint() {
		let breakpoint = 'sm';
		if ( window.innerWidth >= 787 ) {
			breakpoint = 'md';
		}
		if ( window.innerWidth >= 1024 ) {
			breakpoint = 'lg';
		}

		return breakpoint;
	}
}

customElements.define( 'nate-hub', NateHub );
document.body.innerHTML = '<nate-hub></nate-hub>';

// For mocha tests via nodejs
if ( module?.exports ) {
	module.exports.NateHub = NateHub;
}