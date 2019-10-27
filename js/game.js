import TextTypingPlugin from './plugins/texttyping-plugin.js';

new Phaser.Game({
  width: 600, // Canvas width in pixels
  height: 600, // Canvas height in pixels
  parent: "game", // ID of the DOM element to add the canvas to
  backgroundColor: '#b8e8d0', // The background color (blue)
  scene: [mainScene, battleScene, pokemonScene, bagScene], // The name of the scene we created
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }, // The physics engine to use
  plugins: {
      global: [{
          key: 'rexTextTyping',
          plugin: TextTypingPlugin,
          start: true
      },
      // ...
      ]
  }
});