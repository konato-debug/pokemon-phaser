class mainScene extends Phaser.Scene {
	constructor() {
		super("mainScene");
	}

	preload() {
		// Main scene assets
		this.load.image("grass", "assets/FRLG_Grass.png");
		this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
		// https://pkmn.net/?action=content&page=viewpage&id=8628&parentsection=87
		for (let i = 1; i < 152; i++) {
			this.load.image('pokemon-back' + i, 'assets/pokemons/back/' + i.toString() + '.png');
		}
		// https://pkmn.net/?action=content&page=viewpage&id=8594&parentsection=223
		for (let i = 1; i < 152; i++) {
			this.load.image('pokemon' + i, 'assets/pokemons/front/' + i.toString() + '.png');
		}
		this.load.json('movesData', 'data/moves.json');
		this.load.json('pokedexData', 'data/pokedex.json');

		// Pokemon scene assets
		this.load.image('background', 'assets/pokemon-menu-background.png');
		this.load.image('pokeball', 'assets/pokemon-menu-pokeball2.png');
		this.load.image('selected-cancel', 'assets/selected-cancel.png');

		this.load.image('party-0', 'assets/party-0.png');
		this.load.image('party-0-highlighted', 'assets/party-0-highlighted.png');
		this.load.image('party-0-blank', 'assets/party-0-blank.png');

		this.load.image('party', 'assets/party.png');
		this.load.image('party-highlighted', 'assets/party-highlighted.png');
		this.load.image('party-blank', 'assets/party-blank.png');

		this.load.image('hp-bar', 'assets/hp_bar.png');

		// Battle scene assets
		this.load.image('battle-background', 'assets/battle-background3.png');
		this.load.image('battle-bar', 'assets/battle-bar.png');
		this.load.image('opponent-battle-bar', 'assets/opponent-battle-bar.png');
		this.load.spritesheet('pokeball_animation', 'assets/pokeball_animation.png', { frameWidth: 40, frameHeight: 40 });

		// Bag scene assets
		this.load.image('bag-background', 'assets/bag-background.png');

		// #region Loading...
		var loading_background = this.add.graphics();
		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(140, 275, 320, 50);

		var width = this.cameras.main.width;
		var height = this.cameras.main.height;
		var loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px monospace',
				fill: '#ffffff'
			}
		});
		loadingText.setOrigin(0.5, 0.5);

		var percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: '0%',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});
		percentText.setOrigin(0.5, 0.5);

		var assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: '',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});

		assetText.setOrigin(0.5, 0.5);

		loading_background.fillStyle(0x000000, 1);
		loading_background.fillRect(0, 0, 600, 600);

		this.load.on('progress', function (value) {
			percentText.setText(parseInt(value * 100) + '%');
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(150, 285, 300 * value, 30);
		});

		this.load.on('fileprogress', function (file) {
			assetText.setText('Loading asset: ' + file.key);
		});

		this.load.on('complete', function () {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
			loading_background.destroy();
		});
		// #endregion
	}

	create() {
		// Variables
		this.grassWidth = 16;
		this.grassHeight = 16
		this.grassScale = 2.0;
		this.pokemonEncounterChance = 1.0;
		this.moving = false;
		this.menuOn = false;
		this.selectedMenu = null;
		this.isMainScene = true;
		this.pokedexData = this.cache.json.get('pokedexData');
		this.pokemon_rarity_tiers = [9, 10, 10, 9, 10, 10, 9, 10, 10, 1, 2, 4, 1, 2, 4, 1, 1, 10, 1, 1, 1, 1, 1, 2, 5, 5, 9, 1, 1, 1, 1, 10, 1, 1, 10, 3, 7, 3, 10, 1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 4, 10, 1, 4, 5, 5, 4, 10, 1, 1, 4, 1, 1, 3, 1, 1, 1, 1, 10, 4, 6, 1, 1, 1, 2, 3, 1, 1, 1, 2, 1, 3, 7, 7, 3, 4, 10, 3, 1, 2, 1, 2, 1, 2, 4, 10, 5, 5, 8, 8, 5, 2, 5, 4, 5, 8, 2, 8, 1, 3, 1, 2, 6, 10, 8, 8, 6, 9, 8, 8, 5, 1, 1, 9, 7, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 10, 10, 10, 8, 8, 10, 10, 10];
		var temp = 0;
		this.pokemon_rarity_cumulative = this.pokemon_rarity_tiers.map(function (x) {
			temp += x;
			return temp;
		});

		this.cursors = this.input.keyboard.createCursorKeys();
		this.enterKey = this.input.keyboard.addKey('ENTER');
		this.yesKey = this.input.keyboard.addKey('A');
		this.noKey = this.input.keyboard.addKey('B');

		// Max number of pokemon is 6. At least 1 pokemon.
		this.pokemons = [{
			pokemon: 'Bulbasaur',
			moves: [['Growl', 2], ['Tackle', 13], ['Vine Whip', 10], ['Leech Seed', 3]],
			hp: 10,
			maxHp: 100,
			pokedex: 1
		}, {
			pokemon: 'Eevee',
			moves: [['Growl', 15], ['Tackle', 15], ['Tail Whip', 15], ['Bite', 15]],
			hp: 20,
			maxHp: 100,
			pokedex: 133
		}, {
			pokemon: 'Squirtle',
			moves: [['Growl', 15], ['Tackle', 15], ['Vine Whip', 15], ['Leech Seed', 15]],
			hp: 0,
			maxHp: 100,
			pokedex: 7
		},
		];

		// Convert move.json into a dictionary
		this.tempMoves = this.cache.json.get('movesData');
		this.moves = {};
		this.numMoves = this.tempMoves.length;
		for (var i = 0; i < this.numMoves; i++) {
			this.moves[this.tempMoves[i]["ename"]] = this.tempMoves[i];
		}

		// Convert move.json into dictionary by type
		this.typeMoves = {};
		for (var i = 0; i < this.numMoves; i++) {
			if (this.tempMoves[i]["type"] in this.typeMoves) {
				this.typeMoves[this.tempMoves[i]["type"]].push(this.tempMoves[i]);
			} else {
				this.typeMoves[this.tempMoves[i]["type"]] = [this.tempMoves[i]];
			}
		}

		this.generateGrasses();
		this.initializePlayer();
		this.initializeMenu();
		this.toggleMenu();
	}

	update(time, delta) {
		// Moving player
		if (!this.moving && !this.menuOn) {
			if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
				this.playerLeft();
			}
			else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
				this.playerRight();
			}
			else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
				this.playerUp();
			}
			else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
				this.playerDown();
			}
		}

		// Up and down menu
		if (this.menuOn) {
			if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
				if (this.selectedMenu != 0) {
					this.menuPointer.y -= 30;
					this.selectedMenu -= 1;
				} else {
					this.menuPointer.y += 30 * 2;
					this.selectedMenu += 2;
				}
			}
			else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
				if (this.selectedMenu != 2) {
					this.menuPointer.y += 30;
					this.selectedMenu += 1;
				} else {
					this.menuPointer.y -= 30 * 2;
					this.selectedMenu -= 2;
				}
			}
			// Press yes
			else if (Phaser.Input.Keyboard.JustDown(this.yesKey)) {
				switch (this.selectedMenu) {
					case 0:
						this.toggleMenu();
						this.game.scene.sleep('mainScene');
						this.game.scene.run('pokemonScene', this);
						break;
					case 1:
						this.toggleMenu();
						this.game.scene.sleep('mainScene');
						this.game.scene.run('bagScene', this);
						break;
					case 2:
						this.toggleMenu();
						break;
				}
			}
			// Press no
			else if (Phaser.Input.Keyboard.JustDown(this.noKey)) {
				this.toggleMenu();
			}
		}

		// Open menu
		if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
			this.toggleMenu();
		}
	}

	initializePlayer() {
		this.player = this.physics.add.sprite(100, 192, 'player');
		this.player.setCollideWorldBounds(true);
		this.player.setSize(32, 32);
		this.player.setOffset(0, 16);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
			frameRate: 10,
			repeat: 0
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
			frameRate: 10,
			repeat: 0
		});

		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
			frameRate: 10,
			repeat: 0
		});

		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: 0
		});
	}

	generateGrasses() {
		this.grasses = this.physics.add.group();

		for (var i = 0; i < 4; i++) {
			this.tempGrasses = this.physics.add.group({
				key: 'grass',
				repeat: 10,
				setXY: {
					x: 100,
					y: 200 + (this.grassHeight * this.grassScale) * i,
					stepX: this.grassWidth * this.grassScale
				},
				setScale: { x: this.grassScale, y: this.grassScale }
			});
			this.grasses = this.grasses.addMultiple(this.tempGrasses.getChildren());
		}
	}

	initializeMenu() {
		this.graphics = this.add.graphics();

		this.graphics.fillStyle(0x786c84, 1);
		this.graphics.fillRoundedRect(445, 0, 145, 600, 10);
		this.graphics.fillStyle(0xfff9fd, 1);
		this.graphics.fillRoundedRect(450, 5, 135, 590, 10);

		this.pokemonText = this.add.text(470, 25, 'POKEMON', { color: '#000000', align: 'center' }).setFontSize('25px');
		this.bagText = this.add.text(470, 55, 'BAG', { color: '#000000', align: 'center' }).setFontSize('25px');
		this.exitText = this.add.text(470, 85, 'EXIT', { color: '#000000', align: 'center' }).setFontSize('25px');

		this.menuPointer = this.add.polygon(460, 37, [0, 0, 0, 20, 10, 10], 0x636363);

		this.selectedMenu = 0;
		this.menuOn = true;
	}

	toggleMenu() {
		if (this.menuPointer.visible) {
			this.graphics.clear();

			this.pokemonText.setVisible(false);
			this.bagText.setVisible(false);
			this.exitText.setVisible(false);

			this.menuPointer.setVisible(false);
			this.menuOn = false;
		}
		else {
			this.initializeMenu();
		}
	}

	playerLeft() {
		this.moving = true;
		this.tweens.add({
			targets: this.player,
			x: this.player.x - this.grassHeight * this.grassScale,
			duration: 200,
			yoyo: false,
			onComplete: function () {
				if (this.checkOverlapping()) {
					this.checkPokemonEncounter();
				}
				this.moving = false;
			},
			onCompleteScope: this
		});
		this.player.anims.play('left');
	}

	playerRight() {
		this.moving = true;
		this.tweens.add({
			targets: this.player,
			x: this.player.x + this.grassHeight * this.grassScale,
			duration: 200,
			yoyo: false,
			onComplete: function () {
				if (this.checkOverlapping()) {
					this.checkPokemonEncounter();
				}
				this.moving = false;
			},
			onCompleteScope: this
		});
		this.player.anims.play('right');
	}

	playerUp() {
		this.moving = true;
		this.tweens.add({
			targets: this.player,
			y: this.player.y - this.grassHeight * this.grassScale,
			duration: 200,
			yoyo: false,
			onComplete: function () {
				if (this.checkOverlapping()) {
					this.checkPokemonEncounter();
				}
				this.moving = false;
			},
			onCompleteScope: this
		});
		this.player.anims.play('up');
	}

	playerDown() {
		this.moving = true;
		this.tweens.add({
			targets: this.player,
			y: this.player.y + this.grassHeight * this.grassScale,
			duration: 200,
			yoyo: false,
			onComplete: function () {
				if (this.checkOverlapping()) {
					this.checkPokemonEncounter();
				}
				this.moving = false;
			},
			onCompleteScope: this
		});
		this.player.anims.play('down');
	}

	checkPokemonEncounter() {
		var isEncounter = Math.random() < this.pokemonEncounterChance;
		if (isEncounter) {
			this.pokemonEncounter();
		}
	}

	pokemonEncounter() {
		this.game.scene.sleep('mainScene');
		this.game.scene.run('battleScene', this);
	}

	checkOverlapping() {
		this.overlap = false;
		this.physics.overlap(this.player, this.grasses, this.collideCallback, null, this)
		if (this.overlap) {
			return true;
		}
		return false;
	}

	overlappingArea(l1, r1, l2, r2) {
		// Area of 1st Rectangle 
		var area1 = Math.abs(l1.x - r1.x) *
			Math.abs(l1.y - r1.y);

		// Area of 2nd Rectangle 
		var area2 = Math.abs(l2.x - r2.x) *
			Math.abs(l2.y - r2.y);

		// Length of intersecting part i.e  
		// start from max(l1.x, l2.x) of  
		// x-coordinate and end at min(r1.x, 
		// r2.x) x-coordinate by subtracting  
		// start from end we get required  
		// lengths 
		var areaI = (Math.min(r1.x, r2.x) -
			Math.max(l1.x, l2.x)) *
			(Math.min(r1.y, r2.y) -
				Math.max(l1.y, l2.y));

		var overlappingArea = (area1 + area2 - areaI);
		return overlappingArea;
	}

	collideCallback(gameObject1, gameObject2) {
		var l1 = { x: gameObject1.x, y: gameObject1.y + gameObject1.height };
		var l2 = { x: gameObject1.x + gameObject1.width, y: gameObject1.y };
		var r1 = { x: gameObject2.x, y: gameObject2.y + gameObject2.height };
		var r2 = { x: gameObject2.x + gameObject2.width, y: gameObject2.y };
		var overlappingArea = this.overlappingArea(l1, r1, l2, r2);
		if (overlappingArea < 0) {
			this.overlap = true;
		}
	}
}