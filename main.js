(function() {
    var controls;
    var header;
    var canvas;
    var ctx;
    var editor;
    var cpSelect;
    
    // The 'main' routine which is executed when the document has loaded.
    window.onload = function() {
        controls = document.getElementById('controls');
        canvas = document.getElementById('main');
        header = document.getElementById('header');
        ctx = canvas.getContext('2d');
        editor = new BezEditor(canvas);
        cpSelect = document.getElementById('npoints');
        cpSelect.onchange = resetEditor;

        resize();
        window.onresize = resize;
    
        window.requestAnimationFrame(draw);
    };
    
    function resize() {
        canvas.width = header.offsetWidth - controls.offsetWidth;
        canvas.height = controls.offsetHeight;
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
        resetEditor();
    }

    function resetEditor() {
        var order = parseInt(cpSelect.value, 10) - 1;
        var pad = 50.0;
        editor.createLinear(new Vector2(pad, canvas.height / 2),
            new Vector2(canvas.width - pad, canvas.height / 2), order);
    }

    function draw() {
        window.requestAnimationFrame(draw);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        editor.draw(true);
    }
    
    // Support old browsers.
    window.requestAnimationFrame = window.requestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame;
}());

