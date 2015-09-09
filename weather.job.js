var http = require('http');

// City of interest
var city = 'molndal,se';

// Name of weekdays
var weekdays = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

// Update interval ( # minutes)
var interval = 1;

function getWeatherData() {
    return http.get({
        host : 'api.openweathermap.org',
        path : '/data/2.5/forecast/daily?q=' + city + '&mode=json&units=metric&cnt=6'
    }, function(response) {
        if (response.statusCode == 200) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                // Data reception is done, do whatever with it!
                var parsed = JSON.parse(body);
                var weatherdata = [];

                for ( i = 0, len = parsed.list.length; i < len; i++) {
                    //console.log(JSON.stringify(parsed.list[i], null, 4));
                    weatherdata.push({
                        day : weekdays[new Date(parsed.list[i].dt * 1000).getDay()],
                        temp : (i == 0) ? parsed.list[i].temp.day.toFixed(1) + String.fromCharCode(8451) : parsed.list[i].temp.day.toFixed(0) + String.fromCharCode(8451),
                        image : '/' + parsed.list[i].weather[0].icon + '.png',
                        wind : parsed.list[i].speed.toFixed(1)
                    });
                }
                send_event('weather3', {
                    weatherdata : weatherdata
                });
            });
        } else {
            console.log("openweathermap return " + response.statusCode);
        }
    });
};

setInterval(function() { getWeatherData(); }, 60000 * interval);
getWeatherData();

