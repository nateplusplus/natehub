import 'phaser';

class Natehub extends Phaser.Scene
{
    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('thing', 'assets/placeholder-sq-01.svg');
        this.load.spritesheet('dude', 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
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
        width: 800,
        height: 600
    },
    scene: [ Natehub ]
};
const game = new Phaser.Game(config);
