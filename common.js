export function hi() {
    console.log("hi");
}

const intro_para = `
    <p>
        On the next page you will see a series of videos simulating conversations between you and a robot.<br>
        Instead of talking to the robot, simply press spacebar whenever you would naturally respond to the robot.<br>
        Please do not hold the spacebar, or spam it. Only press it once when you think it is your turn to speak.<br>
        When you are ready, click Begin.
    </p>
    <button id="begin" class="btn begin">Begin</button>
`;

const blank = ``;

function waitForClick() {
    return new Promise((resolve) => {
    const button = document.getElementById("begin");
    button.addEventListener('click', start);
    function start(e) {
        button.removeEventListener('click', start);
        resolve();
        document.getElementById("main").innerHTML = blank;
    }
  });
}

export async function waitforSpace() {
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

export async function intro() {
    document.getElementById("main").innerHTML = intro_para;
    await waitForClick();
}

