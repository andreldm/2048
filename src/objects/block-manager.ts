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
        // ignore further key presses until all blocks finished moving
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

        // if the position doesn't change, i.e. because reached the edge of grid, then do nothing
        if (newx == block.PosX && newy == block.PosY) {
            return;
        }

        // console.log(`current: ${block.PosX}x${block.PosY} -> new: ${newx}x${newy}`);

        // check if the new position is not occupied by a block of different value
        // or even if the value is equal (meaning we could merge them), if it just 
        const other = this.getAt(newx, newy, (b: Block) => b.Value != block.Value || b.merged);
        if (other != undefined) {
            return;
        }

        block.moveToPosition(newx, newy, 1);
        this.movingCount++;
    }

    moveFinished(block: Block) {
        this.movingCount--;

        // check if under another block
        // if so it's because they have the same value and should be merged
        // otherwise try to continue moving
        const other = this.getAt(block.PosX, block.PosY, (b: Block) => b != block);
        if (other != undefined) {
            other.merge();
            this.blocks.splice(this.blocks.indexOf(block), 1);
            block.destroy();
        } else {
            this.sort(this.direction);
            this.tryToMove(block);
        }

        // if all blocks finished moving we can add a new one
        if (this.movingCount == 0) {
            this.addBlock();

            // we should also to unmark all blocks as merged
            this.blocks.forEach((b) => b.merged = false);
        }
    }

    addBlock() {
        // find an empty cell to place the new block randomly
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

    // sorting is important because, for example, if the user pressed left then
    // the blocks on the left side should be processed first
    sort(direction: Direction) {
        this.blocks.sort((a: Block, b: Block) => {
            if (direction == Direction.Up) return a.PosY - b.PosY;
            if (direction == Direction.Down) return b.PosY - a.PosY;
            if (direction == Direction.Left) return a.PosX - b.PosX;
            if (direction == Direction.Right) return b.PosX - a.PosX;
            return 0;
        });
    }
}
