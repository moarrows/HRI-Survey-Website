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
    player.currentTime(9);
    say("you", "Hello, my name is Liam.");

    await naoTalk("Welcome, Liam. Could you please describe your symptoms to me?", 11);

    await humanTalk("Yes, I have a bad cut on my arm", 18, 29);

    await naoTalk("Understand, Liam, I see this is an urgent matter. Please apply direct pressure to the wound, a doctor will be with you shortly.", 32);

    await waitForTime(40);
    finishInteraction();
    player = videojs("video2");

    // Begin interaction Two
    await startInteractionTwo();
    document.getElementById("main").innerHTML = intro_buffer;
    document.querySelector('p').style.visibility = "visible";
    document.getElementById("video2").style.display = 'inline-block';
    document.getElementById("cvideo2").style.display = 'block';
    await waitforSpace();
    document.querySelector('p').style.visibility = "hidden"
    player.play();
    player.muted(true);
    player.currentTime(10);
    say("you", "I have a slight cough.");

    await naoTalk("Understood. Aside from the cough, are you experiencing any other symptoms such as fever or difficulty breathing?", 12);

    await humanTalk("No, it's just the cough.", 23, 28);

    await naoTalk("Acknowledged. I would recommend rest and hydration. If the cough persists, please seek medical attention.", 31);

    await humanTalk("Okay thank you.", 41, 47);

    await naoTalk("You're welcome! Do not hesitate to call for help should you need it.", 50);

    await waitForTime(57);
    finishInteraction();
    player = videojs("video3");

    // Begin interaction Three
    await startInteractionThree();
    document.getElementById("main").innerHTML = intro_buffer;
    document.querySelector('p').style.visibility = "visible";
    document.getElementById("video3").style.display = 'inline-block';
    document.getElementById("cvideo3").style.display = 'block';
    await waitforSpace();
    document.querySelector('p').style.visibility = "hidden"
    player.play();
    player.muted(true);
    player.currentTime(11);
    say("you", "Hello, my name is Liam.");

    await naoTalk("Nice to meet you, Liam. Could please tell me what seems to be the problem today?", 14);

    await humanTalk("I have a scrape on my leg.", 21, 29);

    await naoTalk("I understand, Liam. Could you tell me more about the scrape? Any excessive bleeding or pain?", 32);

    await humanTalk("Yes, it's on my calf and bleeding pretty bad.", 39, 49);

    await naoTalk("I see, Liam. Given the severity of your bleeding, a doctor will be with you very shortly. Try to remain calm and apply pressure to the wound if possible.", 52);

    await waitForTime(61.5);
    finishInteraction();

    await copyPara();

    await sayGoodbye();
    close();

}


