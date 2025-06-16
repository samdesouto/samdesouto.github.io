//========================================
//              LOADER
//========================================
function loaderImgLoad(loaderImg){
    loaderImg.style.opacity = "50%";
}

function loaderCreate(){
    // create loader
    var _loader = document.createElement("div");
    _loader.classList.add("sc-load");
    _loader.innerHTML = '<img src="' + loadingImage + '">';

    // loader image listener
    _loader.querySelector("img").onload = function() {
        loaderImgLoad(this);
    };

    return _loader;
}

function loaderRemove(par){
    var loaderObj = par.querySelector('.sc-load');
    if (loaderObj != null){
        loaderObj.remove();
    }else{
        console.error("Could not remove loader object for the following object (loader not found):"); console.error(par);
    }
}

//========================================
//              VIDEO MEDIAS
//========================================
function loadVideo(playDiv){
    var vidlink = playDiv.getAttribute("vidlink");
    var vidmute = playDiv.getAttribute("vidmute") == "true";
    var par = playDiv.parentElement;
    var pic = par.querySelector("picture");

    // remove click events so no repeat clicks
    playDiv.removeAttribute("onClick");

    // create fade out overlay
    var overlay = document.createElement("div");
    overlay.classList.add("sc-vid-overlay");
    par.appendChild(overlay);
    
    // FUNCTIONS FOR TIMEOUTS ------------------
    function videoVisible(){
        this.style.display = "block";
        loaderRemove(this.parentElement);

        // set volume
        if (!this.muted){
            this.volume = 0.4;
        }
    }

    function showOverlay(){
        overlay.style.opacity = 1;
    }

    function removeStandIn(){
        // make new video element
        var vid = document.createElement("video");
        vid.muted = vidmute;
        vid.loop = true;
        vid.controls = true;
        vid.autoplay = true;

        vid.src = vidlink;
        if (vidlink == null){
            console.error("Video attempted to load with null vidlink to parent:");
            console.error(pic);
            console.error("with value: " + vidlink.toString());
        }

        vid.addEventListener('loadeddata', videoVisible);

        par.prepend(vid);

        // remove "picture" element
        if (pic != null){
            pic.remove();
        }

        // remove play button element
        playDiv.remove();

        // add another loader
        var _loader = loaderCreate();
        par.appendChild(_loader);

    }

    // start transition,
    setTimeout(showOverlay, 10);
    // then add video element after transition
    setTimeout(removeStandIn, 300);
}

function prepareVideoLoad(par, pic){
    //svg data
    var svgPlay = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><path d="M297.25,145.25,53.92,4.75a5.5,5.5,0,0,0-8.24,4.76v281a5.5,5.5,0,0,0,8.24,4.76l243.33-140.5A5.47,5.47,0,0,0,297.25,145.25Z" style="fill:#fff"/></svg>';

    // create "play" button
    playDiv = document.createElement("div");
    playDiv.classList.add("sc-vid-play");
    playDiv.setAttribute("onclick", "loadVideo(this);");
    playDiv.setAttribute("vidlink", pic.getAttribute("vidlink"));
    playDiv.setAttribute("vidmute", pic.getAttribute("vidmute"));
    pic.removeAttribute("vidlink");
    pic.removeAttribute("vidmute");
    playDiv.innerHTML = '<div>' + svgPlay + '</div>';
    par.appendChild(playDiv);
}

//========================================
//           COMPARE MEDIAS
//========================================
//========================================
//           COMPARE MEDIAS
//========================================
function debugMoveSlider(button){
    var par = button.parentNode;

    if (par.getAttribute("style") != null){
        par.removeAttribute("style");
    }else{
        par.setAttribute('style', 'left:calc(100% - 3px);');
    }
}

function compSlideStart(e){
    if(e.pointerType !== 'mouse' || e.button === 0){
        this.onpointermove = compSlideUpdate;
        this.setPointerCapture(e.pointerId);

        document.body.style = "overflow: hidden;";
    }
}

function compSlideEnd(e){
    if(e.pointerType !== 'mouse' || e.button === 0){
        this.onpointermove = null;
        this.releasePointerCapture(e.pointerId);

        document.body.style = "";
    }
}

