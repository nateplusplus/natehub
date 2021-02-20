const BABYLON   = require( 'babylonjs' );
const { Track } = require( './track.js' );
const { Train } = require( './train.js' );

class NateHub
{
    constructor() {
        this.engine;
        this.scene;

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
            const canvas = document.getElementById( 'nhCanvas' );
            this.engine  = new BABYLON.Engine( canvas, true );

            this.createScene();
            this.run();
        });
    }

    createScene() {
        this.scene = new BABYLON.Scene( this.engine );
        this.scene.clearColor = new BABYLON.Color3.White();

        this.home = BABYLON.Mesh.CreateSphere( "Home", 32, 4, this.scene );

        this.train = new Train( this.scene );
        this.train.setPosition( new BABYLON.Vector3( 0, 0, -8 ) );

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

        this.scene.onKeyboardObservable.add( ( kbInfo ) => {
            switch ( kbInfo.type ) {
                // case BABYLON.KeyboardEventTypes.KEYDOWN:
                //     console.log("KEY DOWN: ", kbInfo.event.key);
                //     break;
                case BABYLON.KeyboardEventTypes.KEYUP:
                    if ( kbInfo.event.key === ' ' ) {
                        this.train.toggleState();
                    }
                    break;
            }
        });
    }

    createPaths() {
        const topCurve = BABYLON.Curve3.CreateCatmullRomSpline(
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
            300,
            true
        );

        const startIndex = topCurve.getPoints().findIndex( ( point ) => {
            return point.x === 0 && point.y === 0 && point.z === -8;
        } );

        let topTrack = new Track( topCurve, this.scene, startIndex );

        const bottomCurve = BABYLON.Curve3.CreateCatmullRomSpline(
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
            300,
            false
        );

        const bottomTrack = new Track( bottomCurve, this.scene, 0 );

        topTrack.intersections = Track.getIntersections( [ bottomTrack ], topTrack.points );

        this.tracks = [
            topTrack,
            bottomTrack
        ];

        this.currentTrackIndex = 0;
    }

    animateTrain() {
        var track = this.tracks[ this.currentTrackIndex ];
        var index = track.startIndex;
        this.scene.registerAfterRender( () => {
            index = this.train.advancePosition( track, index, this.changeTrack.bind( this ) );
        } );
    }

    changeTrack() {
        // TODO: Make this dynamic
        this.currentTrackIndex = 1;
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
            this.train.mesh
        );
        this.camera.heightOffset = 50;
        this.camera.radius = 50;
        this.camera.rotationOffset = 180;
        this.camera.attachControl( this.engine._renderingCanvas, true );
    }

    run() {
        this.engine.runRenderLoop( () => {
            this.scene.render();
        } );
    }

}

const game = new NateHub();
