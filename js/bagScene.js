class bagScene extends Phaser.Scene {
	constructor() {
		super("bagScene");
	}

	preload() {
	}

	create(data) {
		// Variables
		this.numOptions = 2;
		this.isOption2On = false;
		this.selectedOption = 0;
		this.selectedOption2 = 0;
		this.isBagScene = true;
		this.pokemons = data.pokemons;
		this.isTyping = false;
		
		this.isUpPress = false;
		this.isDownPress = false;
		this.isLeftPress = false;
		this.isRightPress = false;
		this.isYesPress = false;
		this.isNoPress = false;
		this.isEnterPress = false;

		this.isMainScene = false;
		if ("isMainScene" in data) {
			this.isMainScene = true;
		}

		// Cursors
		this.cursors = this.input.keyboard.createCursorKeys();
		this.yesKey = this.input.keyboard.addKey('A');
		this.noKey = this.input.keyboard.addKey('B');

		// Event listeners for mobile controls
		this.events.addListener("Up", this.up, this);
		this.events.addListener("Down", this.down, this);
		this.events.addListener("Left", this.left, this);
		this.events.addListener("Right", this.right, this);
		this.events.addListener("Yes", this.yes, this);
		this.events.addListener("No", this.no, this);
		this.events.addListener("Enter", this.enter, this);

		// Interfaces
		var background = this.add.image(300, 300, 'bag-background').setScale(2.5);
		this.menuPointer = this.add.polygon(290, 160, [0, 0, 0, 20, 10, 10], 0x636363);
		this.item_0 = this.add.text(300, 145, 'POTION', { color: '#000000' }).setFontSize('30px');
		this.item_1 = this.add.text(300, 185, 'POKe BALL', { color: '#000000' }).setFontSize('30px');

		// #region Menu option 2
		// Menu bottom right chat bubbles
		this.option2_menu = this.add.graphics();
		this.option2_menu.fillStyle(0xdc5436, 1);
		this.option2_menu.fillRoundedRect(400, 380, 190, 115, 20);
		this.option2_menu.fillStyle(0x629ba0, 1);
		this.option2_menu.fillRoundedRect(405, 385, 180, 105, 20);

		// Menu bottom right text
		this.menuPointer2 = this.add.polygon(420, 417, [0, 0, 0, 20, 10, 10], 0x636363);
		this.use_text = this.add.text(430, 405, 'USE', { color: '#000000' }).setFontSize('30px');
		this.cancel_text = this.add.text(430, 445, 'CANCEL', { color: '#000000' }).setFontSize('30px');
		this.setMenu2(false);
		// #endregion

		// Menu option 3
		// this.option3_menu = this.add.graphics();
		// this.option3_menu.fillStyle(0xdc5436, 1);
		// this.option3_menu.fillRoundedRect(0, 380, 600, 115, 20);
		// this.option3_menu.fillStyle(0x629ba0, 1);
		// this.option3_menu.fillRoundedRect(5, 385, 590, 105, 20);
		// this.option3_text = this.add.text(15, 390, 'CANCEL', { color: '#000000' }).setFontSize('30px');
		// this.option3_typing = this.plugins.get('rexTextTyping').add(this.option3_text, {speed: 50});
		// this.option3_typing.start("testadasds asdsad asdsa asdsad");

	}

	left() {
		this.isLeftPress = true;
	}
	right() {
		this.isRightPress = true;
	}
	up() {
		this.isUpPress = true;
	}
	down() {
		this.isDownPress = true;
	}
	yes() {
		this.isYesPress = true;
	}
	no() {
		this.isNoPress = true;
	}
	enter() {
		this.isEnterPress = true;
	}

	setMenu2(flag) {
		this.menuPointer2.setVisible(flag);
		this.use_text.setVisible(flag);
		this.cancel_text.setVisible(flag);
		this.option2_menu.setVisible(flag);
		if (flag) {
			this.isOption2On = true;
			this.menuPointer2.x = 420;
			this.menuPointer2.y = 417;
			this.selectedOption2 = 0;
		} else {
			this.isOption2On = false;
		}
	}

	update(time, delta) {
		// Press down
		if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || this.isDownPress) {
			// If menu is on
			if (this.isOption2On) {
				if (this.selectedOption2 != 1) {
					this.selectedOption2 += 1;
					this.menuPointer2.y += 40;
				}
			}
			// If menu is not on
			else {
				if (this.selectedOption != this.numOptions - 1) {
					this.selectedOption += 1;
					this.menuPointer.y += 40;
				}
			}
			this.isDownPress = false;
		}
		// Press up
		else if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || this.isUpPress) {
			// If menu is on
			if (this.isOption2On) {
				if (this.selectedOption2 != 0) {
					this.selectedOption2 -= 1;
					this.menuPointer2.y -= 40;
				}
			}
			// If menu is not on
			else {
				if (this.selectedOption != 0) {
					this.selectedOption -= 1;
					this.menuPointer.y -= 40;
				}
			}
			this.isUpPress = false;
		}
		// Press yes
		else if (Phaser.Input.Keyboard.JustDown(this.yesKey) || this.isYesPress) {
			// If menu is on
			if (this.isOption2On) {
				switch (this.selectedOption2) {
					// Use
					case 0:
						switch (this.selectedOption) {
							// Potion
							case 0:
								this.setMenu2(false);
								this.game.scene.sleep('bagScene');
								this.game.scene.run('pokemonScene', this);
								this.isYesPress = false;
								break;
							// Pokeball
							case 1:
								// TODO
								if(this.isMainScene) {

								} else {
									this.game.scene.stop('bagScene');
									this.game.scene.run('battleScene', this);
									this.game.scene.getScene("battleScene").catchPokemon();
									this.isYesPress = false;
									break;
								}
						}
						break;
					// Cancel
					case 1:
						this.setMenu2(false);
						this.isYesPress = false;
						break;
				}
			}
			// If menu is not on
			else {
				this.setMenu2(true);
				this.isYesPress = false;
			}
		}
		// Press no
		else if (Phaser.Input.Keyboard.JustDown(this.noKey) || this.isNoPress) {
			// If menu is on
			if (this.isOption2On) {
				this.setMenu2(false);
				this.isNoPress = false;
			}
			// If menu is not on
			else {
				this.game.scene.stop('bagScene');
				if (this.isMainScene) {
					this.game.scene.run('mainScene', this);
					this.isNoPress = false;
				} else {
					this.game.scene.getScene('battleScene').setOwnPokemonHP();
					this.game.scene.run('battleScene', this);
					this.isNoPress = false;
				}
			}
		}
	}
}