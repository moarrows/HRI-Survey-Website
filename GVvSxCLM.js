import * as common from "./common.js"
Object.assign(globalThis, common);

test();

let player = videojs("video1");

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
    document.getElementById("video1").style.display = 'none';
    document.getElementById("video2").style.display = 'none';
    document.getElementById("video3").style.display = 'none';
    document.getElementById("cvideo1").style.display = 'none';
    document.getElementById("cvideo2").style.display = 'none';
    document.getElementById("cvideo3").style.display = 'none';
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

async function waitforSpace() {
  return new Promise((resolve) => {
    document.addEventListener('keydown', onKeyHandler);
    function onKeyHandler(e) {
      if (e.keyCode === 32) {
        document.removeEventListener('keydown', onKeyHandler);
        spaces.push(player.currentTime());
        resolve();
      }
    }
  });
}

async function test() {
    await intro();

    document.getElementById("main").innerHTML = intro_buffer;

    // Begin Interaction One
    await waitforSpace();
    document.getElementById("video1").style.display = 'inline-block';
    document.getElementById("cvideo1").style.display = 'block';
    document.querySelector('p').style.visibility = "hidden";
    player.play();
    player.muted(true);
    player.currentTime(25);
    say("you", "Hello, my name is Liam.");

    await naoTalk("Hello, my name is Beacon, here to conduct your initial assesment. First, could you please state your full name?", 28);

    await humanTalk("Liam.", 37, 46);

    await naoTalk("Nice to meet you, Liam. Now, could you please briefly tell me what brings you here today?", 48);

    await humanTalk("I have a scrape on my leg.", 57, 63);

    await naoTalk("Understood, Liam. Is there severe bleeding, any impurities in the wound, or intense pain associated with the scrape?", 65);

    await humanTalk("Moderate bleeding and pain.", 77, 83);

    await naoTalk("I see, Liam. Try to keep calm. A doctor will apply a dressing to your wound shortly to stop the bleeding and alleviate some of the pain.", 85);

    await waitForTime(96);
    finishInteraction();
    player = videojs("video2");

    // Begin interaction Two
    await startInteractionTwo();
    document.getElementById("video2").style.display = 'inline-block';
    document.getElementById("cvideo2").style.display = 'block';
    document.getElementById("main").innerHTML = intro_buffer;
    document.querySelector('p').style.visibility = "visible";


    await waitforSpace();
    document.querySelector('p').style.visibility = "hidden"
    player.play();
    player.muted(true);
    player.currentTime(10);
    say("you", "Hello, my name is Liam.");

    await naoTalk("Hello Liam. What seems to be the problem today?", 14);

    await humanTalk("I have a bad cut on my arm.", 19, 27);

    await naoTalk("I see, Liam. Reserve your movements and try not to touch the cut. A doctor will be with you shortly.", 30);

    await waitForTime(37.5);
    finishInteraction();
    player = videojs("video3");

    // Begin interaction Three
    await startInteractionThree();
    document.getElementById("video3").style.display = 'inline-block';
    document.getElementById("cvideo3").style.display = 'block';
    document.querySelector('p').style.visibility = "visible";
    document.getElementById("main").innerHTML = intro_buffer;

    await waitforSpace();
    document.querySelector('p').style.visibility = "hidden"
    player.play();
    player.muted(true);
    player.currentTime(12);
    say("you", "Hello, my name is Liam.");

    await naoTalk("Hello Liam. What brings you to the triage center today?", 14);

    await humanTalk("I have a slight cough.", 18, 28);

    await naoTalk("I understand. Have you experienced any fever, difficulty breathing, or recent loss of taste or smell?", 31);

    await humanTalk("No, just the cough.", 40, 52);

    await naoTalk("Alright, a doctor should see you shortly for a follow up. Please maintain social distances and use a mask.", 55);

    await waitForTime(64);
    finishInteraction();

    await copyPara();

    await sayGoodbye();
    close();

}
