function Sound(name) {
    var sound = new Audio(`songs/${name}.mp3`);
    var soundH = new Audio(`songs/${name}-H.mp3`);

    sound.loop = true;
    soundH.loop = true;

    var sounds = [sound, soundH];

    var pH = false;

    return {
        play() {
            if(!this.playing) {
                console.log("play");
                if(pH) soundH.play();
                else sound.play();
            }
        },
        async switch(H) {
            if(H == pH) return;
            console.log("switch");
            var a = sounds[1 - H];
            var b = sounds[+H];

            a.pause();
            b.currentTime = a.currentTime * b.duration / a.duration;
            await b.play();
            pH = H;
        },
        stop() {
            if(this.playing) {
                console.log("stop");
                sound.pause();
                soundH.pause();
            }
        },
        get playing() {
            return !sound.paused || !soundH.paused;
        },
        get H() {
            return pH;
        },
        set H(H) {
            this.switch(H);
        }
    }
}
var songs = new Map;
songs.add = song => songs.set(song, Sound(song));
songs.play = song => songs.get(song).play();
songs.stop = song => songs.get(song).stop();

songs.add("Level1");
songs.add("Level2");