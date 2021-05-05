const Color = {
	/**@readonly*/
	code: {
		0: "#faa",
		1: "#aaf",
		2: "#afa",
		3: "#daf",
		4: "#ff5"
	},
	/**@readonly*/
	red: 0,
	/**@readonly*/
	blue: 1,
	/**@readonly*/
	green: 2,
	/**@readonly*/
	purple: 3,
	/**@readonly*/
	yellow: 4,
	/**@readonly*/
	barrier: -1,
	/**@readonly*/
	barrier2: -6,
	/**@readonly*/
	barrier3: -7,
	/**@readonly*/
	barrierSpawn: -2,
	/**@readonly*/
	rainbow: -3,
	/**@readonly*/
	zombie: -4,
	/**@readonly*/
	zombieSpawn: -5,
	/**@readonly*/
	easy: [0, 1, 2, 3],
	/**@readonly*/
	normal: [0, 1, 2, 3, 4],
	/**@readonly*/
	hard: [0, 1, 2, 3, 4],
	next() {
		var {list} = this;
		const {barrierSpawn, barrier, rainbow, zombie, zombieSpawn} = this
		var set;
		if(diff < 2) set = this.easy;
		else if(diff < 3) set = this.normal;
		else set = this.hard;
		var a = 6;

		if(list.length <= a) {
			if(multiplayer?.active) {
				list.push(...multiplayer.colors);
			}else{
				var extra = [];

				for(let i = 0, m = 5, l = 16 * m; i < l; i++) {
					extra.push(i % m);
				}
				for(let i = 0; i < 4; i++) {
					extra.push(barrierSpawn);
					extra.push(zombieSpawn);
				}
				for(let i = 0; i < 4; i++) {
					extra.push(rainbow);
				}

				extra = shuffle(extra);

				list.push(...extra.flat());
			}
		}
		do{
			var cau = false;
			for(let c = 0, b = min(a, list.length - 1); c <= b; c++) {
				var color = list[c];
				if(set.indexOf(color) == -1) switch(color) {
					case barrier:
					case zombie:
						break;
					case barrierSpawn:
						list[c] = new Array(diff? diff * 2 + 1: 0).fill(barrier);
						cau = true;
					break;
					case barrier:
						break;
					case zombieSpawn:
						list[c] = new Array(diff >= 3? (diff - 2): 0).fill(zombie);
						cau = true;
					break;
					case rainbow:
						if(diff >= 2) break;
					default: 
						list[c] = [];
						cau = true;
					break;
				}
			}
			list = list.flat();
		}while(cau);
		this.list = list;

		return list.shift();
	},
	list: []
}
{
	let color = ctx.createLinearGradient(0, 0, 1, 0);
	for(let i = 0; i < 360; i++) {
		color.addColorStop(i/360, `hsl(${i}, 100%, 50%)`);
	}
	Color.code[Color.rainbow] = color;
}
{
	// let color = ctx.createLinearGradient(0, 0, 1, 0);
	// for(let i = 0; i < 360; i++) {
	// 	color.addColorStop(i/360, `hsl(${i}, 100%, 50%)`);
	// }
	Color.code[Color.zombie] = "#5a5";
}
Color.code[Color.barrier] = "#555";
Color.code[Color.barrier2] = "#733";
Color.code[Color.barrier3] = "#a00";