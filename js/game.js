import TextTypingPlugin from './plugins/texttyping-plugin.js';

var mainGameCanvas = new Phaser.Game({
  width: 600, // Canvas width in pixels
  height: 600, // Canvas height in pixels
  parent: "game", // ID of the DOM element to add the canvas to
  backgroundColor: '#b8e8d0', // The background color (blue)
  scene: [mainScene, battleScene, pokemonScene, bagScene], // The name of the scene we created
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
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
  },
  callbacks: {
    postBoot: function (game) {
      if (game.device.os.desktop) {
        console.log("desktop");
      }
      else {
        console.log("mobile");
        createButtonCanvas();
      }
    }
  }
});

function createButtonCanvas() {
  var buttonCanvas = new Phaser.Game({
    width: 600, // Canvas width in pixels
    height: 600, // Canvas height in pixels
    parent: "button", // ID of the DOM element to add the canvas to
    backgroundColor: '#000000', // The background color
    scene: [buttonScene], // The name of the scene we created
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    }, // The physics engine to use
    callbacks: {
      preBoot: function (game) {
        // Pass game canvas to button canvas for button events
        game.registry.merge(mainGameCanvas);
      }
    }
  });
}




