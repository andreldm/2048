import Phaser from 'phaser';
import BlockManager from '../objects/block-manager';
import InputManager from '../input-manager';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        const size = 600;
        const blockSize = 130; // 600/4=150 but we need to deduct 16px for the border + 8px for half width of grid lines

        // create texture for the grid
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xcdc0b4);
        graphics.fillRect(16, 16, size - 32, size - 32); // background
        graphics.lineStyle(16, 0xbbada0);
        for (let i = 0; i < 5; i++) { // grid lines
            // 16px for the border
            // 8px because we want to draw the line aligned to its middle
            // 16px for each line that was already drawn
            const pos = (i * blockSize) + 16 + 8 + ((i - 1) * 16);
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

            const rt = this.add.renderTexture(0, 0, blockSize, blockSize);
            rt.fill(color, 1.0);
            const text = this.add.text(blockSize / 2, blockSize / 2, "" + number, {
                fontSize: number <= 512 ? "64px" : "48px",
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
        blockManager.addBlock();
        blockManager.addBlock();

        new InputManager(this.game, [blockManager]);
    }
}
