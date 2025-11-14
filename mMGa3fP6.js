import { intro } from "./common.js";
import { waitforSpace } from "./common.js";

test();

let player = videojs("my-video");
let breath_source = {src: "videos/breathing.mp4", type: "video/mp4"};
let talk_source = {src: "videos/talking.mp4", type: "video/mp4"};

let intro_buffer = `<p>Press space to start the interaction.</p>`;

async function test() {
    await intro();

    document.getElementById("main").innerHTML = intro_buffer;
    player.src({ type: 'video/mp4', src: "videos/talking.mp4" });
    await waitforSpace();

    document.querySelector('p').style.visibility = "hidden";
    player.play();
}