function compSlideUpdate(e){
    var par = this.parentElement;
    var comp = par.parentElement;
    var compDim = comp.getBoundingClientRect();
    var xPos = e.clientX;
    xPos = Math.min(Math.max(xPos, compDim.left), compDim.left + compDim.width) - compDim.left;
    var per = xPos / compDim.width;
    par.style.left = `calc(${per*100}% - ${4*per}px)`;

    // update images
    var pLeft = par.parentElement.querySelector(".sc-comp-left");
    pLeft.setAttribute("style", `clip-path: rect(${-100+(per*100)}% ${per*100}% 100% 0%);`);

    var pRight = par.parentElement.querySelector(".sc-comp-right");
    pRight.setAttribute("style", `clip-path: rect(0% 100% ${100+(per*100)}% ${(per*100)}%);`);
}

function prepareCompLoad(par){

    // SVG data
    var _svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><path d="M280.67,300H19.33A19.34,19.34,0,0,1,0,280.67V76.37A19.32,19.32,0,0,1,8.69,60.23L100,0H200l91.31,60.23A19.32,19.32,0,0,1,300,76.37v204.3A19.34,19.34,0,0,1,280.67,300Z" style="fill:#3fb69a"/><polygon points="28.15 163.33 112.16 250.31 112.16 76.36 28.15 163.33" style="fill:#fff"/><polygon points="271.85 163.33 187.84 250.31 187.84 76.36 271.85 163.33" style="fill:#fff"/></svg>';
    
    // create movable line + symbol
    var _compLine = document.createElement("div");
    _compLine.classList.add("sc-comp-line");
    _compLine.innerHTML = _svg;
    var _compSVG = _compLine.firstChild;
    
    // add events to button
    _compSVG.addEventListener("pointerdown", compSlideStart);
    _compSVG.addEventListener("pointerup", compSlideEnd);

    //append line
    par.appendChild(_compLine);
}



//========================================
//            PREVIEW DIV
//========================================
var preview_ENABLED = false;
var preview_ISOPEN = false;

function previewSetup(){
    if (preview_ENABLED) return false;

    if (document.getElementById("prv") == null){
        var newPRV = document.createElement("div");
        newPRV.id = "prv";
        newPRV.innerHTML = '' +
            '<div id="prv-media"><div>' +
                '<img src="../media/blank.png">' +
            '</div></div>' +

            '<div class="prv-exit">' +
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' +
                    '<defs>' +
                        '<filter id="f1">' +
                            '<feOffset in="SourceAlpha" dx="0" dy="0" />' +
                            '<feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.5 0"/>' +
                            '<feGaussianBlur stdDeviation="20" />' +
                            '<feBlend in="SourceGraphic" in2="blurOut" />' +
                        '</filter>' +
                    '</defs>' +
                    '<polygon points="81.29 61.89 150 130.6 218.71 61.89 238.11 81.29 169.4 150 238.11 218.71 218.71 238.11 150 169.4 81.29 238.11 61.89 218.71 130.6 150 61.89 81.29 81.29 61.89" style="fill:#fff" filter="url(#f1)"/>' +
                '</svg>' +
            '</div>';
        newPRV.querySelector(".prv-exit").addEventListener("click", function() {
            previewToggleView(false);
        });
        document.body.appendChild(newPRV);
        preview_ENABLED = true;
        return true;
    }
    return false;
}

function previewSetImage(imgSrc){
    if (preview_ENABLED){
        var prvMedia = document.getElementById("prv-media");
        if (prvMedia != null){
            var prvImg = prvMedia.querySelector("img");
            if (prvImg != null){
                prvImg.src = imgSrc;
            }else{
                var newImg = document.createElement("img");
                newImg.src = imgSrc;
                prvMedia.appendChild(newImg);
            }
        }
    }
}

function previewToggleView(toOpen = false){
    if (preview_ENABLED){
        var PRV = document.getElementById("prv");

        if (toOpen && !preview_ISOPEN){
            if (!PRV.classList.contains("prv-open")) { PRV.classList.add("prv-open"); }
            preview_ISOPEN = true;
        }else if (!toOpen && preview_ISOPEN){
            if (PRV.classList.contains("prv-open")) { PRV.classList.remove("prv-open"); }
            preview_ISOPEN = false;
        }
    }
}

