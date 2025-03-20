import Phaser from 'phaser';
import BlockManager from '../objects/block-manager';
import InputManager from '../input-manager';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        const size = 600;
        const blockSize = 150;

        // create texture for the grid
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xcdc0b4);
        graphics.fillRect(16, 16, size - 32, size - 32); // background
        graphics.lineStyle(16, 0xbbada0);
        graphics.strokeRoundedRect(8, 8, size - 16, size - 16, 8); // outer border
        for (let i = 1; i < 4; i++) { // grid lines
            const pos = (i * blockSize) + ((i - 2) * -4);
            graphics.strokeLineShape(new Phaser.Geom.Line(pos, 0, pos, size)); // vertical
            graphics.strokeLineShape(new Phaser.Geom.Line(0, pos, size, pos)); // horizontal
        }
        graphics.generateTexture('grid', size, size);
        graphics.destroy();

        // create textures for blocks
        for (const el of [[2, 0xefe5da], [4, 0xece0c6], [8, 0xf1b179], [16, 0xf69564], [32, 0xf77c5f], [64, 0xf55e3a], [128, 0xedce72],
                          [256, 0xeccb60], [512, 0xeec851], [1024, 0xecc53e], [2048, 0xecc22f], [4096, 0x9201cf], [8192, 0x59007f],
                          [16384, 0x35004d], [32768, 0x000000]]) {
            const number = el[0];
            const color: number = el[1];

            const rt = this.add.renderTexture(0, 0, blockSize - 20, blockSize - 20);
            rt.fill(color, 1.0);
            const text = this.add.text((blockSize - 20) / 2, (blockSize - 20) / 2, "" + number, {
                fontSize: "64px",
                fontFamily: "Arial",
                color: number <= 4 ? "#786e64" : "#f7f3f4"
            }).setOrigin(0.5);
            rt.draw(text);
            rt.saveTexture('number' + number);
            text.destroy();
            rt.destroy();
        }

        this.add.image(0, 0, 'grid').setOrigin(0);
        const blockManager = new BlockManager(this);
        // new Block(this, 4, 0, 2, blockManager);
        // new Block(this, 2, 1, 2, blockManager);
        // new Block(this, 2, 2, 2, blockManager);
        // new Block(this, 4, 3, 2, blockManager);
        blockManager.addBlock();
        blockManager.addBlock();

        new InputManager(this.game, [blockManager]);
    }
}
