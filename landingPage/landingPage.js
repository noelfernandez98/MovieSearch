// DOM elements
let submitBtn = document.getElementById("submitBtn");
let input = document.getElementById("search");
let str = "tokyoDrift";
let newStr = ""
let countryCode;
let sourceObj = {}

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
            let name = []
            for (let i = 0; i < source.length; i++) {
                if (!name.includes(source[i].name)) {
                    name.push(source[i].name)
                    arr.push(source[i])
                }
            }
            return arr
        }

        // This function gets all li elements(class = title-results) and removes them to make space for new searches
        const removePreviousResults = () => {
            const element = Array.from(document.getElementsByClassName("search-results"))
            console.log(element)
            if (element.length > 0) element.forEach(x => x.remove())
        }

        // This fetch wll get the list of sources info and store it in sourceObj. Key : Value => (idNum : logoUrl)
        const storeSources = () => {
            fetch('https://api.watchmode.com/v1/sources/?apiKey=EjUu4qpEoUSvrHa3oHqZD1bB39zYdP1OWvAon5rY')
                .then(data => data.json())
                .then(response => {
                    for (let i = 0; i < response.length; i++) {
                        sourceObj[`${response[i].id}`] = response[i].logo_100px
                    }
                    console.log(sourceObj)
                })
        }

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
                        bigCountainer.setAttribute('id', `search-results${i}`)
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
                        whereToWatch.setAttribute('id', `where-to-watch${i}`)
                        let sourcesList = document.createElement("div");
                        sourcesList.setAttribute('class', 'sources-list');
                        sourcesList.setAttribute('id', `${i}`) // Set by id iteration
                        let movieDesc = document.createElement("div");
                        movieDesc.setAttribute('class', 'movie-desc');
                        document.getElementById(`title-sources-rating-desc${i}`).append(titleDiv, whereToWatch, sourcesList, movieDesc);


                        //title 
                        let title = document.createElement("h2");
                        title.innerText = response.results[i].name                   //left blank
                        document.getElementById(`movie-title${i}`).append(title);

                        //where to watch H3
                        let whereToWatchH3 = document.createElement("h3");
                        whereToWatchH3.innerText = "Where to Watch"
                        document.getElementById(`where-to-watch${i}`).append(whereToWatchH3);

                        let id = response.results[i].id
                        // console.log(id)
                        // console.log(response.results[i].name);
                        fetchTitleDetails(id, movieDesc, sourcesList, movieImg)
                    }
                })
        }

        // This function takes a given plot summary and shortens it to display only 120 characters
        const setDescriptionLength = (plotSummary) => {
            if (plotSummary.length > 120) return `${plotSummary.slice(0, 120)} ...`
        }

        // Fetch Title Details - Title Source - Title Rating - Title Img Icon
        const fetchTitleDetails = (titleId, moviesDescElement, sourcesListElement, movieImgElement,) => {
            console.log(movieImgElement, moviesDescElement, sourcesListElement)
            fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=EjUu4qpEoUSvrHa3oHqZD1bB39zYdP1OWvAon5rY&append_to_response=sources`)
                .then(data => data.json())
                .then(response => {
                    console.log(response)
                    //movie Desc
                    let desc = document.createElement("p");
                    desc.innerText = setDescriptionLength(response.plot_overview)
                    moviesDescElement.appendChild(desc)

                    //Show the rest of the plot summary
                    let showMoreButton = document.createElement("SPAN")
                    showMoreButton.setAttribute("class", "material-symbols-outlined")
                    showMoreButton.innerHTML = 'arrow_drop_down'
                    desc.insertAdjacentElement("afterend", showMoreButton);
                    showMoreButton.addEventListener("click", (e) => {
                        e.preventDefault()
                        if (desc.innerText.length < 126) {
                            desc.innerText = response.plot_overview
                        } else {
                            desc.innerText = setDescriptionLength(response.plot_overview)
                        }
                    })


                    let arrSources = removeRepeatSources(response.sources)
                    let length = 4 < arrSources.length ? 4 : arrSources.length;
                    for (let i = 0; i < length; i++) {
                        // sources (netflix, hulu, vudu ....)
                        let aTagImg = document.createElement("a")
                        let sources = document.createElement("img");
                        sources.setAttribute('class', 'source-logo')
                        aTagImg.setAttribute('class', 'source-link')
                        aTagImg.setAttribute("target", "_blank")
                        aTagImg.appendChild(sources)
                        sourcesListElement.append(aTagImg);
                        sources.src = sourceObj[`${arrSources[i].source_id}`]
                        aTagImg.href = arrSources[i].web_url
                    }

                    // let titleRating = document.createElement("li") // ADD LATER

                    // Movie Poster Img
                    let img = document.createElement("img");
                    img.setAttribute('src', `${response.poster}`);
                    movieImgElement.append(img);

                    // titleRating.innerText = response.user_rating // ADD LATER
                    // console.log(titleRating)
                })
        }

        // Event Listener for Submit Button
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            storeSources();
            removePreviousResults();
            str = strWithUrlFormat(input.value)
            // console.log(str);
            fetchData(str);
        })
    })
}