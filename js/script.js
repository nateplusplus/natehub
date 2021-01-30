import * as BABYLON from 'babylonjs';

class NateHub
{
    constructor() {
        this.canvas;
        this.engine;

        this.topPath;
        this.bottomPath;

        this.train;
        
        this.home;
        this.base1;
        this.base2;
        this.base3;
        this.base4;

        this.camera;

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

        this.createPaths();
        this.createCamera();
        this.animateTrain();
    }

    createPaths() {

        this.topCurve = BABYLON.Curve3.CreateCatmullRomSpline(
            [
                new BABYLON.Vector3( 0, 0, -8 ),
                new BABYLON.Vector3( 150, 0, 0 ),
                new BABYLON.Vector3( 200, 0, 50 ),
                new BABYLON.Vector3( 230, 0, 200 ),
                new BABYLON.Vector3( 185, 0, 230 ),
                new BABYLON.Vector3( 100, 0, 150 ),
                new BABYLON.Vector3( 0, 0, 250 ),
                new BABYLON.Vector3( -100, 0, 150 ),
                new BABYLON.Vector3( -185, 0, 230 ),
                new BABYLON.Vector3( -230, 0, 200 ),
                new BABYLON.Vector3( -200, 0, 50 ),
                new BABYLON.Vector3( -150, 0, 0 ),
            ],
            800,
            true
        );

        this.topPath = BABYLON.Mesh.CreateLines( 'path', this.topCurve.getPoints(), this.scene, true );
        this.topPath.color = new BABYLON.Color3( 0, 0, 0 );

        let bottomCurve = BABYLON.Curve3.CreateCatmullRomSpline(
            [
                new BABYLON.Vector3( 110, 0, -6 ),
                new BABYLON.Vector3( 200, 0, -50 ),
                new BABYLON.Vector3( 230, 0, -200 ),
                new BABYLON.Vector3( 185, 0, -230 ),
                new BABYLON.Vector3( 100, 0, -150 ),
                new BABYLON.Vector3( 0, 0, -250 ),
                new BABYLON.Vector3( -100, 0, -150 ),
                new BABYLON.Vector3( -185, 0, -230 ),
                new BABYLON.Vector3( -230, 0, -200 ),
                new BABYLON.Vector3( -200, 0, -50 ),
                new BABYLON.Vector3( -110, 0, -6 ),
            ],
            800,
            false
        );

        this.bottomPath = BABYLON.Mesh.CreateLines( 'path', bottomCurve.getPoints(), this.scene, true );
        this.bottomPath.color = new BABYLON.Color3( 0, 0, 0 );
    }

    animateTrain() {
        const points  = this.topCurve.getPoints();
        const topPath3d = new BABYLON.Path3D( points );
        const normals = topPath3d.getNormals();

        var i = 0;
        this.scene.registerAfterRender( () => {
            this.train.position = new BABYLON.Vector3( points[i].x, 0, points[i].z );

            let theta = Math.acos( BABYLON.Vector3.Dot( normals[i], normals[i+1] ) );
            let dir = BABYLON.Vector3.Cross( normals[i], normals[i+1] ).y;
            dir = dir/Math.abs( dir );
            this.train.rotate( BABYLON.Axis.Y, dir * theta, BABYLON.Space.WORLD );

            i++; // continuous loop
            if ( i === points.length ) {
                i = 0;
            }
        } );
    }

    createCamera() {
        // this.camera = new BABYLON.FreeCamera(
        //     'camera1',
        //     new BABYLON.Vector3( 50, 500, -400 ),
        //     this.scene
        // );
        // this.camera.setTarget( BABYLON.Vector3.Zero() );

        this.camera = new BABYLON.FollowCamera(
            'followCam',
            new BABYLON.Vector3( 0, 0, 0 ),
            this.scene,
            this.train
        );
        this.camera.heightOffset = 50;
        this.camera.radius = 50;
        this.camera.rotationOffset = 180;
        this.camera.attachControl( this.canvas, true );
    }

    run() {
        this.engine.runRenderLoop( () => {
            this.scene.render();
        } );
    }

}

const game = new NateHub();