(function() {
    var controls;
    var canvas;
    var engine;

    // The 'main' routine which is executed when the document has loaded.
    window.onload = function() {
        controls = document.getElementById('controls');
        canvas = document.getElementById('main');

        var controlPoints = document.getElementById('npoints');
        var startButton = document.getElementById('start');
        var stopButton = document.getElementById('stop');
        var grav = document.getElementById('grav');
        var mass = document.getElementById('mass');

        engine = new RcEngine(canvas, 1e-4, startButton, stopButton, mass, 
            grav, controlPoints);

        resize();
        window.onresize = resize;
        window.requestAnimationFrame(draw);
    };
    
    function resize() {
        canvas.width = window.innerWidth - controls.offsetWidth;
        canvas.height = controls.offsetHeight;
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
        engine.resetCurve();
    }

    function draw(timestamp) {
        window.requestAnimationFrame(draw);
        engine.draw(timestamp);
    }

    // Support old browsers.
    window.requestAnimationFrame = window.requestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame;
}());

