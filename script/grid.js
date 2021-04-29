var Grid = {
    async add(blob) {
        var {height, array} = this;
        var {x, y} = blob;
        y = this.lowest(x);
        blob.y = y;
        blob.active = false;
        array[y * height + x] = blob;

        blob.settle();
        
        blob = new Blob(randomFrom(Color.all));
		if(blob.y >= Grid.lowest(blob.x)) blobs.pop();
    },
    lowest(x) {
        for(var y = Grid.height - 1; y >= 0; --y) {
            if(!this.get(x, y)) return y;
        }
        return y;
    },
    clean() {
        var {array} = this;
        for(let blob of array) {
            if(!blob || !blob.inactive) continue;
            delete array[array.indexOf(blob)];
        }
    },
    async fall() {
        this.clean();
        var {width, height} = this;
        let fall, moved, attach;
        do{
            attach = false;
            moved = new Set;
            for(let blob of blobs) blob.draw();
            blobs = blobs.filter(blob => !blob.inactive);
            do{
                fall = false;
                for(let x = 0; x < width; x++) {
                    for(let y = height - 2; y >= 0; --y) {
                        let blob = this.get(x, y);
                        if(blob && !this.get(x, y + 1)) {
                            fall = true;
                            ++blob.y;
                            blob.unattach();
                            moved.add(blob);
                            this.delete(x, y);
                            this.set(x, y + 1, blob);
                        }
                    }
                }
            }while(fall);
            for(let blob of moved) {
                blob.settle();
                attach = true;
            }
            if(moved.size) await delay(200);
        }while(attach);
    },
    /**@returns {Blob}*/
    get(x, y) {
        var {height, array} = this;
        return array[y * height + x];
    },
    set(x, y, blob) {
        var {height, array} = this;
        array[y * height + x] = blob;
    },
    delete(x, y) {
        var {height, array} = this;
        delete array[y * height + x];
    },
    width: 6,
    height: 10,
    array: []
}