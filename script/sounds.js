function Sound(name) {
    var sound = new Audio(`songs/${name}.mp3`);
    var soundH = new Audio(`songs/${name}-H.mp3`);

    sound.loop = true;
    soundH.loop = true;

    var sounds = [sound, soundH];

    var pH = false;

    return {
        async play() {
            if(!this.playing && songs.canPlay) {
                if(pH) await soundH.play();
                else await sound.play();
            }// else if(this.playing) {
            //     if(soundH.paused) {
            //         if(sound.duration - sound.currentTime < 0.1) {
            //             console.log(sound.currentTime, sound.duration);
            //             sound.currentTime = 0;
            //         }
            //     }else{
            //         if(soundH.duration - soundH.currentTime < 0.1) {
            //             console.log(soundH.currentTime, soundH.duration);
            //             soundH.currentTime = 0;
            //         }
            //     }
            // }
        },
        volume(n) {
            try{
                sound.volume += n;
                soundH.volume += n;
            }catch(_) {}
        },
        async switch(H) {
            if(H == pH) return;
            var a = sounds[1 - H];
            var b = sounds[+H];

            try{
                a.pause();
                b.currentTime = a.currentTime * b.duration / a.duration;
                await b.play();
                pH = H;
            }catch(_) {}
        },
        stop() {
            if(this.playing) {
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
