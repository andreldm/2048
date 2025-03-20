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

        for (let i = 0; i < 3; i++) {
            const pos = this.getNextPosition(newx, newy, block);
            if (pos == undefined) {
                break;
            }
            newx = pos[0];
            newy = pos[1];
        }

        // if the position doesn't change, i.e. because reached the edge of grid, then do nothing
        if (newx == block.PosX && newy == block.PosY) {
            return;
        }

        block.moveToPosition(newx, newy);
        this.movingCount++;
    }

    getNextPosition(newx: number, newy: number, block: Block): [number, number] {
        if (this.direction == Direction.Left) newx--;
        if (this.direction == Direction.Right) newx++;
        if (this.direction == Direction.Up) newy--;
        if (this.direction == Direction.Down) newy++;

        if (newx < 0 || newx > 3 || newy < 0 || newy > 3) {
            return undefined;
        }

        // check if the new position is not occupied by a block
        //
        // if other block's value is the same and it's not merged or going to merge
        // the move can proceed and we mark both blocks as "going to merge"
        //
        // if the value is different or the block is merged/going to merge
        // then the move should be stopped
        const other = this.getAt(newx, newy, () => true);
        if (other != undefined) {
            if (other.Value == block.Value && !other.merged && !other.goingToMerge) {
                other.goingToMerge = block.goingToMerge = true;
            } else {
                return undefined;
            }
        }

        return [newx, newy];
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
            this.blocks.forEach((b) => b.merged = b.goingToMerge = false);
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
