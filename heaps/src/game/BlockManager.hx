using Lambda;

class BlockManager implements Listener {
    static final DEBUG: Bool = true;
    final scene: h2d.Scene;
    final tiles: Map<Int, h2d.Tile>;
    final blocks: Array<Block> = [];
    var direction: Direction;
    var movingCount: Int = 0;

    public function new(scene: h2d.Scene, tiles: Map<Int, h2d.Tile>) {
        this.scene = scene;
        this.tiles = tiles;

        if (DEBUG) {
            new Block(scene, 4, 1, 1, this, tiles);
            new Block(scene, 2, 2, 1, this, tiles);
            new Block(scene, 2, 3, 1, this, tiles);
        }
    }

    public function add(block: Block) {
        blocks.push(block);
    }

    public function handle(direction:Direction) {
        // ignore further key presses until all blocks finished moving
        if (movingCount != 0) return;

        sort(direction);
        this.direction = direction;

        for (b in blocks)
            tryToMove(b);
    }

    private function tryToMove(block: Block) {
        var newx = block.posx;
        var newy = block.posy;

        for (i in 0...3) {
            var pos = getNextPosition(newx, newy, block);
            if (pos == null) {
                break;
            }
            newx = pos[0];
            newy = pos[1];
        }

        // if the position doesn't change, i.e. because reached the edge of grid, then do nothing
        if (newx == block.posx && newy == block.posy) {
            return;
        }

        block.moveToPosition(newx, newy);
        movingCount++;
    }

    private function getNextPosition(newx: Int, newy: Int, block: Block): Array<Int> {
        if (direction == Direction.Left) newx--;
        if (direction == Direction.Right) newx++;
        if (direction == Direction.Up) newy--;
        if (direction == Direction.Down) newy++;

        if (newx < 0 || newx > 3 || newy < 0 || newy > 3) {
            return null;
        }

        // check if the new position is not occupied by a block
        //
        // if other block's value is the same and it's not merged or going to merge
        // the move can proceed and we mark both blocks as "going to merge"
        //
        // if the value is different or the block is merged/going to merge
        // then the move should be stopped
        var other = getAt(newx, newy, function(block: Block) return true);
        if (other != null) {
            if (other.value == block.value && !other.merged && !other.goingToMerge) {
                other.goingToMerge = block.goingToMerge = true;
            } else {
                return null;
            }
        }

        return [newx, newy];
    }

    public function moveFinished(block: Block) {
        movingCount--;

        // check if under another block
        // if so it's because they have the same value and should be merged
        // otherwise try to continue moving
        var other = getAt(block.posx, block.posy, function (b: Block) return b != block);
        if (other != null) {
            other.merge();
            blocks.splice(blocks.indexOf(block), 1);
            block.remove();
        } else {
            sort(direction);
            tryToMove(block);
        }

        // if all blocks finished moving we can add a new one
        if (movingCount == 0) {
            addBlock();

            // we should also to unmark all blocks as merged
            for (b in blocks)
                b.merged = b.goingToMerge = false;
        }
    }

    public function addBlock() {
        // find an empty cell to place the new block randomly
        var positions = [];
        for (x in 0...4) {
            for (y in 0...4) {
                if (getAt(x, y, function(block: Block) return true) != null) continue;
                positions.push([x, y]);
            }
        }

        var position = positions[Math.floor(Math.random() * (positions.length))];
        if (position != null && !DEBUG)
            new Block(scene, null, position[0], position[1], this, tiles);
    }

    private function getAt(x: Int, y: Int, comparator: Block -> Bool): Block {
        for (b in blocks) {
            if (b.posx == x && b.posy == y && comparator(b)) {
                return b;
            }
        }

        return null;
    }

    // sorting is important because, for example, if the user pressed left then
    // the blocks on the left side should be processed first
    private function sort(direction: Direction) {
        blocks.sort(function (a: Block, b: Block) {
            if (direction == Direction.Up) return a.posy - b.posy;
            if (direction == Direction.Down) return b.posy - a.posy;
            if (direction == Direction.Left) return a.posx - b.posx;
            if (direction == Direction.Right) return b.posx - a.posx;
            return 0;
        });
    }
}
