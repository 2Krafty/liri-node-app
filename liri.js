require("dotenv").config();

var keys = require('./keys');

var request = require('request');

var Spotify = require('node-spotify-api');

var moment = require('moment');

var spotify = new Spotify(keys.spotify);

var casePicker = process.argv[2]

var nodeArgs = process.argv;



for (var i = 3; i < nodeArgs.length; i++) { 

  if (3 === i) {
    search = " ";
    songSearch = " ";
    artist = " ";
  }
  var search = search + " " + nodeArgs[i];
  var songSearch = songSearch + " " + nodeArgs[i];
  var artist = artist + "" + nodeArgs[i];

}
switch (casePicker) {
  case "concert-this":
    bands();
    break;

  case "spotify-this-song":
    songs(songSearch);
    break;

  case "movie-this":
    movies();
    break;

  case "do-what-it-says":
    random();
    break;
}

function bands() {
  request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
    if (!error) {
      var parseBody = JSON.parse(body)

      for (var i = 0; i < parseBody.length; i++) {


        console.log('====================================================');
        console.log("Venue: " + parseBody[i].venue.name);
        console.log("Location: " + parseBody[i].venue.city + ", " + parseBody[i].venue.country);
        console.log("Date: " + moment(parseBody[i].datetime).format("MM-DD-YYYY"));
        console.log('====================================================');
      }

    }

  })
}

function movies() {
  request("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
    if (!error) {
      var parseBody = JSON.parse(body)


      console.log('====================================================')
      console.log("Title: " + parseBody.Title);
      console.log("Year: " + parseBody.Year);
      console.log("IMDb Rating: " + parseBody.imdbRating);
      console.log("Rotten Tomatoes Rating: " + parseBody.Ratings[1].Value);
      console.log("Production Country: " + parseBody.Country);
      console.log("Language: " + parseBody.Language);
      console.log("Plot: " + parseBody.Plot);
      console.log("Actors: " + parseBody.Actors);
      console.log('====================================================');

    }
  });
}

function songs(songSearch) {
  spotify.search({
    type: 'track',

    query: songSearch
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var result = data.tracks.items;

    result.forEach(res => {
      console.log('====================================================')
      console.log("Song: " + res.name)
      console.log("Artist: " + res.artists[0].name)
      console.log("Album: " + res.album.name)
      console.log("Link: " + res.href)
      console.log('====================================================')
    })
  });
}

function random() {
  var fs = require("fs");

  fs.readFile("random.txt", "utf8", function (error, data) {

    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");

    songs(dataArr[1])
  });

}