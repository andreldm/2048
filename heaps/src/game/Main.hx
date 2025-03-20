import motion.actuators.SimpleActuator;

class Main extends hxd.App {
    var lastTime: Float = 0;

    static function main() {
        new Main();
    }

    override function init() {
        hxd.Res.initEmbed();
        SimpleActuator.getTime = function () return lastTime;

        var numbers:Map<Int, h2d.Tile> = [];

        var graphics = new h2d.Graphics(s2d);

        // background color
        graphics.beginFill(0xcdc0b4);
        graphics.drawRect(0, 0, 600, 600);
        graphics.endFill();

         // grid
        graphics.lineStyle(16, 0xbbada0);
        for (i in 0...5) {
            // 16px for the border
            // 8px because we want to draw the line aligned to its middle
            // 16px for each line that was already drawn
            var pos = (i * Block.SIZE) + 16 + 8 + ((i - 1) * 16);
            graphics.moveTo(pos, 0); graphics.lineTo(pos, 600); // vertical
            graphics.moveTo(0, pos); graphics.lineTo(600, pos); // horizontal
        }

        // create textures for blocks
        var font = hxd.Res.liberation.toFont();
        for (el in [[2, 0xefe5da], [4, 0xece0c6], [8, 0xf1b179], [16, 0xf69564], [32, 0xf77c5f], [64, 0xf55e3a], [128, 0xedce72],
            [256, 0xeccb60], [512, 0xeec851], [1024, 0xecc53e], [2048, 0xecc22f], [4096, 0x9201cf], [8192, 0x59007f],
            [16384, 0x35004d], [32768, 0x000000]]) {
            final number = el[0];
            final color = el[1];

            var container = new h2d.Object();
            var rect = new h2d.Graphics(container);
            rect.beginFill(color);
            rect.drawRect(0, 0, Block.SIZE, Block.SIZE);
            rect.endFill();

            font.resizeTo(number <= 512 ? 64 : 48);
            var text = new h2d.Text(font, container);
            text.text = Std.string(number);
            text.textAlign = Center;
            text.textColor = number <= 4 ? 0x786e64 : 0xf7f3f4;
            text.setPosition(Block.SIZE / 2, Block.SIZE / 2 - text.textHeight / 2);

            var texture = new h3d.mat.Texture(Block.SIZE, Block.SIZE, [Target]);
            container.drawTo(texture);
            container.remove();

            var tile = h2d.Tile.fromTexture(texture);
            numbers.set(number, tile);
        }

        var blockManager = new BlockManager(s2d, numbers);
        blockManager.addBlock();
        blockManager.addBlock();

        new InputManager(s2d, blockManager);
    }

    override function update(dt: Float) {
        lastTime += dt;
        #if js
        SimpleActuator.stage_onEnterFrame(lastTime);
        #else
        SimpleActuator.stage_onEnterFrame();
        #end
    }
}
