import 'phaser';

class NateHub extends Phaser.Scene
{
    constructor() {
        super();
        this.resizeTimer;

        this.init();
    }

    init() {
        this.setScaleRatio();
        window.addEventListener( 'resize', this.resize.bind( this ) );
    }

    resize( evt ) {
        clearTimeout( this.resizeTimer );

        this.resizeTimer = setTimeout(function() {
            this.setGameSize();
        }.bind(this), 250);
    }

    setGameSize() {
        this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
    }

    setScaleRatio() {
        this.scaleRatio = window.devicePixelRatio / 3;
    }

    preload() {
        this.load.image( 'star', 'assets/star.png' );
        this.load.image( 'background', 'assets/blue-gradient.svg' );
    }

    create() {
        console.group( 'NateHub' );
        console.log( this );
        console.groupEnd();

        Phaser.GameObjects.Rectangle
        const centerX = this.game.scale.width / 2;
        const centerY = this.game.scale.height / 2;

        this.background = this.add.image( centerX, centerY, 'background');
        this.background.setDisplaySize(this.game.scale.width, this.game.scale.height);

        this.homebase = this.add.star(centerX, centerY, 5, 48, 96, 0x6666ff);

        this.train = this.add.rectangle(centerX, centerY + 120, 200, 50, 0x000000, 0.5);

        this.path = new Phaser.Curves.Path( 50, 100 ).splineTo([ 164, 46, 274, 142, 412, 57, 522, 141, 664, 64 ]);
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff, 1);

        this.path.draw( this.graphics, 128 );

        this.follower = this.add.follower( this.path, 0, 0, 'star' );
        this.follower.startFollow({
            positionOnPath: true,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            rotateToPath: true,
            verticalAdjust: true
        });

        this.input.keyboard.on('keydown-RIGHT', function( evt ) {
            console.log('right');
        }.bind(this));

        this.input.keyboard.on('keydown-LEFT', function( evt ) {
            console.log('left');
        });
    }

}

const config = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'nh-canvas',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: [ NateHub ]
};
const game = new Phaser.Game(config);
