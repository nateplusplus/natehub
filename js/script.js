import * as BABYLON from 'babylonjs';

class Track
{
    constructor( curve, scene, startIndex ) {

        this.curve      = curve;
        this.path       = BABYLON.Mesh.CreateLines( 'path', this.curve.getPoints(), scene, true );
        this.points     = this.curve.getPoints();
        this.topPath3d  = new BABYLON.Path3D( this.points );
        this.normals    = this.topPath3d.getNormals();
        this.startIndex = startIndex;
        this.intersections = [];
        this.changes = [];

        this.path.color = new BABYLON.Color3( 0, 0, 0 );
    }

    setChanges( intersections ) {
        intersections.forEach( ( intersection ) => {
            const index = this.points.findIndex( ( point ) => {
                const start = intersection.points[0];
                let xRange = ( point.x > start.x - 3 && point.x < start.x + 3 );
                let zRange = ( point.z > start.z - 3 && point.z < start.z + 3 );
                return xRange && zRange;
            } );
            if ( index > -1 ) {
                this.changes.push( index );
            }
        } );
    }
}

class Train
{
    constructor( scene ) {
        this.currentTrackIndex;
        this.tracks = [];
        this.state = 'stop';
        this.scene = scene;
        this.mesh  = BABYLON.Mesh.CreateBox( "Train", 1.5, this.scene );
    }

    toggleState() {
        this.state = this.state === 'stop' ? 'run' : 'stop';
    }

    setPosition( vector ) {
        this.mesh.position =  vector;
    }

    advancePosition( track, normals, i, callback ) {
        if ( this.state === 'run' ) {
            const points = track.getPoints();

            this.setPosition( new BABYLON.Vector3( points[i].x, 0, points[i].z ) );
            this.handleRotation( normals[i], normals[i+1] );

            if ( track.changes.find( i ) ) {
                callback( track );
            }

            i = i === points.length-2 ? 0 : i + 1;
        }
        return i;
    }

    handleRotation( normal, nextNormal ) {
        let theta = Math.acos( BABYLON.Vector3.Dot( normal, nextNormal ) );
        let dir = BABYLON.Vector3.Cross( normal, nextNormal ).y;
        dir = dir/Math.abs( dir );

        this.mesh.rotate( BABYLON.Axis.Y, dir * theta, BABYLON.Space.WORLD );
    }
}

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

        let topCurve = BABYLON.Curve3.CreateCatmullRomSpline(
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
            300,
            false
        );

        let bottomTrack = new Track( bottomCurve, this.scene, 0 );

        topTrack.setChanges( [ bottomTrack ] );

        console.dir( topTrack.changes );

        this.currentTrackIndex = 0;
    }

    animateTrain() {
        var index = this.tracks[ this.currentTrackIndex ].startIndex;
        this.scene.registerAfterRender( () => {
            index = this.train.advancePosition( this.tracks[ this.currentTrack ], normals, index, this.changeTrack );
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
        this.camera.attachControl( this.canvas, true );
    }

    run() {
        this.engine.runRenderLoop( () => {
            this.scene.render();
        } );
    }

}

const game = new NateHub();