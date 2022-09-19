let submitBtn = document.getElementById("submitBtn");
let input = document.getElementById("search");
let str = "tokyoDrift";


//we check if the input is more than one word, if so we translate the title to url code format by adding %20(space).
let newStr = ""
if (str.split(" ").length > 1) {
    str = str.split(" ");
    for (let i = 0; i < str.length - 1; i++) {
        newStr += (str[i] + "%20");
    }
    newStr += str[str.length - 1];
}
if(newStr.length > 0) str = newStr

// Fetch possible movie title results
const fetchData = (string) => {
    fetch(`https://api.watchmode.com/v1/autocomplete-search/?apiKey=g7hJI9XVOqZCYV3Uv0RLX8evqs1y6KrU96V2B3n5&search_field=name&search_value=${string}`)
        .then(data => data.json())
        .then(response => {
            console.log(response.results); // Entire response array with results

            // Console.log all title name results up to 10 
            let length = 10 < response.results.length ? 10 : response.results.length;
            for (let i = 0; i <= length ; i++) {
                console.log(response.results[i].name);
            }
        })
}

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    str = input.value;
    console.log(input.value);
    fetchData(str);
})

// fetchData();