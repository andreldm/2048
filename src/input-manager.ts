import { Game } from 'phaser';

export default class InputManager {
    private readonly SWIPE_THRESHOLD: number = 100;

    private listeners!: any[];
    private startX: number = 0;
    private startY: number = 0;

    constructor(game: Game, listeners: any[]) {
        const scene = game.scene.getAt(0);

        this.listeners = listeners;

        scene.input.keyboard.on('keydown-W', (event: KeyboardEvent) => { if (!event.repeat) this.handle(Direction.Up) });
        scene.input.keyboard.on('keydown-UP', (event: KeyboardEvent) => { if (!event.repeat) this.handle(Direction.Up) });
        scene.input.keyboard.on('keydown-A', (event: KeyboardEvent) => { if (!event.repeat) this.handle(Direction.Left) });
        scene.input.keyboard.on('keydown-LEFT', (event: KeyboardEvent) => { if (!event.repeat) this.handle(Direction.Left) });
        scene.input.keyboard.on('keydown-S', (event: KeyboardEvent) => { if (!event.repeat) this.handle(Direction.Down) });
        scene.input.keyboard.on('keydown-DOWN', (event: KeyboardEvent) => { if (!event.repeat) this.handle(Direction.Down) });
        scene.input.keyboard.on('keydown-D', (event: KeyboardEvent) => { if (!event.repeat) this.handle(Direction.Right) });
        scene.input.keyboard.on('keydown-RIGHT', (event: KeyboardEvent) => { if (!event.repeat) this.handle(Direction.Right) });

        scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.startX = pointer.x;
            this.startY = pointer.y;
        });

        scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            const deltaX = pointer.x - this.startX;
            const deltaY = pointer.y - this.startY;

            if (Math.abs(deltaX) > this.SWIPE_THRESHOLD || Math.abs(deltaY) > this.SWIPE_THRESHOLD) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) {
                        this.handle(Direction.Right);
                    } else {
                        this.handle(Direction.Left);
                    }
                } else {
                    if (deltaY > 0) {
                        this.handle(Direction.Down);
                    } else {
                        this.handle(Direction.Up);
                    }
                }
            }
        });
    }

    handle(direction: Direction) {
        this.listeners.forEach((l: any) => {
            l.handle(direction);
        });
    }
}

export enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}
