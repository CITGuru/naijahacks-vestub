const $ENV = process.env,
    apiBase = $ENV.apiBase || "https://apifootball.com/api/",
    apiKey = $ENV.apiKey || "e7cde6001a819ceafcfc92bc1e2cacbe88ffda64f74c8a3579ac05fa889e8ab3",
    axios = require('axios')


let loadScoreAPI = (action, callback) => {
    axios.get(`${apiBase}${action}&APIkey=${apiKey}`).then(result => {
        console.log(result)

        callback(false, result)
    }).catch(err => {
        console.log(err)

        callback(err)
    })
}

let getCountries = () => {
    loadScoreAPI('?action=get_countries', (err, result) => {
        if (err) return console.log(err)

        console.log(result.data)
    })
}

let getCompetition = (queryId) => {
    loadScoreAPI(`?action=get_leagues&country_id=${queryId}`, (err, result) => {
        if (err) return console.log(err)

        console.log(result.data)
    })
}

let getStandings = (queryId) => {
    loadScoreAPI(`?action=get_standings&league_id=${queryId}`, (err, result) => {
        if (err) return console.log(err)

        console.log(result.data)
    })
}

let getEvents = (query) => {
    loadScoreAPI(`?action=get_events&=${query}`, (err, result) => {
        if (err) return console.log(err)

        console.log(result.data)
    })
}


let getOdds = (query) => {
    loadScoreAPI(`?action=get_odds&=${query}`, (err, result) => {
        if (err) return console.log(err)

        console.log(result.data)
    })
}

let getHeadtoHead = (query, firstTeam, secondTeam) => {
    loadScoreAPI(`?action=get_H2H&=${query}&firstTeam=${firstTeam}&secondTeam=${secondTeam}`, (err, result) => {
        if (err) return console.log(err)

        console.log(result.data)
    })
}

let getLiveScores = () => {
    loadScoreAPI(`?action=get_events&live_match=1`, (err, result) => {
        if (err) return console.log(err)

        console.log(result.data)
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
    getLiveScores: getLiveScores
}