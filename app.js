test();

let player = videojs("my-video");
let breath_source = {src: "videos/breathing.mp4", type: "video/mp4"};
let talk_source = {src: "videos/talking.mp4", type: "video/mp4"};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

async function waitforSpace() {
  return new Promise((resolve) => {
    document.addEventListener('keydown', onKeyHandler);
    function onKeyHandler(e) {
      if (e.keyCode === 32) {
        document.removeEventListener('keydown', onKeyHandler);
        resolve();


      }
    }
  });
}

async function startSpeech() {
  return new Promise((resolve) => {
    document.addEventListener('keydown', onKeyHandler);
    async function onKeyHandler(e) {
      if (e.keyCode === 32) {
        document.querySelector('p').style.visibility = "visible";
        document.querySelector('p').innerHTML = `Pressed space`;
        await sleep(1000);
        document.querySelector('p').style.visibility = "hidden";
      }
    }
  });
}

async function test() {
    // Press space to start video
    await waitforSpace();
    const t0 = performance.now();
    document.querySelector('p').style.visibility = "hidden";
    player.play();
    document.getElementById("you").style.color = 'white';
    document.getElementById("nao").style.color = 'aqua';
    document.getElementById("you").innerHTML = "You: I have a slight cough.";

    await sleep(100);
    startSpeech();

    await sleep(3000);
    document.getElementById("you").style.display = 'none';
    document.getElementById("nao").innerHTML = "Nao: I'm sorry to hear that. Have a cough drop.";
    player.src({ type: 'video/mp4', src: "videos/talking.mp4" });
    player.play();

    await waitforSpace();
    document.getElementById("nao").style.display = 'none';
    document.getElementById("you").style.display = "block";
    document.getElementById("you").innerHTML = "You: Thanks!";
    player.src({ type: 'video/mp4', src: "videos/breathing.mp4" });
    player.play();

    await sleep(2000);
    document.getElementById("you").style.display = 'none';
    document.getElementById("nao").style.display = "block";
    document.getElementById("nao").innerHTML = "Nao: No problem. Do you need anything else?";
    player.src({ type: 'video/mp4', src: "videos/talking.mp4" });
    player.play();

    await waitforSpace();
    document.getElementById("nao").style.display = 'none';
    document.getElementById("you").style.display = "block";
    document.getElementById("you").innerHTML = "You: I'm good thanks.";
    player.src({ type: 'video/mp4', src: "videos/breathing.mp4" });
    player.play();


    // const t1 = performance.now();
    // document.querySelector('p').style.visibility = "visible";
    // document.querySelector('p').innerHTML = `Time elapsed: ${t1-t0}`;
}


