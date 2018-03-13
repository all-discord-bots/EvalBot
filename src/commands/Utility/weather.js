// http://www.engageweb.co.uk/css-weather-display
// https://www.webdesignerdepot.com/2012/12/how-to-harness-yahoos-weather-api/
const got = require('got');
const countries = require('country-data').countries.all;

const makeURL = (city) => `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(city)}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
const celsius = (fahrenheit) => Math.round(((fahrenheit - 32) * 5) / 9);

const spacer = {
    name: '\u200b',
    value: '\u200b',
};
// TODO: Collect weather emojis for use with  name: `Forecast for today is ${EMOJI HERE} *${forecast.text}*`,
exports.run = async (bot, msg, args) => {
    if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Please provide a city.`).catch(console.error);

    const city = args.join(' ');
    const res = await got(makeURL(city), { json: true });

    if (!res || !res.body || !res.body.query || !res.body.query.results || !res.body.query.results.channel) return msg.channel.send(`<:redx:411978781226696705> Failed to load weather info!`).catch(console.error);

    const weatherInfo = res.body.query.results.channel;
    const unit = weatherInfo.units;
    const forecast = weatherInfo.item.forecast[0];

    const countryInfo = countries.find(country => country.name === weatherInfo.location.country);
    const countryEmoji = countryInfo ? countryInfo.emoji : ':grey_question:';

    const description = `The current temperature in ${weatherInfo.location.city} is ${weatherInfo.item.condition.temp}°${unit.temperature}/${celsius(weatherInfo.item.condition.temp)}°C`;
//item":{"title":"Conditions for Wilson, NC, US at 03:00 PM EDT","lat":"35.72171","long":"-77.916153"
    const embed = bot.utils.embed(`${countryEmoji} ${weatherInfo.item.title}`, description, [
        {
            name: 'Location',
            value: `Latitude: ${weatherInfo.item.lat}\nLongitude: ${weatherInfo.item.long}`
        },
        {
            name: 'Condition',
            value: `${weatherInfo.item.condition.text}`
        },
        {
            name: 'Atmosphere',
            value: `Humidity: ${weatherInfo.atmosphere.humidity}${unit.humidity}\nPressure: ${weatherInfo.atmosphere.pressure}${unit.pressure}\nRising: ${weatherInfo.atmosphere.rising}\nVisibility: ${weatherInfo.atmosphere.visibility}`
        },
        {
            name: ':wind_blowing_face: Wind',
            value: `*${weatherInfo.wind.speed}${unit.speed}* ; direction: *${weatherInfo.wind.direction}°* ; chill: *${weatherInfo.wind.chill}*`
        },
        {
            name: `Forecast for today is *${forecast.text}*`,
            value: `Highest temp is ${forecast.high}°${unit.temperature}/${celsius(forecast.high)}°C, lowest temp is ${forecast.low}°${unit.temperature}/${celsius(forecast.low)}°C`,
        },
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
