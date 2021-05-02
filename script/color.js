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
	next() {
		var {list} = this
		var set = diff < 2? this.easy: this.normal;
		var a = 6;

		if(list.length <= a) {
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
		for(let i = 0; i <= a ** 2; i++) {
			if(list[i] == -2) {
				var amo = diff? diff * 2 + 1: 0;
				list[i] = new Array(amo).fill(-1);
			}else if(list[i] != -1 && set.indexOf(list[i]) == -1) {
				list[i] = [];
			}
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