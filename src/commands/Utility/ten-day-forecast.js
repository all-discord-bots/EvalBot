const got = require('got');
const countries = require('country-data').countries.all;

const makeURL = (city) => `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(city)}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

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
    
    const embed = bot.utils.embed(`${countryEmoji} ${weatherInfo.item.title}`, `${weatherInfo.location.city} 10 day forecast.`, [
        {
            name: `__Today:__`,
            value: `Code: \`${forecast.code}\`\nDate: \`${forecast.date}\`\nDay: \`${forecast.day}\`\nHigh: \`${forecast.high}\`\nLow: \`${forecast.low}\`\nCondition: \`${forecast.text}\``
        }, {
            name: `__Tomorrow:__`,
            value: `Code: \`${forecasttmrw.code}\`\nDate: \`${forecasttmrw.date}\`\nDay: \`${forecasttmrw.day}\`\nHigh: \`${forecasttmrw.high}\`\nLow: \`${forecasttmrw.low}\`\nCondition: \`${forecasttmrw.text}\``
        }, {
            name: `__${forecastdaytwo.day}:__`,
            value: `Code: \`${forecastdaytwo.code}\`\nDate: \`${forecastdaytwo.date}\`\nDay: \`${forecastdaytwo.day}\`\nHigh: \`${forecastdaytwo.high}\`\nLow: \`${forecastdaytwo.low}\`\nCondition: \`${forecastdaytwo.text}\``
        }, {
            name: `__${forecastdaythree.day}:__`,
            value: `Code: \`${forecastdaythree.code}\`\nDate: \`${forecastdaythree.date}\`\nDay: \`${forecastdaythree.day}\`\nHigh: \`${forecastdaythree.high}\`\nLow: \`${forecastdaythree.low}\`\nCondition: \`${forecastdaythree.text}\``
        }, {
            name: `__${forecastdayfour.day}:__`,
            value: `Code: \`${forecastdayfour.code}\`\nDate: \`${forecastdayfour.date}\`\nDay: \`${forecastdayfour.day}\`\nHigh: \`${forecastdayfour.high}\`\nLow: \`${forecastdayfour.low}\`\nCondition: \`${forecastdayfour.text}\``
        }, {
            name: `__${forecastdayfive.day}:__`,
            value: `Code: \`${forecastdayfive.code}\`\nDate: \`${forecastdayfive.date}\`\nDay: \`${forecastdayfive.day}\`\nHigh: \`${forecastdayfive.high}\`\nLow: \`${forecastdayfive.low}\`\nCondition: \`${forecastdayfive.text}\``
        }, {
            name: `__${forecastdaysix.day}:__`,
            value: `Code: \`${forecastdaysix.code}\`\nDate: \`${forecastdaysix.date}\`\nDay: \`${forecastdaysix.day}\`\nHigh: \`${forecastdaysix.high}\`\nLow: \`${forecastdaysix.low}\`\nCondition: \`${forecastdaysix.text}\``
        }, {
            name: `__${forecastdayseven.day}:__`,
            value: `Code: \`${forecastdayseven.code}\`\nDate: \`${forecastdayseven.date}\`\nDay: \`${forecastdayseven.day}\`\nHigh: \`${forecastdayseven.high}\`\nLow: \`${forecastdayseven.low}\`\nCondition: \`${forecastdayseven.text}\``
        }, {
            name: `__${forecastdayeight.day}:__`,
            value: `Code: \`${forecastdayeight.code}\`\nDate: \`${forecastdayeight.date}\`\nDay: \`${forecastdayeight.day}\`\nHigh: \`${forecastdayeight.high}\`\nLow: \`${forecastdayeight.low}\`\nCondition: \`${forecastdayeight.text}\``
        }, {
            name: `__${forecastdaynine.day}:__`,
            value: `Code: \`${forecastdaynine.code}\`\nDate: \`${forecastdaynine.date}\`\nDay: \`${forecastdaynine.day}\`\nHigh: \`${forecastdaynine.high}\`\nLow: \`${forecastdaynine.low}\`\nCondition: \`${forecastdaynine.text}\``
        }
    ], { inline: true });

    msg.channel.send({ embed });
};

exports.info = {
    name: 'forecast',
    usage: 'forecast <city>',
    description: 'Shows the 10 day forecast for a city.'
};
