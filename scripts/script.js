var btnPageAdd = document.getElementById("btnPageAdd");
var btnPageSearch = document.getElementById("btnPageSearch");

var pageAdd = document.getElementById("add-page");
var pageSearch = document.getElementById("search-page");

btnPageAdd.addEventListener("click", showAddPage);
btnPageSearch.addEventListener("click", showSearchPage);

var formTitle = document.getElementById("form-title");
var formCategory = document.getElementById("form-category");
var formAnnotations = document.getElementById("form-annotations");
var formButton = document.getElementById("form-sub-button");

//Ao clicar no botão, salvar como Favorito
formButton.addEventListener("click", saveFav);

var urlCurrent = "";
var urlIconCurrent = "";


window.onload = function () {
    //Pegando o titulo da pagina atual e jogando para a Extensão.
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let title = tabs[0].title; // Capturar o title
        formTitle.setAttribute("value", title); // Atribui ao input

        urlCurrent = tabs[0].url; // Capturar a URL
        urlIconCurrent = tabs[0].favIconUrl; // Capturar o icone da pagina
    });

    getFavs(); //Carregar favoritos.
}


//Troca de conteúdo ao clicar no menu.
function showAddPage() {
    pageAdd.style.display = "block";
    pageSearch.style.display = "none";
}
function showSearchPage() {
    getFavs(); //Carregar favoritos.
    pageAdd.style.display = "none";
    pageSearch.style.display = "block";
}

//Função que salva como Favorito
function saveFav() {
    var dict = {};
    dict = {
        "title": formTitle.value,
        "category": formCategory.value,
        "annotations": formAnnotations.value,
        "url": urlCurrent,
        "iconUrl": urlIconCurrent
    }

    var newJson = JSON.stringify(dict);
    chrome.storage.sync.get(["STORAGE_KEY"]).then((result) => {
        if(result.STORAGE_KEY != undefined){
            newJson = result.STORAGE_KEY + "\n" + newJson;
        }
    });

    chrome.storage.sync.set({ "STORAGE_KEY": newJson }).then(() => {
        console.log("Salvo com sucesso");
        getFavs();
        showSearchPage();
    });

}


//Carregar favoritos.
function getFavs() {
    var divCategoryContainer = document.getElementById("category-container");

    chrome.storage.sync.get(["STORAGE_KEY"]).then((favs) => {
        divCategoryContainer.innerHTML += favs.STORAGE_KEY;
    });
}