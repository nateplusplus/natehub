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
        const column  = this.game.scale.width / 12;
        const row     = this.game.scale.height / 12;

        this.background = this.add.image( centerX, centerY, 'background');
        this.background.setDisplaySize(this.game.scale.width, this.game.scale.height);

        this.cameras.main.setBounds(0, 0, this.game.scale.width, this.game.scale.height, true);

        this.base1 = this.add.star(this.game.scale.width - (column * 2), row * 2, 5, 16, 30, 0x6666ff);
        this.base2 = this.add.star(this.game.scale.width - (column * 2), this.game.scale.height - (row * 2), 5, 16, 30, 0x6666ff);
        this.base3 = this.add.star(column * 2, this.game.scale.height - (row * 2), 5, 16, 30, 0x6666ff);
        this.base4 = this.add.star(column * 2, row * 2, 5, 16, 30, 0x6666ff);

        this.homebase = this.add.star(centerX, centerY, 5, 16, 30, 0x6666ff);
        this.train = this.add.rectangle(centerX, centerY + 120, 200, 50, 0x000000, 0.5);

        this.path = new Phaser.Curves.Path( 50, 100 ).splineTo([ 164, 46, 274, 142, 412, 57, 522, 141, 664, 64 ]);
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff, 1);

        this.path.draw( this.graphics, 128 );

        this.follower = this.add.follower( this.path, 0, 0, 'star' );

        this.cameras.main.startFollow( this.follower, true, .09, .09 );
        this.cameras.main.setZoom(1);

        this.follower.setPath(this.path, {
            positionOnPath: true,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            rotateToPath: true,
            ease: 'Sine.easeInOut'
        });

        this.follower.pauseFollow();

        this.input.keyboard.on('keydown-SPACE', function( evt ) {
            if ( this.follower.isFollowing() ) {
                this.follower.pauseFollow();
            } else {
                this.follower.resumeFollow();
            }
        }.bind(this));
    }

}

const config = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade'
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'nh-canvas',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth * 2,
        height: window.innerHeight * 2
    },
    scene: [ NateHub ]
};
const game = new Phaser.Game(config);
