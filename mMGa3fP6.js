import { intro, sleep, waitforSpace, startInteractionOne } from "./common.js";

test();

let player = videojs("my-video");
let breath_source = {src: "videos/breathing.mp4", type: "video/mp4"};
let talk_source = {src: "videos/talking.mp4", type: "video/mp4"};

let intro_buffer = `<p>Press space to start the interaction.</p>`;

function say(who, text) {
    if(who === "nao") {
        document.getElementById("you").style.display = 'none';
        document.getElementById("nao").style.display = "block";
        document.getElementById("nao").innerHTML = "Nao: " + text;
    } else {
        document.getElementById("nao").style.display = 'none';
        document.getElementById("you").style.display = "block";
        document.getElementById("you").innerHTML = "You: " + text;
    }
}


function waitForTime(time, timeout = 20000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, timeout);

    const loop = () => {
      if (player.currentTime() >= time) {
        return resolve();
      }
      setTimeout(loop, 0);
    };

    setTimeout(loop, 0);
  });
}

function waitForSpaceOrPause(time) {
  return new Promise((resolve) => {
    document.addEventListener('keydown', onSpace);
    async function onSpace(e) {
        if (e.keyCode === 32) {
            resolve();
            setTimeout(player.play(), 1);
        }
    }

    const loop = () => {
      if (player.currentTime() >= time) {
        player.pause();
      } else {
        setTimeout(loop, 0);
      }
    };

    setTimeout(loop, 0);
  });
}


async function test() {
    await intro();

    const t0 = performance.now();
    document.getElementById("main").innerHTML = intro_buffer;
    player.src({ type: 'video/mp4', src: "videos/light-green.mp4" });
    // await startInteractionOne();

    await waitforSpace();
    document.querySelector('p').style.visibility = "hidden";
    player.play();
    player.muted(true);
    say("you", "Hi, my name is Liam.");
    player.currentTime(7);

    await waitForTime(10);
    player.muted(false);
    say("nao", "Hello, Liam. What seems to bring you in today?");

    await waitForSpaceOrPause(16);
    player.muted(true);
    say("you", "I have a slight cough.");
    await waitForTime(20);
    player.currentTime(24);

    await waitForTime(26);
    player.muted(false);
    say("nao", "I see. Any other symptoms, Liam, like fever, difficulty breathing, or fatigue?");

    await waitForSpaceOrPause(33.5);
    player.muted(true);
    say("you", "No, just the cough.");
    await waitForTime(40);

    player.muted(false);
    player.currentTime(56);
    await waitforSpace();


}


