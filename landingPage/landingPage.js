// DOM elements
let submitBtn = document.getElementById("submitBtn");
let input = document.getElementById("search");
let searchResults = document.getElementById("search-results")

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
    fetch(`https://api.watchmode.com/v1/autocomplete-search/?apiKey=g7hJI9XVOqZCYV3Uv0RLX8evqs1y6KrU96V2B3n5&search_field=name&search_value=${string}`)
        .then(data => data.json())
        .then(response => {
            console.log(response.results); // Entire response array with results

            // Console.log all title name results up to 10 
            let length = 10 < response.results.length ? 10 : response.results.length;
            for (let i = 0; i < length; i++) {
                let titleName = document.createElement("li")
                titleName.innerText = response.results[i].name
                searchResults.appendChild(titleName)
                let id =

                console.log(response.results[i].name);
            }
        })
}

const fetchTitleDetails = (titleId) => {
    fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=g7hJI9XVOqZCYV3Uv0RLX8evqs1y6KrU96V2B3n5`)
    .then(data => data.json())
    .then(response => {
        console.log(response)
    })
}

// Event Listener for Submit Button
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    str = strWithUrlFormat(input.value)
    console.log(str);
    fetchData(str);
})


