var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
require("dotenv").config();

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

// User input variables
var command = process.argv[2];
var userChoice = process.argv[3];


// *****TWITTER***** //
// Show last 20 tweets 
function getTweets() {
    var params = {
        screen_name: "KyloRenSwoloBen",
        tweet_mode: "extended",
        count: 20,
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log((i + 1) + " " + tweets[i].full_text);
            }
            //   console.log(tweets[0]);
        } else {
            console.log(error);
        }
    });
};


// *****SPOTIFY***** //
function spotifyThis() {
    if (userChoice === undefined) {
        userChoice = "The Sign"; // default song if nothing is input
    }
    console.log("Searching... " + userChoice);
    spotify.search({ type: 'track', query: userChoice }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            console.log("Song Title: " + data.tracks.items[0].name);
            console.log("Artists: " + data.tracks.items[0].artists[0].name);
            console.log("Preview: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
    });
};


// *****OMDB***** //
function movieThis() {
    if (userChoice === undefined) {
        userChoice = "Mr. Nobody"; // default movie if nothing is input
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userChoice + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Movie Title:  " + JSON.parse(body).Title);
            console.log("Year Released: " + JSON.parse(body).Year);
            console.log("IMDB Rating:  " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value)
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }

    });
}


// *****DO WHAT IT SAYS***** //
function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var splitter = data.split(","); // splits on "," => gives back array
        userChoice = splitter[1];
        console.log(splitter[0]);
        commandChoices(splitter[0]);
    });
};


// Input command choices
function commandChoices(command) {
    switch (command) {
        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}
commandChoices(command);


// *****LOG TO TEXT***** //
fs.appendFile("log.txt", `${process.argv[3]}\n`, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The log has been updated!");
  
  });