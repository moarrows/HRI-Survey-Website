import { intro, sleep, waitforSpace, startInteractionOne, startInteractionTwo, startInteractionThree, sayGoodbye } from "./common.js";

test();

let player = videojs("my-video");
let breath_source = {src: "videos/breathing.mp4", type: "video/mp4"};
let talk_source = {src: "videos/talking.mp4", type: "video/mp4"};

let intro_buffer = `<p>Press space to start the interaction.</p>`;

async function logSpace() {
  return new Promise((resolve) => {
    document.addEventListener('keydown', onKeyHandler);
    function onKeyHandler(e) {
        if (e.keyCode === 32) {
            console.log(player.currentTime())
        } else if (e.keyCode === 72) {
            console.log("human " + player.currentTime())
        } else if (e.keyCode === 78) {
            console.log("nao " + player.currentTime())
        }
    }
  });
}

async function test() {
    await intro();
    logSpace();

    player.src({ type: 'video/mp4', src: "videos/Light-None.mp4" });
    player.play();
}


