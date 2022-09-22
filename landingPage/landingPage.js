// DOM elements
let submitBtn = document.getElementById("submitBtn");
let input = document.getElementById("search");
// let searchResults = document.getElementById("search-results")
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
            for (let i = 0; i < source.length; i++) {
                if (!arr.includes(source[i].name)) arr.push(source[i].name)
            }
            return arr
        }

        // This function gets all li elements(class = title-results) and removes them to make space for new searches
        const removePreviousResults = () => {
            const element = Array.from(document.getElementsByClassName("search-results"))
            console.log(element)
            if (element.length > 0) element.forEach(x => x.remove())
        }

        //


        // Fetch possible movie title results
        const fetchData = (string) => {
            fetch(`https://api.watchmode.com/v1/autocomplete-search/?apiKey=EjUu4qpEoUSvrHa3oHqZD1bB39zYdP1OWvAon5rY&search_field=name&search_value=${string}`)
                .then(data => data.json())
                .then(response => {

                    // console.log(response.results); // Entire response array with results

                    // Console.log all title name results up to 10 
                    let length = 2 < response.results.length ? 2 : response.results.length;
                    for (let i = 0; i < length; i++) {
                        console.log(i)
                        //create dynamic cards
                        //big countainer
                        let bigCountainer = document.createElement("div");
                        console.log(bigCountainer)
                        bigCountainer.setAttribute('class', 'search-results');
                        bigCountainer.setAttribute('id',`search-results${i}`)
                        document.body.append(bigCountainer);

                        //create children for big countainer
                        let titleSourcesRatingsDesc = document.createElement("div");
                        titleSourcesRatingsDesc.setAttribute('class', 'title-sources-rating-desc');
                        titleSourcesRatingsDesc.setAttribute('id', `title-sources-rating-desc${i}`)
                        let movieImg = document.createElement("div");
                        movieImg.setAttribute('class', 'movie-img');
                        movieImg.setAttribute('id', `movie-img${i}`)
                        document.getElementById(`search-results${i}`).append(titleSourcesRatingsDesc, movieImg);

                        //create childrends children (right and left side div chiildren)
                        //right side
                        let titleDiv = document.createElement("div");
                        titleDiv.setAttribute('class', 'movie-title');
                        titleDiv.setAttribute('id', `movie-title${i}`)
                        let whereToWatch = document.createElement("div");
                        whereToWatch.setAttribute('class', 'where-to-watch');
                        let sourcesList = document.createElement("div");
                        sourcesList.setAttribute('class', 'sources-list');
                        sourcesList.setAttribute('id', `${i}`) // Set by id iteration
                        let movieDesc = document.createElement("div");
                        movieDesc.setAttribute('class', 'movie-desc');
                        document.getElementById(`title-sources-rating-desc${i}`).append(titleDiv, whereToWatch, sourcesList, movieDesc);


                        //title 
                        let title = document.createElement("h2");
                        title.innerText = " "                               //left blank
                        document.getElementById(`movie-title${i}`).append(title);
                        //where to watch H3
                        let whereToWatchH3 = document.createElement("h3");
                        whereToWatchH3.innerText = " "                      //left blank
                        document.getElementsByClassName("where-to-watch")[0].append(whereToWatchH3);

                        let id = response.results[i].id
                        // console.log(id)
                        title.innerText = response.results[i].name
                        // titleName.classList.add("title-result1")
                        // bigCountainer.appendChild(titleName)
                        // console.log(response.results[i].name);
                        fetchTitleDetails(id, movieDesc, sourcesList, movieImg)
                    }
                })
        }

        // Fetch Title Details - Title Source - Title Rating - Title Img Icon
        const fetchTitleDetails = (titleId, moviesDescElement, sourcesListElement, movieImgElement,) => {
            console.log(movieImgElement, moviesDescElement, sourcesListElement)
            fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=EjUu4qpEoUSvrHa3oHqZD1bB39zYdP1OWvAon5rY&append_to_response=sources`)
                .then(data => data.json())
                .then(response => {

                    //left side
                    //left blank

                    console.log(response)
                    //movie Desc
                    let desc = document.createElement("p");
                    desc.innerText = ""                                 //left blank
                    document.body.getElementsByClassName("movie-desc")[0].append(desc);

                    // console.log(response)
                    let arrSources = removeRepeatSources(response.sources)
                    console.log(arrSources)
                    // let titleSourcesList = document.createElement("ul")

                    let length = 4 < arrSources.length ? 4 : arrSources.length;

                    let sourceId = 0
                    for (let i = 0; i < length; i++) {
                        // sources (netflix, hulu, vudu ....)
                        let sources = document.createElement("li");
                        // document.getElementById(sourceId).append(sources);
                        sourcesListElement.append(sources);
                        sourceId++
                        sources.innerText = arrSources[i]

                        sourcesListElement.appendChild(sources)
                    }


                    // let titleRating = document.createElement("li") // ADD LATER

                    //img
                    let img = document.createElement("img");
                    img.setAttribute('src', `${response.poster}`);
                    movieImgElement.append(img);

                    // titleRating.innerText = response.user_rating // ADD LATER
                    // console.log(titleSourcesList)
                    // console.log(titleRating)
                })

        }

        // Event Listener for Submit Button
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            removePreviousResults();
            str = strWithUrlFormat(input.value)
            // console.log(str);
            fetchData(str);
        })
    })
}