function previewEventOpen(imgLink){
    if (!preview_ISOPEN){
        var par = imgLink.closest(".sc-media");
        if (par != null){
            var imgImg = par.querySelector("div.sc-img > picture > img");
            if (imgImg != null){
                previewSetImage(imgImg.src);
                previewToggleView(true);
            }
        }
    }
}

function createPreviewLinkElement(){
    if (!preview_ENABLED){
        previewSetup();
    }

    if (preview_ENABLED){
        var newDiv = document.createElement("div");
        newDiv.classList.add("sc-img-LINK");
        newDiv.addEventListener("click", function() {
            previewEventOpen(this);
        });
        newDiv.innerHTML = '' + 
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' + 
                '<defs>' +
                    '<filter id="f2">' +
                        '<feOffset in="SourceAlpha" dx="0" dy="0" />' + 
                        '<feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.5 0"/>' + 
                        '<feGaussianBlur stdDeviation="20" />' + 
                        '<feBlend in="SourceGraphic" in2="blurOut" />' +
                    '</filter>' +
                '</defs>' + 
                '<path d="M249.08,224.78l-50.22-50.21a81.31,81.31,0,1,0-24.27,24.29l50.19,50.23a4.33,4.33,0,0,0,6.09,0l18.21-18.22A4.33,4.33,0,0,0,249.08,224.78Zm-173.67-94a55.34,55.34,0,1,1,55.34,55.32A55.41,55.41,0,0,1,75.41,130.76Z" style="fill:#fff" filter="url(#f2)"/>' + 
            '</svg>';

        return newDiv;
    }
    else {return null}
}


//========================================
//            PREPARE MEDIA LOAD
//========================================

function finishMediaLoad(img){

    img.showcaseData.doneLoading = true;
    img.onload = undefined;

    var par = img.showcaseData.par;
    var imgList = img.showcaseData.imgList;
    // check for other images still loading; cancel if yes

    if (imgList.length > 0){
        for (var i = 0; i < imgList.length; i++){
            var _img = document.getElementById(imgList[i]);
            if (!_img.showcaseData.doneLoading){
                return;
            }
        }
    }

    // remove loader object
    var loaderObj = par.querySelector('.sc-load');
    if (loaderObj != null){
        loaderObj.remove();
    }else{
        console.error("Could not remove loader object for the following object (loader not found):"); console.error(par);
    }

    // set opacity of all images on
    img.classList.remove("sc-media-hidden");
    for (var i = 0; i < imgList.length; i++){
        var _imgi = document.getElementById(imgList[i]);
        _imgi.classList.remove("sc-media-hidden");
    }

    // reveal other "hidden media" (ex. compare text)
    var hiddens = par.querySelectorAll(".sc-media-hidden");
    for (var i = 0; i < hiddens.length; i++){
        hiddens[i].classList.remove("sc-media-hidden");
    }


    // setups that need more continuation... -----------------

    // comparison medias
    if (par.classList.contains("sc-comp")){
        prepareCompLoad(par);

    //video medias
    }else if (par.classList.contains("sc-vid")){
        prepareVideoLoad(par, img.parentElement);
    
    // image preview code
    }else{
        var closeMedia = par.closest(".sc-media");
        if (closeMedia){
            var newPrevLink = createPreviewLinkElement();
            if (newPrevLink != null){
                closeMedia.appendChild(newPrevLink);
            }
        }
    }

}




var infoRecalculate_THROTTLE = false;
var infoRecalculate_DELAY = 30;
//========================================
//              INFO BOX
//========================================
function infoRecalculate(par, disableTransform = false){
    // check throttle
    if (infoRecalculate_THROTTLE){
        return;
    }
    var body = par.querySelector(".sc-i-body");
    if (body){

        if (disableTransform){
            body.classList.add("disable-transitions");
        }

        if (par.classList.contains("sc-i-open")){
            /*var parStyle = getComputedStyle(par);
            var _heightOffset = parseFloat(parStyle.lineHeight) * 1.5 + 5;*/

            var finalHeight = 0;

            var childs = body.querySelectorAll(":scope > p, :scope > div");
            for (var i = 0; i < childs.length; i++){
                finalHeight += childs[i].offsetHeight;
            }

            /*finalHeight += _heightOffset;*/

            body.setAttribute("style", "height:" + finalHeight + "px;");

        }else if (par.classList.contains("sc-i-closed")){
            var parStyle = getComputedStyle(par);
            var closedHeight = parseFloat(parStyle.lineHeight) * 3;
            body.setAttribute("style", "height:" + closedHeight + "px;");
        }

        if (disableTransform){
            body.classList.remove("disable-transitions");
        }
    }

    throttled = true;
    //set throttle
    setTimeout(function() {
        throttled = false;
      }, infoRecalculate_DELAY);
}



