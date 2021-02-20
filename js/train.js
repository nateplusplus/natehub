exports.Train = class Train
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

    advancePosition( track, i, callback ) {
        if ( this.state === 'run' ) {

            this.setPosition( new BABYLON.Vector3( track.points[i].x, 0, track.points[i].z ) );
            this.handleRotation( track.normals[i], track.normals[i+1] );

            if ( track.intersections.find( item => i === item ) ) {
                callback( track );
            }

            i = i === track.points.length-2 ? 0 : i + 1;
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