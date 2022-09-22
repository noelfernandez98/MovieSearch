// DOM elements
let submitBtn = document.getElementById("submitBtn");
let input = document.getElementById("search");
let searchResults = document.getElementById("search-results")
let str = "tokyoDrift";
let newStr = ""
let countryCode;

function makeCards() {
    
}
//create dynamic cards
//big countainer
let bigCountainer = document.createElement("div");
bigCountainer.setAttribute('class', 'search-results');
document.body.append(bigCountainer);
//create children for big countainer
let titleSourcesRatingsDesc = document.createElement("div");
titleSourcesRatingsDesc.setAttribute('class', 'title-sources-rating-desc');
let movieImg = document.createElement("div");
movieImg.setAttribute('class', 'movie-img');
document.getElementsByClassName("search-results")[0].append(titleSourcesRatingsDesc, movieImg);
//create childrends children (right and left side div chiildren)
//right side
let titleDiv = document.createElement("div");
titleDiv.setAttribute('class', 'movie-title');
let whereToWatch = document.createElement("div");
whereToWatch.setAttribute('class', 'where-to-watch');
let sourcesList = document.createElement("div");
sourcesList.setAttribute('class', 'sources-list');
let movieDesc = document.createElement("div");
movieDesc.setAttribute('class', 'movie-desc');
document.getElementsByClassName("title-sources-rating-desc")[0].append(titleDiv, whereToWatch, sourcesList, movieDesc);
//left side
let img = document.createElement("img");
img.setAttribute('src', '');                   //left blank
document.getElementsByClassName("movie-img")[0].append(img);
//title 
let title = document.createElement("h2");
title.innerText = " "                               //left blank
document.getElementsByClassName("movie-title")[0].append(title);
//where to watch H3
let whereToWatchH3 = document.createElement("h3");
whereToWatchH3.innerText = " "                      //left blank
document.getElementsByClassName("where-to-watch")[0].append(whereToWatchH3);
// sources (netflix, hulu, vudu ....)
let sources = document.createElement("li"); 
document.getElementsByClassName("sources-list")[0].append(sources);
//movie Desc
let desc = document.createElement("p");
desc.innerText = ""                                 //left blank
document.body.getElementsByClassName("movie-desc")[0].append(desc);

















//get user location for region results
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        console.log('My General Position:', position);
        const long = position.coords.longitude.toString();
        const lat = position.coords.latitude.toString();
        const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude${long}&localityLanguage=en`;
        fetch(geoApiUrl)
            .then(res => res.json())
            .then(data => countryCode = data.countryCode)

        //This function checks the given inputValue and converts it to URL code format if spaces are present
        const strWithUrlFormat = (inputValue) => {
            let str = inputValue;
            let newStr = "";
            if (str.split(" ").length > 1) {
                str = str.split(" ");
                for (let i = 0; i < str.length - 1; i++) {
                    newStr += (str[i] + "%20");
                }
                newStr += str[str.length - 1];
            }
            if (newStr.length > 0) str = newStr
            return str
        }

        // Fetch possible movie title results
        const fetchData = (string) => {
            fetch(`https://api.watchmode.com/v1/autocomplete-search/?apiKey=F8bvpNfGuiLrKih9wwtdXGDqkiodX6pk98ZGyCXE&search_field=name&search_value=${string}`)
                .then(data => data.json())
                .then(response => {
                    // console.log(response.results); // Entire response array with results;

                    // Console.log all title name results up to 10 
                    let length = 10 < response.results.length ? 10 : response.results.length;
                    for (let i = 0; i < length; i++) {
                        let id = response.results[i].id
                        console.log(id)
                        let titleName = document.createElement("li")
                        titleName.innerText = response.results[i].name
                        searchResults.appendChild(titleName)
                        console.log(response.results[i].name);
                        fetchTitleDetails(id, titleName)
                    }
                })
        }

        const fetchTitleDetails = (titleId, parent) => {
            fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=F8bvpNfGuiLrKih9wwtdXGDqkiodX6pk98ZGyCXE&append_to_response=sources`)
                .then(data => data.json())
                .then(response => {
                    console.log(response);
                    let titleSourcesList = document.createElement("ul");
                    let length = 4 < response.sources.length ? 4 : response.sources.length;
                    for (let i = 0; i < length; i++) {
                        let titleSource = document.createElement("li");
                        titleSource.innerText = response.sources[i].name;
                        titleSourcesList.appendChild(titleSource);
                    }
                    let titleRating = document.createElement("li")
                    let imgIcon = document.createElement("img")
                    titleRating.innerText = response.user_rating
                    // imgIcon.src = response.poster == null ? 
                    parent.append(titleSourcesList, titleRating, imgIcon)
                    console.log(titleSourcesList)
                    console.log(titleRating)
                })

        }

        // Event Listener for Submit Button
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            str = strWithUrlFormat(input.value)
            console.log(str);
            fetchData(str);
        })
    })
}