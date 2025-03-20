import motion.Actuate;

class Block extends h2d.Object {
    public static final SIZE: Int = 130;
    static final PAD: Int = 16;

    public var value(default, null): Int;
    public var posx(default, null): Int; // from 0 to 3
    public var posy(default, null): Int; // from 0 to 3
    public var merged: Bool = false; // to guarantee a block merges only once per move
    public var goingToMerge: Bool = false; // to guarantee a block merges only once per move
    var blockManager: BlockManager;
    var tiles: Map<Int, h2d.Tile>;

    public function new(scene: h2d.Scene, posx: Int, posy: Int, blockManager: BlockManager, tiles: Map<Int, h2d.Tile>) {
        super(scene);

        this.posx = posx;
        this.posy = posy;
        this.blockManager = blockManager;
        this.tiles = tiles;
        this.value = Math.random() < 0.9 ? 2 : 4;

        blockManager.add(this);

        var bmp = new h2d.Bitmap(tiles.get(value), this);
        bmp.scaleX = bmp.scaleY = 0;
        var x = PAD + (PAD * posx) + (SIZE * posx);
        var y = PAD + (PAD * posy) + (SIZE * posy);
        bmp.setPosition(x + SIZE / 2, y + SIZE / 2); // because we want the animation below to scale from center
        Actuate.tween(bmp, 0.1, { x: x, y: y, scaleX: 1, scaleY: 1 }, false)
            .ease (motion.easing.Linear.easeNone);
    }

    public function merge() {
        value *= 2;
        merged = true;
        removeChildren();

        var bmp = new h2d.Bitmap(tiles.get(value), this);
        var x = PAD + (PAD * posx) + (SIZE * posx);
        var y = PAD + (PAD * posy) + (SIZE * posy);
        bmp.setPosition(x, y);

        Actuate.tween(bmp, 0.2, { x: x - (SIZE * 0.05 / 2),
                                  y: y - (SIZE * 0.05 / 2),
                                  scaleX: 1.05,
                                  scaleY: 1.05 }, false)
            .ease (motion.easing.Linear.easeNone)
            .reverse();
    }

    public function moveToPosition(posx: Int, posy: Int) {
        this.posx = posx;
        this.posy = posy;

        Actuate.tween(getChildAt(0), 0.1, {
                x: PAD + (PAD * posx) + (SIZE * posx),
                y: PAD + (PAD * posy) + (SIZE * posy) }, false)
            .ease (motion.easing.Linear.easeNone)
            .onComplete(blockManager.moveFinished, [this]);
    }
}
