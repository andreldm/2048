class InputManager {
    final listeners: Array<Listener> = [];

    public function new(listener: Listener) {
        hxd.Window.getInstance().addEventTarget(onEvent);
        listeners.push(listener);
    }

    function onEvent(event : hxd.Event) {
        if (event.kind == EKeyDown) {
            switch(event.keyCode) {
                    case hxd.Key.LEFT: handle(Direction.Left);
                    case hxd.Key.RIGHT: handle(Direction.Right);
                    case hxd.Key.UP: handle(Direction.Up);
                    case hxd.Key.DOWN: handle(Direction.Down);
                    #if !js
                    case hxd.Key.ESCAPE: hxd.Window.getInstance().close();
                    #end
                    case _:
                }
        }
    }

    function handle(direction: Direction) {
        for (l in listeners)
            l.handle(direction);
    }
}
