const got = require('got');
const countries = require('country-data').countries.all;

const makeURL = (city) => `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(city)}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
const celsius = (fahrenheit) => Math.round(((fahrenheit - 32) * 5) / 9);

const spacer = {
    name: '\u200b',
    value: '\u200b',
};

exports.run = async (bot, msg, args) => {
    if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Please provide a city.`).catch(console.error);

    const city = args.join(' ');
    const res = await got(makeURL(city), { json: true });

    if (!res || !res.body || !res.body.query || !res.body.query.results || !res.body.query.results.channel) return msg.channel.send(`<:redx:411978781226696705> Failed to load weather info!`).catch(console.error);

    const weatherInfo = res.body.query.results.channel;
    const forecast = weatherInfo.item.forecast[0];
    const forecasttmrw = weatherInfo.item.forecast[1];
    const forecastdaytwo = weatherInfo.item.forecast[2];
    const forecastdaythree = weatherInfo.item.forecast[3];
    const forecastdayfour = weatherInfo.item.forecast[4];
    const forecastdayfive = weatherInfo.item.forecast[5];
    const forecastdaysix = weatherInfo.item.forecast[6];
    const forecastdayseven = weatherInfo.item.forecast[7];
    const forecastdayeight = weatherInfo.item.forecast[8];
    const forecastdaynine = weatherInfo.item.forecast[9];
    const countryInfo = countries.find(country => country.name === weatherInfo.location.country);
    const countryEmoji = countryInfo ? countryInfo.emoji : ':grey_question:';
    
    const description = `The current temperature in ${weatherInfo.location.city} is ${weatherInfo.item.condition.temp}°F/${celsius(weatherInfo.item.condition.temp)}°C`;
// finish 6-9
    const embed = bot.utils.embed(`${countryEmoji} ${weatherInfo.item.title}`, description, [
        {
            name: 'Condition',
            value: weatherInfo.item.condition.text
        }, {
            name: 'Humidity',
            value: weatherInfo.atmosphere.humidity + '%'
        }, {
            name: 'Pressure',
            value: weatherInfo.atmosphere.pressure
        }, {
            name: 'Rising',
            value: weatherInfo.atmosphere.rising
        }, {
            name: 'Visibility',
            value: weatherInfo.atmosphere.visibility
        }, {
            name: ':wind_blowing_face: Wind',
            value: `*${weatherInfo.wind.speed}mph* ; direction: *${weatherInfo.wind.direction}°* ; chill: *${weatherInfo.wind.chill}*`
        }, {
            name: `Forecast for today is *${forecast.text}*`,
            value: `Highest temp is ${forecast.high}°F/${celsius(forecast.high)}°C, lowest temp is ${forecast.low}°F/${celsius(forecast.low)}°C ; Code: ${forecast.code}`,
        },
        spacer,
        spacer,
        {
            name: '9 Day Forecast',
            value: `__Today:__\n
                    Code: ${forecast.code}\n
                    Date: ${forecast.date}\n
                    Day: ${forecast.day}\n
                    High: ${forecast.high}\n
                    Low: ${forecast.low}\n
                    Condition: ${forecast.text}\n\n
                    __Tomorrow:__\n
                    Code: ${forecasttmrw.code}\n
                    Date: ${forecasttmrw.date}\n
                    Day: ${forecasttmrw.day}\n
                    High: ${forecasttmrw.high}\n
                    Low: ${forecasttmrw.low}\n
                    Condition: ${forecasttmrw.text}\n\n
                    __${forecastdaytwo.day}:__\n
                    Code: ${forecastdaytwo.code}\n
                    Date: ${forecastdaytwo.date}\n
                    Day: ${forecastdaytwo.day}\n
                    High: ${forecastdaytwo.high}\n
                    Low: ${forecastdaytwo.low}\n
                    Condition: ${forecastdaytwo.text}\n\n
                    __${forecastdaythree.day}:__\n
                    Code: ${forecastdaythree.code}\n
                    Date: ${forecastdaythree.date}\n
                    Day: ${forecastdaythree.day}\n
                    High: ${forecastdaythree.high}\n
                    Low: ${forecastdaythree.low}\n
                    Condition: ${forecastdaythree.text}\n\n
                    __${forecastdayfour.day}:__\n
                    Code: ${forecastdayfour.code}\n
                    Date: ${forecastdayfour.date}\n
                    Day: ${forecastdayfour.day}\n
                    High: ${forecastdayfour.high}\n
                    Low: ${forecastdayfour.low}\n
                    Condition: ${forecastdayfour.text}\n\n
                    __${forecastdayfive}:__\n
                    Code: ${forecastdayfive.code}\n
                    Date: ${forecastdayfive.date}\n
                    Day: ${forecastdayfive.day}\n
                    High: ${forecastdayfive.high}\n
                    Low: ${forecastdayfive.low}\n
                    Condition: ${forecastdayfive.text}\n\n
                    `},
        spacer,
        spacer,
        spacer,
        spacer,
        {
            name: ':sunrise: Sunrise',
            value: weatherInfo.astronomy.sunrise
        },
        {
            name: ':city_sunset: Sunset',
            value: weatherInfo.astronomy.sunset
        }
    ], { inline: true });

    msg.channel.send({ embed });
};

exports.info = {
    name: 'weather',
    usage: 'weather <city>',
    description: 'Shows weather info for city'
};
