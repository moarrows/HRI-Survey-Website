globalThis.addEventListener('keydown',
    function (e) {
        this.document.querySelector('p').innerHTML = `You pressed ${e.key}`;
    }, false);