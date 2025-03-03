import Phaser from 'phaser';
import Block from './block';
import { Direction } from '../input-manager';

export default class BlockManager {
    private blocks: Block[] = [];
    private movingCount: number = 0;
    private direction: Direction;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    add(block: Block) {
        this.blocks.push(block);
    }

    get(posx: number, posy: number) {
        return this.blocks.filter((e: Block) => {
            return e.PosX == posx && e.PosY == posy;
        });
    }

    handle(direction: Direction) {
        if (this.movingCount != 0) return;

        this.sort(direction);
        this.direction = direction;

        this.blocks.forEach((block: Block) => this.tryToMove(block));
    }

    tryToMove(block: Block) {
        let newx = block.PosX;
        let newy = block.PosY;

        if (this.direction == Direction.Left) newx--;
        if (this.direction == Direction.Right) newx++;
        if (this.direction == Direction.Up) newy--;
        if (this.direction == Direction.Down) newy++;

        newx = Phaser.Math.Clamp(newx, 0, 3);
        newy = Phaser.Math.Clamp(newy, 0, 3);

        if (newx == block.PosX && newy == block.PosY) {
            return;
        }

        // console.log(`current: ${block.PosX}x${block.PosY} -> new: ${newx}x${newy}`);

        const other = this.getAt(newx, newy, (b: Block) => b.Value != block.Value);
        if (other != undefined) {
            return;
        }

        block.moveToPosition(newx, newy, 1);
        this.movingCount++;
    }

    moveFinished(block: Block) {
        this.movingCount--;
        const other = this.getAt(block.PosX, block.PosY, (b: Block) => b != block);
        if (other != undefined) {
            other.bump();
            this.blocks.splice(this.blocks.indexOf(block), 1);
            block.destroy();
        } else {
            this.sort(this.direction);
            this.tryToMove(block);
        }
        this.addBlock();
    }

    addBlock() {
        if (this.movingCount != 0)
            return;

        const positions = [];
        for (let x = 0; x < 4; x++)
            for (let y = 0; y < 4; y++) {
                if (this.getAt(x, y, () => true) != undefined) continue;
                positions.push([x, y]);
            }
        const position = (positions[Math.floor(Math.random() * (positions.length))]);
        new Block(this.scene, 2, position[0], position[1], this);
    }

    getAt(x: number, y: number, comparator: Function) {
        return this.blocks.find((b: Block) => b.PosX == x && b.PosY == y && comparator(b));
    }

    sort(direction: Direction) {
        // console.log("Before: " + this.blocks.map((b) => `${b.PosX}x${b.PosY}`));
        this.blocks.sort((a: Block, b: Block) => {
            if (direction == Direction.Up) return a.PosY - b.PosY;
            if (direction == Direction.Down) return b.PosY - a.PosY;
            if (direction == Direction.Left) return a.PosX - b.PosX;
            if (direction == Direction.Right) return b.PosX - a.PosX;
            return 0;
        });
        // console.log("After: " + this.blocks.map((b) => `${b.PosX}x${b.PosY}`));
    }
}
