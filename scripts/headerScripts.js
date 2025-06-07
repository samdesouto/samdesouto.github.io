var _SVG_MENU = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect x="36.81" y="47.65" width="226.37" height="33.64" rx="16.82" style="fill:#fff"/><rect x="36.81" y="133.18" width="226.37" height="33.64" rx="16.82" style="fill:#fff"/><rect x="36.81" y="218.71" width="226.37" height="33.64" rx="16.82" style="fill:#fff"/></svg>';
var _SVG_CLOSED = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect x="39.11" y="136.28" width="221.78" height="27.43" transform="translate(-62.13 150) rotate(-45)" style="fill:#fff"/><rect x="39.11" y="136.28" width="221.78" height="27.43" transform="translate(150 -62.13) rotate(45)" style="fill:#fff"/></svg>';

function headerToggle(){
    var _button = document.getElementById("h-nav-MOB");
    var _menu = document.getElementById("h-menu-MOB");

    // drop out if button/menu cant be found
    if (_button == null || _menu == null){
        console.error("Could toggle Mobile Nav menu; missing button or menu.");
        return;
    }

    // change OPEN --> CLOSE
    if (_button.classList.contains("h-MOB-open")){
        _button.classList.remove("h-MOB-open");
        if (_menu.classList.contains("h-MOB-open")){_menu.classList.remove("h-MOB-open");}

        _button.innerHTML = _SVG_MENU;

    // change CLOSE --> OPEN
    }else{
        _button.classList.add("h-MOB-open");
        if (!_menu.classList.contains("h-MOB-open")){_menu.classList.add("h-MOB-open");}

        _button.innerHTML = _SVG_CLOSED;
    }
}

function headerSetup(){
    var _button = document.getElementById("h-nav-MOB");
    if (_button){
        _button.innerHTML = _SVG_MENU;
    }
}