import { Scene } from 'phaser';
import BlockManager from './block-manager';

export default class Block extends Phaser.GameObjects.Sprite {
    private readonly INITIAL_VALUE: number = 2;
    private readonly SIZE: number = 130;
    private readonly PAD: number = 16;

    private value: number = this.INITIAL_VALUE;
    private posx: number; // from 0 to 3
    private posy: number; // from 0 to 3
    private blockManager: BlockManager;
    public merged: boolean = false; // to guarantee a block merges only once per move

    constructor(scene: Scene, value: number ,posx: number, posy: number, blockManager: BlockManager) {
        super(scene, 0, 0, '');
        scene.add.existing(this);

        this.blockManager = blockManager;
        this.blockManager.add(this);

        this.value = value;
        this.posx = posx;
        this.posy = posy;
        this.setTexture('number' + value);
        this.setPosition(this.PAD + (this.PAD * posx) + (this.SIZE * posx),
                         this.PAD + (this.PAD * posy) + (this.SIZE * posy));
        this.setOrigin(0);
    }

    get PosX(): number {
        return this.posx;
    }

    get PosY(): number {
        return this.posy;
    }

    get Value(): number {
        return this.value;
    }

    merge() {
        this.value *= 2;
        this.merged = true;
        this.setTexture('number' + this.value);
    }

    moveToPosition(posx: number, posy: number) {
        this.posx = posx;
        this.posy = posy;

        this.scene.tweens.add({
            targets: this,
            props: {
                x: { value: this.PAD + (this.PAD * posx) + (this.SIZE * posx), duration: 100, ease: 'Linear' },
                y: { value: this.PAD + (this.PAD * posy) + (this.SIZE * posy), duration: 100, ease: 'Linear' }
            },
            onComplete: (tween) => {
                this.blockManager.moveFinished(this);
            }
        });
    }
}
