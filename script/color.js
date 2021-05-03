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
		do{
			var cau = false;
			for(let c = 0, b = min(a, list.length); c <= b; c++) {
				let b = (list[c] == -2 && 1) || (list[c] != -1 && set.indexOf(list[c]) == -1 && 2);
				if(b) {
					cau = true;
					if(b - 1) {
						list[c] = [];
					}else{
						list[c] = new Array(diff? diff * 2 + 1: 0).fill(-1);
					}
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
Color.code[-1] = "#555";