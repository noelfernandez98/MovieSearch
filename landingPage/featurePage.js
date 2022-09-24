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

const removeRepeatSources = (source) => {
    let arr = []
    for(let i = 0; i < source.length; i++) {
        if(!arr.includes(source[i].name)) arr.push(source[i].name)
    }
    return arr
}

const fetchData = (string) => {
    fetch(`https://api.watchmode.com/v1/autocomplete-search/?apiKey=F8bvpNfGuiLrKih9wwtdXGDqkiodX6pk98ZGyCXE&search_field=name&search_value=${string}`)
        .then(data => data.json())
        .then(response => {
            console.log(response)
        })
}

const fetchTitleDetails = (titleId, parent) => {
    fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=F8bvpNfGuiLrKih9wwtdXGDqkiodX6pk98ZGyCXE&append_to_response=sources`)
        .then(data => data.json())
        .then(response => {
            console.log(response)

        })

}


            str = strWithUrlFormat("Toy Story")
            console.log(str);
            fetchData(str)