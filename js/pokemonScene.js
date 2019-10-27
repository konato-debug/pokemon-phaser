class pokemonScene extends Phaser.Scene {
	constructor() {
		super("pokemonScene");
	}

	preload() {
	}

	create(data) {
		// #region Variables
		this.pokemons = data.pokemons;
		this.numPokemon = this.pokemons.length;
		this.game = data.game;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.yesKey = this.input.keyboard.addKey('A');
		this.noKey = this.input.keyboard.addKey('B');
		this.selectedMenu = "0";
		this.selectedMenu2 = null;
		this.isSelectedMenu2 = false;
		this.isBattleScene = false;
		this.isBagScene = false;
		// If from battle scene
		if ("isBattleScene" in data) {
			this.switch_pokemon_index = null;
			this.isBattleScene = true;
		}
		// If from bag scene, use potion
		if ("isBagScene" in data) {
			this.isBagScene = true;
		}
		// Empty the bar
		this.party_empty_list = [null, null, null, null, null, null];
		// Fill the bar
		this.party_fill_list = [null, null, null, null, null, null];
		// Highlight the bar
		this.party_highlight_list = [null, null, null, null, null, null];
		// Pokemon sprite
		this.party_pokemon_list = [null, null, null, null, null, null];
		// Each Pokemon's hp bar
		this.party_pokemon_hp = [null, null, null, null, null, null];
		var background = this.add.image(300, 300, 'background');
		// #endregion

		if (this.numPokemon > 0) {
			// 0th box
			this.party_fill_list[0] = this.add.image(100, 200, 'party-0');
			this.party_fill_list[0].setScale(2.0);
			// Filled boxes
			for (var i = 1; i < Math.min(this.numPokemon, 6); i++) {
				this.party_fill_list[i] = this.add.image(400, (150 + (i - 1) * 60), 'party');
				this.party_fill_list[i].setScale(2.5);
			}
			// Empty boxes
			for (var i = Math.min(this.numPokemon, 6); i < 6; i++) {
				this.party_empty_list[i] = this.add.image(400, (150 + (i - 1) * 60), 'party-blank');
				this.party_empty_list[i].setScale(2.5);
			}
		} else {
			// 0th box
			this.party_empty_list[0] = this.add.image(100, 200, 'party-0-blank');
			this.party_empty_list[0].setScale(2.0);
			// Empty boxes
			for (var i = 1; i < 6; i++) {
				this.party_empty_list[i] = this.add.image(400, (150 + (i - 1) * 60), 'party-blank');
				this.party_empty_list[i].setScale(2.5);
			}
		}

		// Highlight list
		this.party_highlight_list[0] = this.add.image(100, 200, 'party-0-highlighted');
		this.party_highlight_list[0].setScale(2.0);
		for (var i = 1; i < 6; i++) {
			this.party_highlight_list[i] = this.add.image(400, 150 + ((i - 1) * 60), 'party-highlighted');
			this.party_highlight_list[i].setScale(2.5);
		}

		// Pokemon list
		if (this.numPokemon > 0) {
			this.party_pokemon_list[0] = this.add.image(45, 175, "pokemon" + this.pokemons[0]["pokedex"]);
			for (var i = 1; i < this.numPokemon; i++) {
				this.party_pokemon_list[i] = this.add.image(250, 150 + ((i - 1) * 60), "pokemon" + this.pokemons[i]["pokedex"]);
			}
		}

		// Pokemon names
		this.add.text(70, 170, this.pokemons[0]["pokemon"], { color: '#ffffff', align: 'center' }).setFontSize('15px');
		for (var i = 1; i < this.numPokemon; i++) {
			this.add.text(270, 140 + ((i - 1) * 60), this.pokemons[i]["pokemon"], { color: '#ffffff', align: 'center' }).setFontSize('15px');
		}

		// Hp bar - displayWidth: 97 pixels (pokemon 0), 121 pixels (pokemon 1, 2, 3, 4, 5)
		this.party_pokemon_hp[0] = this.add.image(70, 216, "hp-bar").setOrigin(0);
		this.party_pokemon_hp[0].displayWidth = this.pokemons[0]["hp"] / this.pokemons[0]["maxHp"] * 97;

		for (let i = 1; i < this.numPokemon; i++) {
			this.party_pokemon_hp[i] = this.add.image(442, 141 + ((i - 1) * 60), "hp-bar").setOrigin(0);
			this.party_pokemon_hp[i].displayWidth = this.pokemons[i]["hp"] / this.pokemons[i]["maxHp"] * 122;
		}

		// Cancel button
		this.selected_cancel = this.add.image(530, 460, 'selected-cancel');
		this.selected_cancel.setScale(2.5);
		var pokeball = this.add.image(460, 455, 'pokeball');
		pokeball.setScale(3.0);
		this.cancelText = this.add.text(492, 447, 'CANCEL').setFontSize('25px');

		// #region Menu 2 interfaces
		// Bottom left box
		this.bottom_left_box = this.add.graphics();
		this.bottom_left_box.fillStyle(0xdc5436, 1);
		this.bottom_left_box.fillRoundedRect(5, 420, 420, 75, 20);
		this.bottom_left_box.fillStyle(0x629ba0, 1);
		this.bottom_left_box.fillRoundedRect(10, 425, 410, 65, 20);

		// Bottom right box
		this.bottom_right_box = this.add.graphics();
		if (this.isBattleScene) {
			this.bottom_right_box.fillStyle(0xdc5436, 1);
			this.bottom_right_box.fillRoundedRect(430, 330, 165, 165, 20);
			this.bottom_right_box.fillStyle(0x629ba0, 1);
			this.bottom_right_box.fillRoundedRect(435, 335, 155, 155, 20);
		} else {
			this.bottom_right_box.fillStyle(0xdc5436, 1);
			this.bottom_right_box.fillRoundedRect(430, 370, 165, 125, 20);
			this.bottom_right_box.fillStyle(0x629ba0, 1);
			this.bottom_right_box.fillRoundedRect(435, 375, 155, 115, 20);
		}

		// Other interfaces
		this.bottom_left_text = this.add.text(13, 447, 'Do what with this Pokemon?', { color: "#000000" }).setFontSize('25px');
		if (this.isBattleScene) {
			this.shift_text = this.add.text(460, 360, 'SHIFT', { color: '#000000' }).setFontSize('30px');
		}
		this.summary_test = this.add.text(460, 400, 'SUMMARY', { color: '#000000' }).setFontSize('30px');
		this.cancel_test = this.add.text(460, 440, 'CANCEL', { color: '#000000' }).setFontSize('30px');
		this.menuPointer = this.add.polygon(450, 373, [0, 0, 0, 20, 10, 10], 0x636363);
		// #endregion

		this.setMenu2(false);

		this.dehighlightAll();
		if (this.numPokemon > 0) {
			this.party_highlight_list[0].setVisible(true);
		}

	}

	switchPokemon() {
		this.switch_pokemon_index = parseInt(this.selectedMenu);
		// Don't allow switching if this Pokemon is fainted
		if(this.pokemons[this.switch_pokemon_index]["hp"] <= 0) {
			this.bottom_left_text.setText("The Pokemon is fainted");
		} else {
			this.game.scene.getScene("battleScene").isFromPokemonScene = true;
			this.game.scene.getScene("battleScene").currentPokemonIndex = this.switch_pokemon_index;
			this.game.scene.getScene("battleScene").currentMenu = "Menu";
			this.game.scene.getScene("battleScene").selectedMenu = "Fight";
			this.game.scene.stop("pokemonScene");
			this.game.scene.run("battleScene");
			this.game.scene.getScene("battleScene").summonPokemon();
		}
	}

	update(time, delta) {
		// Press down
		if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
			// If Menu 2 is on
			if (this.isSelectedMenu2) {
				// If is battle scene
				if (this.isBattleScene) {
					switch (this.selectedMenu2) {
						case "Shift":
							this.menuPointer.y += 40;
							this.selectedMenu2 = "Summary";
							break;
						case "Summary":
							this.menuPointer.y += 40;
							this.selectedMenu2 = "Cancel";
							break;
						case "Cancel":
							break;
					}
				} else {
					switch (this.selectedMenu2) {
						case "Summary":
							this.menuPointer.y += 40;
							this.selectedMenu2 = "Cancel";
							break;
						case "Cancel":
							break;
					}
				}
			} else {
				this.dehighlightAll();
				if (this.selectedMenu != Math.min(this.numPokemon, 6) - 1 && this.selectedMenu != "Cancel") {
					this.selectedMenu = (parseInt(this.selectedMenu) + 1).toString();
					this.party_highlight_list[parseInt(this.selectedMenu)].setVisible(true);
				}
				else if (this.selectedMenu == Math.min(this.numPokemon, 6) - 1) {
					this.selectedMenu = "Cancel";
					this.selected_cancel.setVisible(true);
				}
				else if (this.selectedMenu == "Cancel") {
					this.selectedMenu = "0";
					this.party_highlight_list[parseInt(this.selectedMenu)].setVisible(true);
				}
			}
		}
		// Press up
		else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
			// If Menu 2 is on
			if (this.isSelectedMenu2) {
				// If is battle scene
				if (this.isBattleScene) {
					switch (this.selectedMenu2) {
						case "Shift":
							break;
						case "Summary":
							this.menuPointer.y -= 40;
							this.selectedMenu2 = "Shift";
							break;
						case "Cancel":
							this.menuPointer.y -= 40;
							this.selectedMenu2 = "Summary";
							break;
					}
				} else {
					switch (this.selectedMenu2) {
						case "Summary":
							break;
						case "Cancel":
							this.menuPointer.y -= 40;
							this.selectedMenu2 = "Summary";
							break;
					}
				}
			}
			else {
				this.dehighlightAll();
				if (this.selectedMenu != 0 && this.selectedMenu != "Cancel") {
					this.selectedMenu = (parseInt(this.selectedMenu) - 1).toString();
					this.party_highlight_list[parseInt(this.selectedMenu)].setVisible(true);
				}
				else if (this.selectedMenu == 0) {
					this.selectedMenu = "Cancel";
					this.selected_cancel.setVisible(true);
				}
				else if (this.selectedMenu == "Cancel") {
					this.selectedMenu = (Math.min(this.numPokemon, 6) - 1).toString();
					this.party_highlight_list[parseInt(this.selectedMenu)].setVisible(true);
				}
			}
		}
		// Press left
		else if (Phaser.Input.Keyboard.JustDown(this.cursors.left) && !this.isSelectedMenu2) {
			this.dehighlightAll();
			if (this.selectedMenu in ["1", "2", "3", "4", "5"]) {
				this.selectedMenu = "0";
				this.party_highlight_list[0].setVisible(true);
			}
		}
		// Press right
		else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) && !this.isSelectedMenu2) {
			this.dehighlightAll();
			if (this.selectedMenu in ["0"]) {
				if (this.numPokemon >= 2) {
					this.selectedMenu = "1";
					this.party_highlight_list[1].setVisible(true);
				}
			}
		}
		// Press yes
		else if (Phaser.Input.Keyboard.JustDown(this.yesKey)) {
			// If Menu 2 is on
			if (this.isSelectedMenu2) {
				switch (this.selectedMenu2) {
					case "Cancel":
						this.setMenu2(false);
						this.isSelectedMenu2 = false;
						break;
					case "Summary":
						break;
					case "Shift":
						this.switchPokemon();
						break;
				}
			} else {
				// If at Menu 1's Cancel
				if (this.selectedMenu == "Cancel") {
					this.game.scene.stop('pokemonScene');
					this.game.scene.run('mainScene');
				}
				// If from bag scene, use potion for this Pokemon/ heal Pokemon
				else if (this.isBagScene) {
					if (this.selectedMenu != "Cancel") {
						this.pokemons[parseInt(this.selectedMenu)]["hp"] += 40;
						if (this.pokemons[parseInt(this.selectedMenu)]["hp"] > 100) this.pokemons[parseInt(this.selectedMenu)]["hp"] = 100;
						this.tweens.add({
							targets: this.party_pokemon_hp[parseInt(this.selectedMenu)],
							displayWidth: this.pokemons[parseInt(this.selectedMenu)]["hp"] / this.pokemons[parseInt(this.selectedMenu)]["maxHp"] * (this.selectedMenu == "0" ? 97 : 122),
							duration: 200,
							repeat: 0,
							loop: 0,
							yoyo: false,
							onComplete: function () {
								this.game.scene.stop("pokemonScene");
								this.game.scene.run("bagScene", this);
							},
							onCompleteScope: this
						});
					} else {
						this.game.scene.stop("bagScene");
						this.game.scene.run("battleScene");
					}
				}
				// Show menu 2 for this Pokemon
				else {
					this.setMenu2(true);
					if (this.isBattleScene) {
						this.selectedMenu2 = "Shift";
					} else {
						this.selectedMenu2 = "Summary";
					}
					this.isSelectedMenu2 = true;
				}
			}
		}
		// Press no
		else if (Phaser.Input.Keyboard.JustDown(this.noKey)) {
			// If Menu 2 is on
			if (this.isSelectedMenu2) {
				this.setMenu2(false);
				this.isSelectedMenu2 = false;
			} else {
				if (this.isBattleScene) {
					this.game.scene.stop('pokemonScene');
					this.game.scene.run('battleScene');
				} else {
					this.game.scene.stop('pokemonScene');
					this.game.scene.run('mainScene');
				}
			}
		}
	}

	setMenu2(flag) {
		this.bottom_left_box.setVisible(flag);
		this.bottom_right_box.setVisible(flag);
		this.bottom_left_text.setVisible(flag);
		if (this.isBattleScene) {
			this.shift_text.setVisible(flag);
		}
		this.summary_test.setVisible(flag);
		this.cancel_test.setVisible(flag);
		this.menuPointer.setVisible(flag);
		if (flag == true) {
			this.menuPointer.x = 450;
			this.menuPointer.y = 373;
			this.bottom_left_text.setText("Do what with this Pokemon?");
		}
		if (!this.isBattleScene) {
			this.menuPointer.y += 40;
		}
	}

	dehighlightAll() {
		for (var i = 0; i < 6; i++) {
			this.party_highlight_list[i].setVisible(false);
		}
		this.selected_cancel.setVisible(false);
	}
}