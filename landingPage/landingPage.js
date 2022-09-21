// DOM elements
let submitBtn = document.getElementById("submitBtn");
let input = document.getElementById("search");
let searchResults = document.getElementById("search-results")
let str = "tokyoDrift";
let newStr = ""
let countryCode;

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

        // This function removes repeated sources from source array 
        const removeRepeatSources = (source) => {
            let arr = []
            for(let i = 0; i < source.length; i++) {
                if(!arr.includes(source[i].name)) arr.push(source[i].name)
            }
            return arr
        }

        // Fetch possible movie title results
        const fetchData = (string) => {
            fetch(`https://api.watchmode.com/v1/autocomplete-search/?apiKey=F8bvpNfGuiLrKih9wwtdXGDqkiodX6pk98ZGyCXE&search_field=name&search_value=${string}`)
                .then(data => data.json())
                .then(response => {
                    console.log(response.results); // Entire response array with results
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
        
        // Fetch Title Details - Title Source - Title Rating - Title Img Icon
        const fetchTitleDetails = (titleId, parent) => {
            fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=F8bvpNfGuiLrKih9wwtdXGDqkiodX6pk98ZGyCXE&append_to_response=sources`)
                .then(data => data.json())
                .then(response => {
                    console.log(response)
                    let arrSources = removeRepeatSources(response.sources)
                    console.log(arrSources)
                    let titleSourcesList = document.createElement("ul")
                    let length = 4 < arrSources.length ? 4 : arrSources.length;
                    for (let i = 0; i < length; i++) {
                        let titleSource = document.createElement("li")
                        titleSource.innerText = arrSources[i]
                        titleSourcesList.appendChild(titleSource)
                    }
                    let titleRating = document.createElement("li")
                    let imgIcon = document.createElement("img")
                    titleRating.innerText = response.user_rating
                    imgIcon.src = response.poster
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