class Camera
{
    constructor() {
        this.x;
        this.y;
        this.width;
        this.height;
    }
}

class NateHub
{
    constructor() {
        this.resizeTimer;
        this.scaleRatio = 3;

        this.world = {
            width  : 4000,
            height : 4000
        }

        this.camera = new Camera();

        this.init();
    }

    init() {
        window.addEventListener('DOMContentLoaded', (event) => {
            this.setScaleRatio();
            this.create();
        });
    }

    setScaleRatio() {
        this.scaleRatio = window.devicePixelRatio / 3;
    }

    positionX( percent ) {
        return Math.round( percent * this.world.width );
    }

    positionY( percent ) {
        return Math.round( percent * this.world.height );
    }

    placeLandmark( id, x, y, w, h ) {
        const el = document.getElementById( id );
        el.style.left = x;
        el.style.top = y;

        if ( w ) {
            el.style.width = w;
        }

        if ( h ) {
            el.style.width = w;
        }
    }

    create() {
        console.group( 'NateHub' );
        console.log( this );
        console.groupEnd();

        const body = document.getElementsByTagName('body')[0];
        body.style.width = this.world.width + 'px';
        body.style.height = this.world.height + 'px';

        this.placeLandmark( 'home', this.positionX(.5), this.positionY(.5), '30px', '30px' );
    }

}

const game = new NateHub();
