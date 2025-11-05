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
    function onKeyHandler(e) {
      if (e.keyCode === 32) {
        document.removeEventListener('keydown', onKeyHandler);
        resolve();
        document.querySelector('p').style.visibility = "visible";
        document.querySelector('p').innerHTML = `Pressed space`;
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
    document.getElementById("speech").style.color = 'white';
    document.getElementById("speech").innerHTML = "You: I have a slight cough.";

    await sleep(100);
    // Press space again when Finished
    startSpeech();

    await sleep(3000);
    document.getElementById("speech").style.color = 'blue';
    document.getElementById("speech").innerHTML = "Nao: I'm sorry to hear that. Have a cough drop.";
    player.src({ type: 'video/mp4', src: "videos/talking.mp4" });
    player.play();

    await waitforSpace();
    document.getElementById("speech").style.color = 'white';
    document.getElementById("speech").innerHTML = "You: Thanks!";
    await sleep(1000);
    player.src({ type: 'video/mp4', src: "videos/breathing.mp4" });
    player.play();
    
    // const t1 = performance.now();
    // document.querySelector('p').style.visibility = "visible";
    // document.querySelector('p').innerHTML = `Time elapsed: ${t1-t0}`;
}


