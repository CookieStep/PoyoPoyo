class Multiplayer {
	async run() {
		if(this.running) return;
		this.running = true;
		if(this.room) {
			if(this.inGame) main();
			else{
				ctx.clear();
				ctx.fillStyle = "black";
				ctx.font = `${scale}px Arial`;
				ctx.fillText("Waiting for opponent...", 0, innerHeight);
			}
		}else if(this.canvas) {
			ctx.clear();
			ctx.drawImage(this.canvas, 0, 0);

			ctx.strokeStyle = "black";
			ctx.lineWidth = this.h/8;
			ctx.stroke(this.list[this.selected].path);
	
			if(keys.multi("KeyS") || keys.multi("ArrowDown")) {
				++this.selected;
			}
			if(keys.multi("KeyW") || keys.multi("ArrowUp")) {
				--this.selected;
			}
			if(keys.single("Enter") || keys.single("Space")) {
				this.list[this.selected].use?.();
			}
			this.selected += this.list.length;
			this.selected %= this.list.length;
		}
		this.running = false;
	}
	selected = 0;
	constructor() {
		this.startup();
	}
	async startup() {
		this.name = prompt("Enter a name");
		delete this.room;
		this.active = true;
		await this.connect();
		this.sendData({games: 1});
	}
	connect() {
		var ws = new WebSocket("wss://poyoserver.cookiexe.repl.co");
		this.ws = ws;
		return new Promise((resolve, reject) => {
			ws.onopen = ev => {
				this.setupWs();
				resolve(ev);
			};
			ws.onerror = reject;
		});
	}
	setupWs() {
		var {ws} = this;
		this.connected = true;
		var onData = ev => {
			var data;
			try{data = JSON.parse(ev.data)}catch(err) {console.error(err)}
			if(data) {
				console.log(data);
				this.onData(data);
			}
		};
		var disconnect = () => this.connected = false;

		ws.onerror = disconnect;
		ws.onclose = disconnect;
		ws.onmessage = onData;
	}
	onData({games, room, colors, updateGrid}) {
		if(games) {
			this.rooms = new Set(games);
			this.makeRoomList();
			this.drawRoomList();
		}
		if(room) {
			this.room = room;
		}
		if(colors) {
			this.colors = colors;
			this.inGame = true;
			this.enemyGrid = new Grid;
		}
		if(updateGrid) {
			this.enemyGrid.import(updateGrid);
		}
	}
	makeRoomList() {
		var createRoom = () => this.createRoom();
		var joinRoom = room => this.joinRoom(room);
		var list = [
			{
				text: "Create a game",
				color: "#55f",
				use: createRoom
			}
		];
		for(let room of this.rooms) {
			let {name} = room;
			list.push({
				text: name,
				color: room.full? "#f55": "#5f5",
				use() {
					joinRoom(room);
				}
			});
		}
		this.list = list;
	}
	drawRoomList =  mainMenu.draw;
	updateGrid() {
		var array = {};
		for(let i in grid.array) {
			array[i] = grid.array[i].color;
		}
		this.sendData({grid: array});
	}
	createRoom() {
		this.sendData({createRoom: `${this.name}'s game`});
	}
	joinRoom(room) {
		this.sendData({joinRoom: room.name});
	}
	sendData(data) {
		this.ws.send(JSON.stringify(data));
	}
	/**@type {Grid}*/
	enemyGrid
	/**@type {number[]}*/
	colors = 0;
	connected = false;
	/**@type {Promise<void>}*/
	reconnect = 0;
	/**@type {WebSocket}*/
	ws;
	/**@type {Grid}*/
	enemyGrid;
}
/**@type {Multiplayer}*/
var multiplayer;