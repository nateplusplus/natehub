import * as BABYLON from 'babylonjs';

class NateHub
{
    constructor() {
        this.canvas;
        this.engine;

        this.init();
    }

    init() {
        window.addEventListener('DOMContentLoaded', (event) => {
            this.canvas = document.getElementById( 'nhCanvas' );
            this.engine = new BABYLON.Engine( this.canvas, true );

            this.createScene();
            this.run();
        });
    }

    createScene() {
        console.group( 'NateHub' );
        console.log( this );
        console.groupEnd();

        this.scene = new BABYLON.Scene( this.engine );
        this.scene.clearColor = new BABYLON.Color3.White();

        this.home = BABYLON.Mesh.CreateSphere( "Home", 32, 4, this.scene );

        this.train = BABYLON.Mesh.CreateBox( "Train", 1.5, this.scene );
        this.train.position =  new BABYLON.Vector3( 0, 0, -8 );


        this.base1 = BABYLON.Mesh.CreateSphere( "Code", 32, 4, this.scene );
        this.base1.position = new BABYLON.Vector3( 200, 0, 200 );

        this.base2 = BABYLON.Mesh.CreateSphere( "Art", 32, 4, this.scene );
        this.base2.position = new BABYLON.Vector3( 200, 0, -200 );

        this.base3 = BABYLON.Mesh.CreateSphere( "Career", 32, 4, this.scene );
        this.base3.position = new BABYLON.Vector3( -200, 0, -200 );

        this.base4 = BABYLON.Mesh.CreateSphere( "Contact", 32, 4, this.scene );
        this.base4.position = new BABYLON.Vector3( -200, 0, 200 );
 

        this.cameraDev = new BABYLON.FreeCamera(
            'camera1',
            new BABYLON.Vector3( 50, 500, -400 ),
            this.scene
        );
        this.cameraDev.setTarget( BABYLON.Vector3.Zero() );
        
        // this.camera = new BABYLON.FollowCamera(
        //     'followCam',
        //     new BABYLON.Vector3( 0, 0, 0 ),
        //     this.scene,
        //     this.train
        // );
        // this.camera.heightOffset = 50;
        // this.camera.radius = 80;
        // this.camera.rotationOffset = 50;
        // this.camera.attachControl( this.canvas, true );

    }

    run() {
        this.engine.runRenderLoop( () => {
            this.scene.render();
        } );
    }

}

const game = new NateHub();