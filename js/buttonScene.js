class buttonScene extends Phaser.Scene {
	constructor() {
		super("buttonScene");
	}

	preload() {
		this.load.image("up", "assets/buttons/up.png");
		this.load.image("down", "assets/buttons/down.png");
		this.load.image("left", "assets/buttons/left.png");
		this.load.image("right", "assets/buttons/right.png");
		this.load.image("a", "assets/buttons/a.png");
		this.load.image("b", "assets/buttons/b.png");
		this.load.image("select", "assets/buttons/select.png");
		this.load.image("start", "assets/buttons/start.png");
	}

	upPress() {
		var temp = this.gameManager.scene.keys;
		for(let key in temp) {
			if(this.gameManager.scene.isActive(key)) {
				this.gameManager.scene.getAt(this.gameManager.scene.getIndex(key)).events.emit("Up");
				break;
			}
		}
	}

	downPress() {
		var temp = this.gameManager.scene.keys;
		for(let key in temp) {
			if(this.gameManager.scene.isActive(key)) {
				this.gameManager.scene.getAt(this.gameManager.scene.getIndex(key)).events.emit("Down");
				break;
			}
		}
	}

	leftPress() {
		var temp = this.gameManager.scene.keys;
		for(let key in temp) {
			if(this.gameManager.scene.isActive(key)) {
				this.gameManager.scene.getAt(this.gameManager.scene.getIndex(key)).events.emit("Left");
				break;
			}
		}
	}

	rightPress() {
		var temp = this.gameManager.scene.keys;
		for(let key in temp) {
			if(this.gameManager.scene.isActive(key)) {
				this.gameManager.scene.getAt(this.gameManager.scene.getIndex(key)).events.emit("Right");
				break;
			}
		}
	}

	yesPress() {
		var temp = this.gameManager.scene.keys;
		for(let key in temp) {
			if(this.gameManager.scene.isActive(key)) {
				this.gameManager.scene.getAt(this.gameManager.scene.getIndex(key)).events.emit("Yes");
				break;
			}
		}
	}

	noPress() {
		var temp = this.gameManager.scene.keys;
		for(let key in temp) {
			if(this.gameManager.scene.isActive(key)) {
				this.gameManager.scene.getAt(this.gameManager.scene.getIndex(key)).events.emit("No");
				break;
			}
		}
	}

	enterPress() {
		var temp = this.gameManager.scene.keys;
		for(let key in temp) {
			if(this.gameManager.scene.isActive(key)) {
				this.gameManager.scene.getAt(this.gameManager.scene.getIndex(key)).events.emit("Enter");
				break;
			}
		}
	}

	create(data) {
		this.gameManager = this.registry.values.registry.parent;

		this.up_button = this.add.image(150, 100, "up").setInteractive();
		this.down_button = this.add.image(150, 300, "down").setInteractive();
		this.left_button = this.add.image(50, 200, "left").setInteractive();
		this.right_button = this.add.image(250, 200, "right").setInteractive();
		this.a_button = this.add.image(450, 100, "a").setInteractive();
		this.b_button = this.add.image(450, 250, "b").setInteractive();
		this.select_button = this.add.image(250, 450, "select").setInteractive();
		this.start_button = this.add.image(400, 450, "start").setInteractive();

		this.up_button.on('pointerdown', this.upPress, this);
		this.down_button.on('pointerdown', this.downPress, this);
		this.left_button.on('pointerdown', this.leftPress, this);
		this.right_button.on('pointerdown', this.rightPress, this);
		this.a_button.on('pointerdown', this.yesPress, this);
		this.b_button.on('pointerdown', this.noPress, this);
		this.select_button.on('pointerdown', this.enterPress, this);
	}

	update(time, delta) {
	}
}