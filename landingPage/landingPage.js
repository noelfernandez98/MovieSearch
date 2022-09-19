// let url = "https://api.watchmode.com/v1/?apiKey=g7hJI9XVOqZCYV3Uv0RLX8evqs1y6KrU96V2B3n5"
let str = "TokyoDrift";

const fetchData = () => {
    url = `https://api.watchmode.com/v1/search?apiKey=g7hJI9XVOqZCYV3Uv0RLX8evqs1y6KrU96V2B3n5&search_field=name&search_value=${str}`;
    //we check if the input is more than one word, if so we translate the title to url code format.
    if (str.split(" ").length > 1) {
        str = str.split(" ");
        for (let i = 0; i < str.length -1; i++) {
            url += (str[i] + "%20");
        }
        url += str[str.length - 1];
    }
    console.log(url)
    fetch(url)
        .then(data => data.json())
        .then(response => {
            console.log(response)
        })
}
https://api.watchmode.com/v1/search/?apiKey=YOUR_API_KEY&search_field=name&search_value=Ed%20Wood'
fetchData();