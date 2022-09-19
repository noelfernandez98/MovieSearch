let str = "Fast & Furious";
//we check if the input is more than one word, if so we translate the title to url code format by adding %20(space).
let newStr = ""
if (str.split(" ").length > 1) {
    str = str.split(" ");
    for (let i = 0; i < str.length - 1; i++) {
        newStr += (str[i] + "%20");
    }
    newStr += str[str.length - 1];
}
str = newStr

// Fetch possible movie title results
const fetchData = () => {
    fetch(`https://api.watchmode.com/v1/search/?apiKey=g7hJI9XVOqZCYV3Uv0RLX8evqs1y6KrU96V2B3n5&search_field=name&search_value=${str}`)
        .then(data => data.json())
        .then(response => {
            console.log(response)
        })
}
fetchData();