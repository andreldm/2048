import hxd.Key;

class InputManager {
    final SWIPE_THRESHOLD: Int = 200;
    final listeners: Array<Listener> = [];
    var startX: Float = 0;
    var startY: Float = 0;
    var pressed: Bool = false;

    public function new(scene: h2d.Scene, listener: Listener) {
        hxd.Window.getInstance().addEventTarget(onEvent);
        listeners.push(listener);
    }

    function onEvent(event : hxd.Event) {
        if (event.kind == EKeyDown && !pressed) {
            switch(event.keyCode) {
                case Key.LEFT | Key.A: handle(Direction.Left);
                case Key.RIGHT | Key.D: handle(Direction.Right);
                case Key.UP | Key.W: handle(Direction.Up);
                case Key.DOWN | Key.S: handle(Direction.Down);
                #if !js
                case Key.ESCAPE: hxd.Window.getInstance().close();
                #end
            }
        }
        if (event.kind == EKeyUp) pressed = false;
        if (event.kind == EPush) onClickPressed(event);
        if (event.kind == ERelease) onClickReleased(event);
    }

    function onClickPressed(event: hxd.Event) {
        startX = event.relX;
        startY = event.relY;
        pressed = true;
    }

    function onClickReleased(event: hxd.Event) {
        if (!pressed) return;
        pressed = false;

        var deltaX = event.relX - startX;
        var deltaY = event.relY - startY;

        if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    handle(Direction.Right);
                } else {
                    handle(Direction.Left);
                }
            } else {
                if (deltaY > 0) {
                    handle(Direction.Down);
                } else {
                    handle(Direction.Up);
                }
            }
        }
    }

    function handle(direction: Direction) {
        pressed = true;
        for (l in listeners)
            l.handle(direction);
    }
}
