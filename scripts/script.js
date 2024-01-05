var btnPageAdd = document.getElementById("btnPageAdd");
var btnPageSearch = document.getElementById("btnPageSearch");

var pageAdd = document.getElementById("add-page");
var pageSearch = document.getElementById("search-page");


var formTitle = document.getElementById("form-title");
var formCategory = document.getElementById("form-category");
var formAnnotations = document.getElementById("form-annotations");
var formButton = document.getElementById("form-sub-button");


formButton.addEventListener("click", saveFav); //Ao clicar no botão, salvar como Favorito
btnPageAdd.addEventListener("click", showAddPage);
btnPageSearch.addEventListener("click", showSearchPage);

var urlCurrent = "";
var urlIconCurrent = "";

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
    var divCategoryContainer = document.getElementById("category-container");

    chrome.storage.sync.get("STORAGE_KEY", function(result){ //Função que retorna as info salva em storage
        var tempListFavs = result.STORAGE_KEY.split("\n");

        var listFavs = [];
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
    console.log("aq");

    
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
    console.log(categoryName);
}