const Color = {
	/**@readonly*/
	code: [
		"#faa",
		"#aaf",
		"#afa",
		"#daf",
		"#ff5"
	],
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
	easy: [0, 1, 2, 3],
	/**@readonly*/
	normal: [0, 1, 2, 3, 4],
	/**@readonly*/
	all: "RBGPY",
	next() {
		var {list} = this
		var set = diff < 2? this.easy: this.normal;;

		if(list.length <= 6) {
			var extra = [];

			for(let i = 0, m = 5, l = 16 * m; i < l; i++) {
				extra.push(i % m);
			}
			for(let i = 0; i < 4; i++) {
				extra.push(-2);
			}

			extra = shuffle(extra);

			list.push(...extra.flat());
		}
		for(let i = 0; i < 8; i++) {
			if(list[i] == -2) {
				list[i] = new Array(diff? diff * 2 + 1: 0).fill(-1);
			}else if(list[i] != -1 && set.indexOf(list[i]) == -1) list[i] = [];
		}
		list = list.flat();
		this.list = list;

		return list.shift();
	},
	weights: [],
	uses: [],
	list: []
}
Color.code[-1] = "#555";