function infoToggle(obj){
    var par = obj.parentNode;
    var body = par.querySelector(".sc-i-body");

    if (body == null){
        console.error("Tried to toggle info, but found no body element.");
        return;
    }

    // close, if open -----------------------------
    if (par.classList.contains("sc-i-open")){
        par.classList.remove("sc-i-open");
        if (!par.classList.contains("sc-i-closed")){
            par.classList.add("sc-i-closed");
        }

        obj.querySelector(".sc-i-PC").innerHTML = "SHOW MORE";
        obj.querySelector(".sc-i-MOB").src = "../media/symbols/point-down.svg";

    // open, if closed -----------------------------
    }else{
        if (par.classList.contains("sc-i-closed")){
            par.classList.remove("sc-i-closed");
        }
        if (!par.classList.contains("sc-i-open")){
            par.classList.add("sc-i-open");
        }
        obj.querySelector(".sc-i-PC").innerHTML = "SHOW LESS";
        obj.querySelector(".sc-i-MOB").src = "../media/symbols/point-up.svg";
    }

    infoRecalculate(par);
}


//========================================
//              FINAL INIT
//========================================
function showcaseInit(){
    // get medias ----------------------------
    var medias = document.querySelectorAll(".sc-img, .sc-vid, .sc-comp");
    var assignedIdNum = 0;

    // add loaders to medias ----------------------------
    for (var i = 0; i < medias.length; i++){
        var media = medias[i];

        // get pictures for loader to depend on
        var _picList = media.querySelectorAll("picture");
        var _imgList = [];
        for (var e = 0; e < _picList.length; e++){
            var _img = _picList[e].querySelector("img");
            if (_img != null){
                if (_img.id == null || _img.id == ""){
                    _img.id = "sc-unassigned-" + assignedIdNum.toString();
                    assignedIdNum++;
                }
                // make image transparent
                _img.setAttribute("style", "transition: opacity 0s !important;");
                _img.classList.add("sc-media-hidden");
                _img.removeAttribute("style");
                // push to list
                _imgList.push(_img.id);
            }else{
                console.error("Showcase media has no identifiable ID for the following parent:");
                console.error(media);
            }
        }

        // as long as there's pics...
        if (_imgList.length > 0){
            
            // apply event to pictures
            for (var e = 0; e < _imgList.length; e++){
                var _img = document.getElementById(_imgList[e]);
                var _newList = _imgList.slice();
                _newList.splice(_newList.indexOf(_img.id), 1);
                _img.showcaseData = {par: _img.closest(".sc-img, .sc-vid, .sc-comp"), imgList: _newList.slice(), doneLoading: false};
                _img.onload = function() {
                    finishMediaLoad(this);
                };
            }

            // okay so we need the loader now, since there is for sure imgs to load
            var _loader = loaderCreate();
            media.appendChild(_loader);
        }else{
            console.warn("Showcase media object has no images to found to load:");
            console.warn(media);
        }
    }

    // info box loading ---------------------------
    var infoPar = document.querySelector(".sc-i");
    if (infoPar){
        infoRecalculate(infoPar);
        window.onresize = function(){
            infoRecalculate(infoPar, true);
        }
        /* document.addEventListener('resize', function() {
            infoRecalculate(infoPar, true);
        }, true); */
    }

    /*------- DEBUG; OPEN INFO ON LOAD ---------
    setTimeout(function() {
        _showButton = document.getElementsByClassName("sc-i-show");
        if (_showButton[0] != null){
            infoToggle(_showButton[0]);
        }
      }, 10);
    ------------------------------------*/
};