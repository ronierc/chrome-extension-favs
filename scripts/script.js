var btnPageAdd = document.getElementById("btnPageAdd");
var btnPageSearch = document.getElementById("btnPageSearch");

var pageAdd = document.getElementById("add-page");
var pageSearch = document.getElementById("search-page");
var pageLinks = document.getElementById("links-page");


var formTitle = document.getElementById("form-title");
var formCategory = document.getElementById("form-category");
var formAnnotations = document.getElementById("form-annotations");
var formButton = document.getElementById("form-sub-button");


formButton.addEventListener("click", saveFav); //Ao clicar no botão, salvar como Favorito
btnPageAdd.addEventListener("click", showAddPage);
btnPageSearch.addEventListener("click", showSearchPage);

var urlCurrent = "";
var urlIconCurrent = "";

var listFavs = [];
var listCategory = [];


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
    pageLinks.style.display = "none";
}
function showSearchPage() {
    getFavs(); //Carregar favoritos.
    pageAdd.style.display = "none";
    pageSearch.style.display = "block";    
    pageLinks.style.display = "none";
}
// Pagina de links
function showLinksPage(categoryName) {
    pageAdd.style.display = "none";
    pageSearch.style.display = "none";
    document.getElementById("link-catg-name").innerHTML = categoryName;
    pageLinks.style.display = "block";

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
    chrome.storage.sync.get("STORAGE_KEY", function(result){ //Função que retorna as info salva em storage
        if(result.STORAGE_KEY != undefined){
            newJson = result["STORAGE_KEY"] + "\n" + newJson;
        }
        chrome.storage.sync.set({ "STORAGE_KEY": newJson }).then(() => { //Função que salva em storage
            console.log("Salvo com sucesso");
            getFavs();
            showSearchPage();
        });
    });
}


//Carregar favoritos.
function getFavs() {
    listFavs = [];
    var divCategoryContainer = document.getElementById("category-container");

    chrome.storage.sync.get("STORAGE_KEY", function(result){ //Função que retorna as info salva em storage
        var tempListFavs = result.STORAGE_KEY.split("\n");

        for(var i = 0; i < tempListFavs.length; i++){
            let element = JSON.parse(tempListFavs[i]);
            let category = element["category"]; 

            listFavs.push(element);
            if(!listCategory.includes(category)){ // se na lista de categorias não tiver a lista atual
                listCategory.push(category);
            }
        }

        populateSearchPage();
        //divCategoryContainer.innerHTML = listCategory;
    });
}

function populateSearchPage(){
    var divCategoryContainer = document.getElementById("category-container");
    divCategoryContainer.innerHTML = "";

    
    for(i = 0; i < listCategory.length; i++){
        let categoryName = listCategory[i];

        var categoryDiv = document.createElement("div");
        categoryDiv.id = "category" + i.toString();
        categoryDiv.classList.add("col-4");

        categoryDiv.innerHTML = `
            <div class="category-header">
                <img src="assets/folder.png" height="25" />
            </div>
            <div class="category-body">
                ${categoryName}
            </div>
        `;
        divCategoryContainer.appendChild(categoryDiv);

        document.getElementById("category" + i.toString()).addEventListener("click", () => {
            showListByCategory(categoryName)
        })
    }
}

function showListByCategory(categoryName){
    populateLinkPage(categoryName);
    showLinksPage(categoryName);
}

function populateLinkPage(categoryName){
    var divLinksContainer = document.getElementById("links-container");
    divLinksContainer.innerHTML = "";
    console.log("aq");

    for(var i = 0; i < listFavs.length; i++){
        var fav = listFavs[i];
        if (fav["category"] == categoryName){
            //divLinksContainer.innerHTML += fav["url"];
            var linkDiv = document.createElement("div");
            linkDiv.id = "fav" + i.toString();

            linkDiv.classList.add("row");
            linkDiv.classList.add("justify-content-center");

            linkDiv.innerHTML = `
            <div class="row justify-content-center">
                <div class="link-header col-1 center">
                    <img src="${fav["iconUrl"]}" height="20" />
                </div>
                <div class="link-body col-11">
                    <div class="row align-itens-center">
                        <div class="col-10">
                            <div class="row link-title">
                                ${fav["title"]}
                            </div>
                            <div class="row">
                                ${fav["annotations"]}
                            </div>
                        </div>
                        <div class="col-2 center">
                            <div class="row align-itens-center">
                                <div class="col-auto">
                                    <a href="${fav["url"]}" target="_blank" rel="noopener">
                                        <img src="assets/link.png" height="20" />
                                    </a>
                                </div>
                                <div class="col-auto">
                                    <button class="btn btn-nopadding">
                                        <img src="assets/delete.png" height="20" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            divLinksContainer.appendChild(linkDiv);
        }
    }
}