// DOM elements
let submitBtn = document.getElementById("submitBtn");
let input = document.getElementById("search");
let str = "tokyoDrift";
let newStr = ""
let countryCode;
let sourceObj = {}

//--------------------------------------------------------------------------------------------
// let nextButton = document.getElementById("next-button")
// let backButton = document.getElementById("back-button")
// let track = document.getElementById("carousel-imgs")
// let slides = Array.from(track.children);
// const slideWidth = slides[0].getBoundingClientRect().width;
// console.log(slideWidth);
// const setSlidePosition = (slide, index) => {
//     slide.style.left = slideWidth * index + 'px';
// }

// nextButton.addEventListener("click", e => {
//     // slides.style.transform = "translateX(-200)";
//     document.getElementById("movie-title").innerText = "solid 4px white";
//     console.log("hello")
// })

const func = selector => {
    return document.querySelector(selector);
};

function next() {
    if (func(".hide")) {
        func(".hide").remove();
    }

    /* Step */

    if (func(".prev")) {
        func(".prev").classList.add("hide");
        func(".prev").classList.remove("prev");
    }

    func(".act").classList.add("prev");
    func(".act").classList.remove("act");

    func(".next").classList.add("act");
    func(".next").classList.remove("next");

    /* New Next */

    func(".new-next").classList.remove("new-next");

    const addedEl = document.createElement('li');

    func(".list").appendChild(addedEl);
    addedEl.classList.add("next", "new-next");
}

function prev() {
    func(".new-next").remove();

    /* Step */

    func(".next").classList.add("new-next");

    func(".act").classList.add("next");
    func(".act").classList.remove("act");

    func(".prev").classList.add("act");
    func(".prev").classList.remove("prev");

    /* New Prev */

    func(".hide").classList.add("prev");
    func(".hide").classList.remove("hide");

    const addedEl = document.createElement('li');

    func(".list").insertBefore(addedEl, func(".list").firstChild);
    addedEl.classList.add("hide");
}

slide = element => {
    /* Next slide */

    if (element.classList.contains('next')) {
        next();

        /* Previous slide */

    } else if (element.classList.contains('prev')) {
        prev();
    }
}

const slider = func(".list"),
    swipe = new Hammer(func(".swipe"));

slider.onclick = event => {
    slide(event.target);
}

swipe.on("swipeleft", (ev) => {
    next();
});

swipe.on("swiperight", (ev) => {
    prev();
});

// --------------------------------------------------------------------------------------------
// get user location for region results
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
            fetch('https://api.watchmode.com/v1/sources/?apiKey=K7VgGv4tXHT84UFFngOBRlUtRTjeKp2rgnnX4tba')
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
            fetch(`https://api.watchmode.com/v1/autocomplete-search/?apiKey=K7VgGv4tXHT84UFFngOBRlUtRTjeKp2rgnnX4tba&search_field=name&search_value=${string}`)
                .then(data => data.json())
                .then(response => {

                    // console.log(response.results); // Entire response array with results
                    // Console.log all title name results up to 10 

                    let length = 9 < response.results.length ? 9 : response.results.length;
                    for (let i = 0; i < length; i++) {
                        console.log(i);
                        //create dynamic cards
                        //big countainer
                        let bigCountainer = document.createElement("div");
                        console.log(bigCountainer)
                        bigCountainer.setAttribute('class', 'search-results');
                        bigCountainer.setAttribute('id',`search-results${i}`)
                        document.getElementById("parent-div").append(bigCountainer);


                        //create children for big countainer
                        let titleSourcesRatingsDesc = document.createElement("div");
                        titleSourcesRatingsDesc.setAttribute('class', 'title-sources-rating-desc');
                        titleSourcesRatingsDesc.setAttribute('id', `title-sources-rating-desc${i}`)
                        let movieImg = document.createElement("div");
                        movieImg.setAttribute('class', 'movie-img');
                        movieImg.setAttribute('id', `movie-img${i}`)
                        document.getElementById(`search-results${i}`).append(movieImg, titleSourcesRatingsDesc);

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
            fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=K7VgGv4tXHT84UFFngOBRlUtRTjeKp2rgnnX4tba&append_to_response=sources`)
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
            document.getElementById("carousel-parent").style.display = 'none';
            e.preventDefault();
            storeSources();
            removePreviousResults();
            str = strWithUrlFormat(input.value)
            // console.log(str);
            fetchData(str);
        })
    })
}
const movieSection = document.getElementsByClassName('movie-body')
let trial = [];

fetch(`https://api.watchmode.com/v1/releases/?apiKey=K7VgGv4tXHT84UFFngOBRlUtRTjeKp2rgnnX4tba&sort_by=relevance_desc`)
    .then(res => res.json())
    .then(data => {
        if (data) {
            console.log(data, 'original data')
        console.log(data.titles, 'movie titles')
            for (let movie of data.titles) {
                if (movie.year > 2021) {
                    trial.push(movie.title)
                    movieSection.innerText = movie.title
                }
            }
        }
            function getRandomMovies(trial){
                console.log(trial, 'Logging')
                let randomMovies = trial.sort(() => Math.random() > 0.5 ? 1 : -1).slice(0, 10)
                console.log(randomMovies);
                for(let i = 0; randomMovies.length; i++) {
                   pTag = document.createElement('p')
                   pTag.innerText = randomMovies[i]
                    document.body.appendChild(pTag)
                }
            }
            getRandomMovies(trial)

    })
    


    // for(let i = 0; trial.length; i++) {
    //     document.body.appendChild(randomMovies)
    // }
// fetching based on latest movies/rating

