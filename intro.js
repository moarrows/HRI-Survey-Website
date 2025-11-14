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
`;

export function intro() {
    document.getElementById("main").innerHTML = intro_para;
}
