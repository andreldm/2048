import { MainScene } from './scenes/main-scene';
import Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    width: 600,
    height: 600,
    backgroundColor: '#fff',
    type: Phaser.AUTO,
    parent: 'game-container',
    scene: [MainScene]
};

if (window.devicePixelRatio > 2)
  document.body.style.zoom = '60%';


new Phaser.Game(config);
