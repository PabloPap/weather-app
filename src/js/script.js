
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

window.jQuery = require("jquery");
(function ($) {
    "use strict";
    var city,
        startDate,
        days = [],
        screenDays = [],
        dayArr = ["O", "Q", "R", "W", "M", "B", "H", "N", "Y"],
        nightArr = [6, 7, 8, "#", "M", 2, 4, 5, "%"],
        loc,
        lon,
        lat,
        sunrise,
        sunset,
        i,
        firstProm,
        secondProm,
        targetDate,
        timestamp,
        apikey,
        apicall,
        currentTime,
        currentDate,
        currentWeatherData,
        nextWeatherData,
        currentTemp,
        curMinTemp,
        minTemp,
        maxTemp,
        nextWeatherId,
        weatherId,
        weatherDescr,
        nextWeatherDescr,
        mediaQ;
    $(function () {
        setTimeout(function () {
            $(".page-1").fadeOut(300, "linear", function () {
                $(".page-2").show(800);
            });
        }, 3000);

        function location(city) {
            $("body").css({
                "background": "#A870FF",
                "transition": "background-color 1000ms  linear"
            });

            currentWeatherData = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric" + "&appid=ea53bb76f9e5a55e649e51aacc8573c0";
            nextWeatherData = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&units=metric" + "&appid=ea53bb76f9e5a55e649e51aacc8573c0";

            function complete() {
                // promise variables
                firstProm = $.get(currentWeatherData);
                secondProm = $.get(nextWeatherData);

                // get weather data and apply them to client
                $.when(firstProm, secondProm).done(function (data1, data2) {
                    // get coordinates from openweather api
                    lon = data1[0].coord.lon;
                    lat = data1[0].coord.lat;
                    // build google's timezone api call link
                    loc = lat + "," + lon;
                    targetDate = new Date();
                    timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
                    apikey = "AIzaSyDXGeDJClz4nrKDZPf8FbhvIQzR5_1YSfk";
                    apicall = "https://maps.googleapis.com/maps/api/timezone/json?location=" + loc + "&timestamp=" + timestamp + "&key=" + apikey;

                    $.getJSON(apicall, function (data) {
                        $(".page-3").show(800);

                        function toMeteocons(code, iconArr, weathDescr, idx) {
                            if (code >= 200 && code <= 232) {
                                $(".ic" + idx).attr("data-icon", iconArr[0]);
                            } else if (code >= 300 && code <= 321) {
                                $(".ic" + idx).attr("data-icon", iconArr[1]);
                            } else if (code >= 500 && code <= 531) {
                                $(".ic" + idx).attr("data-icon", iconArr[2]);
                            } else if (code >= 600 && code <= 622) {
                                $(".ic" + idx).attr("data-icon", iconArr[3]);
                            } else if (code >= 701 && code <= 781) {
                                $(".ic" + idx).attr("data-icon", iconArr[4]);
                            } else if (code >= 800 && code <= 804) {
                                switch (code) {
                                    case 800:
                                        $(".ic" + idx).attr("data-icon", iconArr[5]);
                                        break;
                                    case 801:
                                        $(".ic" + idx).attr("data-icon", iconArr[6]);
                                        break;
                                    case 802:
                                        $(".ic" + idx).attr("data-icon", iconArr[7]);
                                        break;
                                    case 803:
                                        $(".ic" + idx).attr("data-icon", iconArr[8]);
                                        break;
                                    case 804:
                                        $(".ic" + idx).attr("data-icon", iconArr[8]);
                                        break;
                                }
                            } else if (code >= 900 && code <= 962) {
                                $(".ic" + idx).append("<h4>" + weathDescr + "</h4>");
                            }
                        }

                        function getDays(startDate, nextDays) {
                            days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                            for (i = 0; i <= nextDays; i += 1) {
                                currentDate = new Date();
                                currentDate.setDate(startDate.getDate() + i);
                                screenDays.push(days[currentDate.getDay()]);
                                $(".day" + i).append(screenDays[i]);
                            }
                        }

                        function time(day, night) {
                            currentDate = new Date(timestamp * 1000 + data.dstOffset * 1000 + data.rawOffset * 1000);
                            currentTime = currentDate.getTime();
                            // daytime or nightime icon for current day
                            if (currentTime < day) {
                                toMeteocons(weatherId, nightArr, weatherDescr, 0);
                            } else if (currentTime >= day && currentTime <= night) {
                                toMeteocons(weatherId, dayArr, weatherDescr, 0);
                            } else if (currentTime > night) {
                                toMeteocons(weatherId, nightArr, weatherDescr, 0);
                            }
                        }
                        // -------------- CURRENT WEATHER ----------------

                        // show current and the next 5 days in client
                        startDate = new Date();
                        screenDays = getDays(startDate, 5);
                        // current weather data
                        currentTemp = data1[0].main.temp.toFixed(0);
                        curMinTemp = data2[0].list[0].temp.min.toFixed(0);
                        sunrise = data1[0].sys.sunrise * 1000;
                        sunset = data1[0].sys.sunset * 1000;
                        weatherId = data1[0].weather[0].id;
                        weatherDescr = data1[0].weather[0].description;
                        // apply temperatures and city
                        $(".city").append(city);
                        $(".curTemp").append(currentTemp + " &deg;C");
                        $(".curMinTemp").append(curMinTemp + " &deg;C");
                        // apply icon for day/night
                        time(sunrise, sunset);

                        // -------------- 5-DAY WEATHER FORECAST ----------------

                        for (i = 1; i < 6; i += 1) {
                            minTemp = data2[0].list[i].temp.min.toFixed(0);
                            maxTemp = data2[0].list[i].temp.max.toFixed(0);
                            nextWeatherId = data2[0].list[i].weather[0].id;
                            nextWeatherDescr = data2[0].list[i].weather[0].description;
                            $(".minTemp" + i).append(minTemp + " &deg;C");
                            $(".maxTemp" + i).append(maxTemp + " &deg;C");
                            toMeteocons(nextWeatherId, dayArr, nextWeatherDescr, i);
                        }
                    }).fail(function () {
                        // One of the sources is not available
                    });
                });
            }
            $(".page-2").fadeOut(300, "linear", complete);
        }
        // user click events
        $(".submit").on("click", function () {
            //get user's current location
            $.getJSON("https://ipapi.co/json/", function (data) {
                city = data.city;
                console.log(city);
                location(city);
            });
            $(this).off("click");
        });
        $(".button").on("click", function (event) {
            city = $(".get").val();
            location(city);
            $(this).off("click");
        });
        // side menu toggle
        mediaQ = function () {
            if (Modernizr.mq("(min-width: 320px)") && Modernizr.mq("(max-width: 479px)")) {
                $(".side-menu").css({
                    "width": "319px"
                });
            }
            if (Modernizr.mq("(min-width: 480px)") && Modernizr.mq("(max-width: 767px)")) {
                $(".side-menu").css({
                    "width": "200px"
                });
            } else if (Modernizr.mq('(min-width: 768px)') && Modernizr.mq("(max-width: 991px)")) {
                $(".side-menu").css({
                    "width": "250px"
                });
            } else if (Modernizr.mq('(min-width: 992px)') && Modernizr.mq("(max-width: 1199px)")) {
                $(".side-menu").css({
                    "width": "250px"
                });
            } else if (Modernizr.mq('(min-width: 1200px)')) {
                $(".side-menu").css({
                    "width": "350px"
                });
            }
        };

        $(".open-slider").on("click", function () {
            $(window).resize(mediaQ);
            mediaQ();
        });
        $(".btn-close").on("click", function () {
            $(".side-menu").css({
                "width": "0"
            });
        });
    });
}(jQuery));
