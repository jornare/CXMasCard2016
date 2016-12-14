window.cx = window.cx || {};
(function (ns, document, window) {
    var location = window.location,
        pixelRatio = 0.2,
        dom = {
            to: $('to'),
            to_en: $('to_en'),
            card:$('card')
        }

    function $(q) {
        return document.getElementById(q);
    }
    function getReceipientFromUrl() {
        var l = location ? location : (window.location ? window.location : document.location);
        var receipient = l.hash ? l.hash.substr(1):(l.search?l.search.substr(1):'');
        return decodeURIComponent(receipient);
    }

    ns.Card = function (w, h, pixelRatio) {
        dom.card = $('card');
        dom.to = $('to');
        dom.to_en = $('to_en');
        var canvas = $('scenecanvas');
        canvas.width = Math.floor(w * pixelRatio);
        canvas.height = Math.floor(h * pixelRatio);
        //this.dontFlip = true;
        this.lang = 'en';
        this.scene = new ns.FrontScene(canvas);
        this.setLang();
        this.setReceipient();
    };
 
    ns.Card.prototype.setReceipient = function (receipient) {
        dom.to.innerText = dom.to.textContent = dom.to_en.innerText = dom.to_en.textContent = receipient || getReceipientFromUrl() || (this.lang=='no'?'Deg':'You');
    }

    ns.Card.prototype.setLang = function (language) {
        //this.dontFlip = true;
        //setTimeout(function () { this.dontFlip = false }, 100);
        if (!language) {
            if (location.href.toLowerCase().indexOf('card.html') >= 0) {
                language = 'en';
            } else if (location.href.toLowerCase().indexOf('kort.html') >= 0) {
                language = 'no';
            } else if (navigator.userLanguage) // Explorer
                language = navigator.userLanguage;
            else if (navigator.language) // FF
                language = navigator.language;
            else
                language = "en";
        }
        if (language.indexOf('nb') >=0 || language.indexOf('no') >= 0) {
            language = 'no';
        }
        this.lang = language;
        if (language == 'no') {
            $('english').style.display = 'none';
            $('norwegian').style.display = 'inline-block';
        } else {
            $('english').style.display = 'inline-block';
            $('norwegian').style.display = 'none';
        }
    };

    ns.Card.prototype.resize = function (w, h, pixelRatio) {
        dom.card.style.height = h + 'px';
        dom.card.style.width = w + 'px';
        this.scene.onResize(w * pixelRatio, h * pixelRatio);
    }

    ns.Card.prototype.flip = function (toFront, force) {
        var cssClass = "card", scene = this.scene;
        if (toFront) {//we are on the flipside
            if (this.dontFlip) {
                return;
            }
            scene.start();
        } else {
            if (force || scene.touch) {
                if (force || (scene.touch.x < scene.width / 10 && scene.touch.y < scene.height / 10)) {
                    cssClass = "card flip";
                } else {
                    return;
                }
            }
        }

        dom.card.setAttribute("class", cssClass); //For Most Browsers
        dom.card.setAttribute("className", cssClass); //For IE; harmless to other browsers.
    }



}(window.cx, document, window));