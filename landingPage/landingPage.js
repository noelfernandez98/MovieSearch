let url = "https://api.watchmode.com/v1/status/?apiKey=g7hJI9XVOqZCYV3Uv0RLX8evqs1y6KrU96V2B3n5"

const fetchData = () => {
    fetch(url)
        .then(data => data.json())
        .then(response => {
            response.console.log(response)
        })
}


fetchData();