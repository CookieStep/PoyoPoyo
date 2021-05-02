async function update() {
	while(true) {
		if(main.run) {
			if(!main.running) main();
			resPromises();
		}

		await frame();
	}

	function resPromises(bool=true) {
		for(let res of promises) {
			res(bool);
		}
	}
}
const EXIT = Symbol();
var promises = new Set;
var gameUpdate = () => {
	var callback = resolve => {
		promises.add(resolve);
	};

	return new Promise(callback);
}