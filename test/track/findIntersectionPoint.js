const should = require( 'chai' ).should();

describe('Track', function() {

    global.window = {
        addEventListener : ( eventType, callback ) => {
            // simple mock to avoid runtime errors
        },
    };
    const { Track } = require( '../../js/track.js' );

    const points = [
        {
            x : 0,
            y : 0,
            z : 0
        },
        {
            x : 7,
            y : 0,
            z : 2
        },
        {
            x : 10,
            y : 0,
            z : 5
        },
        {
            x : 13,
            y : 0,
            z : 8
        },
        {
            x : 15,
            y : 0,
            z : 10
        }
    ];

    const intersectStart = {
        x : 10,
        y : 0,
        z : 5
    }

    describe('findIntersectionPoint', function() {
        it('should return true if point is within 3 units of intersection', function() {
            const result = Track.findIntersectionPoint( points[1], intersectStart );
            result.should.be.true;
        });
    });
});