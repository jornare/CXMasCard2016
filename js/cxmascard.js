window.cx = window.cx || {};
(function (document, window, ns) {
    var card,
        scene,
        pixelRatio = (window.innerWidth > 1024 ? 0.5 : 1);
        ns.iOS = /iPad|iPhone|iPod/.test(navigator.platform);




    function startTouch(x, y) {
        x = x  * pixelRatio;
        y = y  * pixelRatio;
        ns.editMode && scene.addPoint(x,y);
        scene.stuckFlakes = [];
        scene.touch = { x: x, y: y, time: scene.lastFrameTime };
    }
    function touchMove(x, y) {
        x = x  * pixelRatio;
        y = y  * pixelRatio;
        scene.touch = { x: x, y: y, time: scene.lastFrameTime, dx: x - scene.touch.x, dy: y - scene.touch.y };
        scene.onMouseMove(x, y, 0);
    }

    function endTouch() {
        //card.flip(false);
        scene.touch = false;
    }


    function hideAddressBar() {
        document.body.style.paddingTop = '1px';
        setTimeout(function () { window.scrollTo(0, 1); }, 50);
    }

    function showPlay() {
        var icoPlay = document.getElementsByClassName('icoPlay')[0];
        icoPlay.style.opacity = 0.8;
    }
//set up events

    window.addEventListener('resize', function () {
        pixelRatio = (window.innerWidth > 1024 ? 0.5 : 1);
        card.resize(window.innerWidth, window.innerHeight, pixelRatio);
    });

    document.addEventListener('DOMContentLoaded', function () {
        window.card = card  = new ns.Card(window.innerWidth, window.innerHeight, pixelRatio);
        scene = card.scene;
        //card.resize(window.innerWidth, window.innerHeight, pixelRatio);
        hideAddressBar();
        setTimeout(showPlay, 10000);
        /*if(!ns.editMode) {
            setTimeout(function () {
                card.dontFlip = false;
                card.flip(false, true);
            }, 15000);
        }*/
    });
    
    document.addEventListener('touchstart', function (event) {
        event.preventDefault();
        startTouch(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
    }, false);

    document.addEventListener('mousedown', function (event) {
        startTouch(event.clientX, event.clientY);
    }, false);

    document.addEventListener('touchmove', function (event) {
        event.preventDefault();
        var touch = event.touches[0];
        touchMove(touch.pageX, touch.pageY);
    }, false);

    document.addEventListener('touchend', endTouch, false);

    document.addEventListener('mousemove', function (event) {
        scene.onMouseMove && scene.onMouseMove(event.clientX * pixelRatio, event.clientY * pixelRatio, event.buttons);
        if (!scene.touch) {
            return;
        }
        touchMove(event.clientX, event.clientY);
    }, false);

    document.addEventListener('mouseup', endTouch, false);


}(document, window, window.cx));