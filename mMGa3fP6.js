import * as common from "./common.js"
Object.assign(globalThis, common);

test();

let player = videojs("my-video");

let intro_buffer = `<p>Press space to start the interaction.</p>`;

export function say(who, text) {
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

function muteAt(time) {
  return new Promise((resolve) => {
    const loop = () => {
      if (player.currentTime() >= time) {
        player.muted(true);
        return resolve();
      }
      setTimeout(loop, 0);
    };

    setTimeout(loop, 0);
  });
}

function waitForSpaceOrPause(time) {
  return new Promise((resolve) => {
    let spacePressed = false;

    document.addEventListener('keydown', onSpace);
    async function onSpace(e) {
        if (e.keyCode === 32) {
            spacePressed = true;
            spaces.push(player.currentTime());
            resolve();
            document.removeEventListener('keydown', onSpace);
            player.play();
        }
    }

    const loop = () => {
        if(spacePressed) {
            resolve();
            player.play();
        } else if (player.currentTime() >= time) {
            player.pause();
        } else {
            setTimeout(loop, 0);
        }
    };

    setTimeout(loop, 0);
  });
}

async function humanTalk(message, startTime, endTime) {
    muteAt(startTime);
    await waitForSpaceOrPause(endTime);
    say("you", message);
    player.currentTime(endTime);
}

async function naoTalk(message, startTime) {
    await sleep(3000);
    player.muted(false);
    await waitForTime(startTime);
    say("nao", message);
}

function finishInteraction() {
    player.muted(true);
    document.getElementById("my-video").style.visibility = "hidden";
    document.getElementById("you").style.display = 'none';
    document.getElementById("nao").style.display = 'none';
}

let spaces = [];

// async function logSpace() {
//   return new Promise((resolve) => {
//     document.addEventListener('keydown', onKeyHandler);
//     function onKeyHandler(e) {
//         if (e.keyCode === 32) {
//             spaces.push(player.currentTime());
//         }
//     }
//   });
// }

const copy_para = `
    <p>
        Please click this button to copy results to clipboard.
    </p>
    <button id="copy" class="btn copy">Copy</button>
`;

async function copyPara() {
    document.getElementById("main").innerHTML = copy_para;
    await copyToClipboard();
}

async function copyToClipboard() {
    return new Promise((resolve) => {
    const button = document.getElementById("copy");
    button.addEventListener('click', start);
    async function start(e) {
        button.removeEventListener('click', start);
        resolve();
        try {
            await navigator.clipboard.writeText(spaces.toString());
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
  });
}

async function test() {
    await intro();

    document.getElementById("main").innerHTML = intro_buffer;

    player.src({ type: 'video/mp4', src: "videos/Light-Green.mp4" });

    // Begin Interaction One
    await waitforSpace();
    document.querySelector('p').style.visibility = "hidden";
    player.play();
    player.muted(true);
    player.currentTime(7);
    say("you", "Hi, my name is Liam.");

    await naoTalk("Hello, Liam. What seems to bring you in today?", 9.5);

    await humanTalk("I have a slight cough.", 13.5, 24);

    await naoTalk("I see. Any other symptoms, Liam, like fever, difficult breathing, or fatigue?", 27);

    await humanTalk("No, just the cough.", 33.5, 58);

    await naoTalk("Understood. Please rest and hydrate, a doctor will be with you soon to further assess your condition.", 61);

    await waitForTime(67.5);
    finishInteraction();
    player.src({ type: 'video/mp4', src: "videos/Medium-None.mp4" });

    // Begin interaction Two
    await startInteractionTwo();
    document.getElementById("main").innerHTML = intro_buffer;
    document.querySelector('p').style.visibility = "visible";
    document.getElementById("my-video").style.visibility = "visible";
    await waitforSpace();
    document.querySelector('p').style.visibility = "hidden"
    player.play();
    player.muted(true);
    player.currentTime(10);
    say("you", "Hello, my name is Liam.");

    await naoTalk("Nice to meet you, Liam. Can you briefly describe your symptoms or tell me what happened?", 13);

    await humanTalk("I have a scrape on my leg.", 18.7, 42);

    await naoTalk("I see. And how did this happen Liam? Also, does the scrape seem deep?", 45);

    await humanTalk("I fell out of a tree, and no the scrape is not deep but it is bleeding pretty bad.", 53.5, 61);

    await naoTalk("Okay Liam, we need to stop the bleeding. A medical professional should asses the injury soon. Stay calm.", 64);

    await waitForTime(73.9);
    finishInteraction();
    player.src({ type: 'video/mp4', src: "videos/High-Yg.mp4" });

    // Begin interaction Three
    await startInteractionThree();
    document.getElementById("main").innerHTML = intro_buffer;
    document.querySelector('p').style.visibility = "visible";
    document.getElementById("my-video").style.visibility = "visible";
    await waitforSpace();
    document.querySelector('p').style.visibility = "hidden"
    player.play();
    player.muted(true);
    player.currentTime(15);
    say("you", "Hello, my name is Liam.");

    await naoTalk("Hello Liam, can you please briefly describe your symptoms or what brings you in today?", 17);

    await humanTalk("Yes I have a serious cut on my arm.", 23.5, 31);

    await naoTalk("I understand your situation. I am contacting a doctor immediately. Please stay calm and try to keep the wound clean.", 34);

    await waitForTime(43.5);
    finishInteraction();

    await copyPara();

    await sayGoodbye();
    close();

}


