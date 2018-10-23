const $ENV = process.env,
    apiBase = $ENV.apiBase || "https://apifootball.com/api/",
    scoresAPIKey = $ENV.scoresAPIKey || "e7cde6001a819ceafcfc92bc1e2cacbe88ffda64f74c8a3579ac05fa889e8ab3",
    axios = require('axios')


let loadScoreAPI = async (action) => {
    var result = await axios.get(`${apiBase}${action}&APIkey=${scoresAPIKey}`)
    return result
}

let getCountries = async () => {
    let result = await loadScoreAPI(`?action=get_countries`)
    return result.data
}

let getCompetition = async (queryId) => {
    var result = await loadScoreAPI(`?action=get_leagues&country_id=${queryId}`)
    return result
}

// getCompetition('169')

let getStandings = (queryId) => {
    loadScoreAPI(`?action=get_standings&league_id=${queryId}`, (err, result) => {
        if (err) return console.log(err)

        // console.log(result.data)
    })
}

let getEvents = (query) => {
    loadScoreAPI(`?action=get_events&=${query}`, (err, result) => {
        if (err) return console.log(err)

        // console.log(result.data)
    })
}


let getOdds = (query) => {
    loadScoreAPI(`?action=get_odds&=${query}`, (err, result) => {
        if (err) return console.log(err)

        // console.log(result.data)
    })
}

let getHeadtoHead = (query, firstTeam, secondTeam) => {
    loadScoreAPI(`?action=get_H2H&=${query}&firstTeam=${firstTeam}&secondTeam=${secondTeam}`, (err, result) => {
        if (err) return console.log(err)

        // console.log(result.data)
    })
}

let getLiveScores = () => {
    loadScoreAPI(`?action=get_events&live_match=1`, (err, result) => {
        if (err) return console.log(err)

        // console.log(result.data)
    })
}







async function someFunction() {
    const myArray = [1, 2, 3];
    const connection = mysql.createPool({
        options
    });
    let resolvedFinalArray = await Promise.all(myArray.map(async (value) => { // map instead of forEach
        const result = await asyncFunction(connection, value);
        finalValue.asyncFunctionValue = result.asyncFunctionValue;
        return finalValue; // important to return the value
    }));
    return functionThatUsesResolvedValues(resolvedFinalArray);
};

let getAvailableLeagues = async () => {
    let countries = await getCountries()
}



let getLeagues = async () => {
    loadScoreAPI('?action=get_countries', (err, result) => {
        if (err) return console.log(err)
        // console.log(result.data)

        var leaguesObj = {}
        // Get leaugues from each coutries

        for (let v of result.data) {
            let country_id = v.country_id
            // console.log('country_id', country_id)
            // Get each competition
            getCompetition(country_id, (err, result) => {
                if (err) return console.log(err)
                for (let i of result.data) {
                    // console.log(result.data)
                    let league_id_obj = {}
                    league_id_obj.league_id = i.league_id
                    league_id_obj.league_name = i.league_name
                    league_id_obj.country_id = i.country_id

                    leaguesObj[country_id] = leaguesObj[country_id] || {}
                    leaguesObj[country_id][i.league_id] = league_id_obj
                }
                // console.log('leaguesObj', leaguesObj)

            })
        }


        return leaguesObj
    })
}


module.exports = {
    loadScoreAPI: loadScoreAPI,
    getCountries: getCountries,
    getCompetition: getCompetition,
    getStandings: getStandings,
    getEvents: getEvents,
    getOdds: getOdds,
    getHeadtoHead: getHeadtoHead,
    getLiveScores: getLiveScores,
    getLeagues: getLeagues
}