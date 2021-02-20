exports.Track = class Track
{
    constructor( curve, scene, startIndex ) {

        this.curve      = curve;
        this.path       = BABYLON.Mesh.CreateLines( 'path', this.curve.getPoints(), scene, true );
        this.points     = this.curve.getPoints();
        this.topPath3d  = new BABYLON.Path3D( this.points );
        this.normals    = this.topPath3d.getNormals();
        this.startIndex = startIndex;
        this.branches = [];
        this.intersections = [];

        this.path.color = new BABYLON.Color3( 0, 0, 0 );
    }

    /**
     * Check whether the current point is close enough
     * to be considered an interesction.
     *
     * @param BABYLON.Vector3 point 
     * @param BABYLON.Vector3 start 
     */
    static findIntersectionPoint( point, start ) {
        let xRange = ( point.x > start.x - 4 && point.x < start.x + 4 );
        let zRange = ( point.z > start.z - 4 && point.z < start.z + 4 );
        return xRange && zRange;
    }

    /**
     * Find all intersection points where the train can switch tracks.
     *
     * @param Array branches
     */
    static getIntersections( branches, points ) {
        let intersections = [];
        branches.forEach( ( branch ) => {
            const branchStart = branch.points[0];
            const index = points.findIndex( ( point ) => {
                return Track.findIntersectionPoint( point, branchStart );
            } );
            if ( index > -1 ) {
                intersections.push( index );
            }
        } );

        return intersections;
    }
}