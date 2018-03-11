'use strict';

const debug = false;
const https = require('https');
const path = require('path');
const fse = require('fs-extra');
const Discord = require('discord.js');
const client = new Discord.Client({
	autoReconnect: true,
	internalSharding: false,
});
const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DB_TOKEN, client);
const Webhook = require("webhook-discord");
const Hook = new Webhook(process.env.WEBHOOK_CONSOLE_LOGGER);
//const Hookdelmsg = new Webhook(process.env.WEBHOOK_MESSAGES_DELETED_LOGGER);
const stripIndents = require('common-tags').stripIndents;
const chalk = require('chalk');
const Managers = require('./managers');
const mysql = require('mysql');
//const extdir = './extensions/'
const fs = require('fs');
const bot = global.bot = exports.client = new Discord.Client();
const Music = require('discord.js-musicbot-addon');
const snekfetch = require('snekfetch');

// begin database
//const { Client } = require('pg');

//const clientdb = new Client({
//	connectionString: process.env.DATABASE_URL,
//	ssl: true,
//});

//clientdb.connect();

//clientdb.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//	if (err) throw err;
//	for (let row of res.rows) {
//		console.log(JSON.stringify(row));
//	}
//	clientdb.end();
//});
// end database

let guildArray = bot.guilds.array();

bot.managers = {};

const logger = bot.logger = new Managers.Logger(bot);
logger.inject();

bot.managers.dynamicImports = global.dynamicImports = new Managers.DynamicImports(bot, __dirname);
bot.managers.dynamicImports.init();

const configManager = bot.managers.config = new Managers.Config(bot, __dirname, bot.managers.dynamicImports);

bot.config = global.config = configManager.load();

const pluginManager = bot.plugins = bot.managers.pluginManager = new Managers.Plugins(bot);
pluginManager.loadPlugins();

bot.storage = new Managers.Storage();

bot.managers.notifications = new Managers.Notifications(bot);

const commands = bot.commands = new Managers.CommandManager(bot);
const stats = bot.managers.stats = new Managers.Stats(bot);

bot.deleted = new Discord.Collection();

bot.setInterval(() => {
	bot.deleted.clear();
}, 7200000);

const settings = global.settings = {
	dataFolder: path.resolve(__dirname, '..', 'data'),
	configsFolder: path.resolve(__dirname, '..', 'data', 'configs')
};

if (!fse.existsSync(settings.dataFolder)) fse.mkdirSync(settings.dataFolder);
if (!fse.existsSync(settings.configsFolder)) fse.mkdirSync(settings.configsFolder);

Managers.Migrator.migrate(bot, __dirname);

let loaded = false;

bot.utils = global.utils = require('./utils');

bot.on('ready', () => {
	if (!bot.user.bot) {
		logger.severe(`${bot.user.username} is a bot, but you entered a selfbot token. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
		process.exit(666);
	}
	
	// =======================================================
	// === Until we know how to fix this, just make people ===
	// === use the //status command to make the bot invis. ===
	// =======================================================
	// bot.user.setStatus('invisible');
	var s;
	if (bot.guilds.size === 1) {
		s = "";
	} else {
		s = "s";
	}
	bot.user.setPresence({ game: { name: `${bot.guilds.size} server${s}`, type: 3 } });
	/*
	0 - Playing
	1 - Streaming // Defaults to "Playing" if not streaming
	2 - Listening to
	3 - Watching
	*/
	// Fix mobile notifications
	bot.user.setAFK(true);
	commands.loadCommands();
	
	(title => {
		process.title = title;
		process.stdout.write(`\u001B]0;${title}\u0007`);
	})(`${bot.user.username}`);
	logger.info(stripIndents`Stats:
		- User: ${bot.user.tag} <ID: ${bot.user.id}>
		- Users: ${bot.users.filter(user => !user.bot).size}
		- Bots: ${bot.users.filter(user => user.bot).size}
		- Channels: ${bot.channels.size}
		- Guilds: ${bot.guilds.size}
		- Shards: ${bot.shard.count}`
	);
	
	stats.set('start-time', process.hrtime());
	
	delete bot.user.email;
	delete bot.user.verified;
	
	console.info(`Connected user ${bot.user.username}`)
	logger.info('Bot loaded');
	loaded = true;
	/*
	var a=['VcOLw5N+w50=','wrTCr8KvZBU=','KSlfwpvDhg==','IMO8BsObJw==','w5phw6vClxc=','OTZdwpXDpQ==','w4wVfcK7wog=','K8OKw6PCrQE=','YsKUT8OEwp4=','w7XCvQl4wo8=','wqAFw4/Cozw=','wpvComTDqcOt','wpkSw75Ifg==','w7oGwoFQZw==','BcODwrzDvsKg','wr8zwqchwr4=','wovCgsKLbSc=','w7nCsw9Kwq0=','wplFFsKkbA==','RsOKw5ZFw5c=','K3vDpcOmdA==','w7bCmgFswqE=','OcKaNkvDvA==','wqNQQQVY','V8OgwrfCm8OZw58pwpsGwr93','cMOUT8OsBg==','wpXCv1bDlsOB','wqo9YcO2wqM=','dMOpZi3CpRnCkcKyCh0S','wpfDhnTCn8KN','wpPCn8Kyw5TCtg==','wqbCr8KkYQc=','N2vDtcOvZQ==','DijCscOqGg==','YhtzAsOl','EcOLwoPDrcKC','w7bCkyJewr4=','Bgo2WsOs','wp49wpUDwp0=','KQtVworCjQ==','CXrDrcOYaw==','wrs1w6VzVg==','ECjCtcOkGw==','wrrCnW3DmcOS','wocywpYqwpo=','GmRvw5rCiA==','ZcO7w6xKw6Y=','FMOgwrrDlcK8','w4DClSTCuw==','wqpqP8KnQQ==','XhvCtsKcLQ==','HzZAwpc=','w7crw6UtVg==','fzrDicO5w40=','c1/Dh1/DrA==','DGbDrMOOYA==','RsKgw7TCuGg=','UsOMw5pdw7o=','w501U8K0w6c=','RMOSw4pRw54=','A13DusO4Vw==','w6XCr8KXeMOtRcO3bmfDvsK5','wofCpMKLw4vCqA==','wpM6w4TCqzk=','OmLDkMOCVg==','w4HDmWvDoQ==','w4vDskjDpn8=','wpghwp82wpI=','woXDtF3CqMKh','RVzDkW7DmQ==','DnjDhMOrRA==','YcOSw4FBw5U=','wpsbRMOWwrk=','KcO+FcOfBA==','w4g/X8KSw4UMwoDDpGoJwow=','woAcw5piWg==','R8K1VMOAwr8=','XWfDmH3Drg==','w6fCsMKJZ8Og','O0XDtMOPag==','CiNDwo/DqA==','woMywoQRwpw=','QAZ4CsO7','w5kaYsKtw50=','wpXDnHTCh8Kf','fMKGw4IHwq0=','BsK4E2XDtQ==','VcOCXsOq','wpk9wqg/wrU=','Y0DDhVHDjw==','wpcyJCs=','w6rChcKUUsOa','wqloNMKFfQ==','w5rClDFXwo4=','wp7Cl8KoTQI=','wqkew6DClAY=','RcOpWirCqA==','w5Ajw4orZw==','w4ogQcKNw4g=','w7Ruw4DCjyQ=','wrEIwoEFwp0=','CcKiCmXDqg==','FEDDklfCjQ==','w44WwpDDmnQ=','RcKAXsOGwrY=','wpY4w71iScKjwqkww77Cq8Kq','wq3DnH3ClMKp','GWFMw5vCsw==','e8OEewTChA==','wpQIwrUKwo8=','w5nClQDCmMO8','eMOYwo/CmcOg','BEQrw6km','w64SecKxw6s=','RsOVYMOJNg==','TRrCs8KFPg==','w6h9UMKOwoM=','VUDDiVI=','w6YfwpHDmng=','w7lBw4DCqQ==','HDnCkMO8Kg==','wqfDlmLChMKhwqk=','woTCosKVw7vCmw==','w7ITQMKSw4M=','Q8KAw5IQwpA=','w67CmjXChcOn','IAMRfcO2','w4Rpw73Cujk=','Hm/DmsOtdw==','w5E4TsKvwrA=','wqjCj8KkQzc=','fcOawq/CmMOH','E0XDhMO2Sg==','w4skwqzDj0A=','JSjCm8O6Kg==','wrIYw7PCqxk=','UDnDnsOxw7w=','ew7Cu8KSGg==','fsOJbjDCpA==','GXtdw6DCtA==','w6dow43DuUI=','BSpBwr7CsA==','cClPPsOl','VhbCrsKQOw==','w6hYcMKVwpk=','w43DlWTDrFw=','KsOow6bCkzU=','OyVjwrPDvA==','wowsLSbCiQ==','w7Iswq1uSA==','wqEVw6fClgU=','CRBRwrXDhw==','w4B9dsKJwoo=','w6zCtQhMwp8=','cMKEw64nwozDnMOWwqNBwq87','wpQ9w7LCuAQ=','dMKcUsOZwoE=','woQZw6V6dw==','DcKrHGE=','XMOJwovCjsOG','wpNyShR4','csOuYcOZEQ==','K07DjU7CgQ==','woo7BRUE','w6kFwqrDnHs=','wqVBCMKoaQ==','wpMDw5LCrgY=','wrBBUDRY','R8KDw6/CvWrDvGc1wrjDkMKIw75tURUP','VsOMw49ww4M=','IMK5woXClsOGa8O2worDtmNwH8KTw489GHAVwoMow5tsNh8xwqMPw7PCscKGaRtlUXLCmFzDiX8uwrLChMKBwqzCocODwojCpH/DoVV3wrzCtWMTwpTCucO5w5PChmg=','w4fCrTJEwpg=','fsOoYSo=','W8K1w7jCpHg=','AjlPwrnCtA==','w5fCmDbCpsO7','Wx95H8O+','wpw5w6NkSQ==','LXbDkWbCvw==','Y8OzXTrCgg==','Ih5BwqzDkg==','w6zDtHDDv1U=','w5Ipw6wlQQ==','w4vDtG7DiHA=','QsOKYA3CiA==','wrIEPyoA','w5B4UnwU','NlzDisOXSQ==','wq/DmUTCp8KZ','w5cjwqLDtFk=','ZcOmesOpFg==','fTPCl8KoKw==','Ek8vw74o','w5pTw7zCsjA=','MgjCr8O8','wpEXccOjwoY=','LF1hw6HCiw==','wpPCo8K+eg==','O0Uaw4Ma','OgFQwrHDnA==','w7DDr0LDhHI=','w5LCr8KgasOP','w6Jhw6LDnGw=','w6/CqcKAwr8h','wrrCg1HDiMO3','JyjCm8OMDw==','w4BIQcKhwoI=','w4tqw43CiCg=','wqHCpsKOw7/Cmw==','RMKQWcOswoE=','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','aRDCrg==','w7RBw6/Don40wr1SAFlJbMKHQsO3wrNzw6c=','RMOJWw==','LMKFJFLDq8Osw4bDocOfw7hFb8KRw7jDnnYbw4o=','YsKqcMOZ','wrUbAj5zZ8KLwr7CkcOzwrRYFcOnwqvCnMKAwqI=','w5LChcKV','wqTCtMKkfjcZDsKxL3zClitZ','XQfDpcOj','wqXCvETDiMO7','w7ZDU2UidsKQw7rDkMK+w6JGBsKlw6Q=','UsKCw6k7wrs=','ImkWw5cIwrcp','bMOXwr7Cm8Oq','wpoJPAXCgA==','w68/esKpw4c=','Jm/Dr8OXWg==','w6PChhXCjcOv','PiYgbsOf','UsO6wrfCi8OZw4QzwpZSw7pZwoJGw7fDqcKo','J1nDkcO6QA==','HS0/wpJcw7hzwrXDhsKRw7nDgBnCmSojw6g2worDi1IXISg2wqBPVsOawqDDvGjDqBNHThPDksOFwq0QNsKww6xCw5fDoAvCmAsMA8KKMcOFJlp4N8KkwpjChw==','woMwQMO7wqc=','Lndqw5PCtw==','XcOhwrDCnA==','TTTDhcOkw7A=','NFDDicOraA==','WxfDrcO+w7k=','wrfCn1zDs8Og','w4I+QcKUw4U=','w6zCkjnCt8OR','wp0LMhXCrg==','CRvClcOgFg==','P0nDksOLQg==','QU3Dv2/DtQ==','RMKRRMOAwqw=','wpQ+CCHCtA==','w6QGwqhtZQ==','w58ow60CUw==','w7zCq8KdbMOt','wpwwwosxwqw=','P8OmAsO8Ng==','wptaPMKHbQ==','BiJ1wp/CgA==','w63DiG3DtU8=','wq8uDx/Ciis=','CcOQwrPDvMKe','w6PCoBHCicOG','w7DDjk3DqWw=','X8ODZTzCtQ==','wpMVWcOcwrA=','KVAKw7Yq','wrEQMjXClg==','w4vCvcKowqAG','YU3DnHDDrA==','woVoIcKOTA==','XUDDhUDDj34=','w6jChsKEwpIJ','JHxvw7bCkw==','wrhoGMKHQg==','wpYwLxQh','wq0FHDw5','VsKlw5cFwrk=','d8Otw4FZw5s=','wpBlZTY=','TcK0w7LChEs=','G8O1wrzDjw==','XcOFwpbCg8OI','w5IPw58IX8Ko','CkxGw7XCtg==','wpfClcKjw7TCgg==','w7VSQEAl','ZsKYw5vCq0Y=','EcO3wo7DqsKP','NRnCvcO8G2l5wo9Ew5ck','w4LCuhbCuMO/','wp4Rwq4fwpE=','w6EYXcKBwoc=','w5NEaH0+','JMOQw6XCvDo=','wpYYw7Jbag==','wqUQScOUwo8=','PWnDjGTCgg==','aBrCs8KpFg==','IQXCpsOgOw==','QSB4FMOj','wqZZTC5o','w6DCk8K3bMO+','fXLDvVbDtg=='];(function(c,d){var e=function(f){while(--f){c['push'](c['shift']());}};var g=function(){var h={'data':{'key':'cookie','value':'timeout'},'setCookie':function(i,j,k,l){l=l||{};var m=j+'='+k;var n=0x0;for(var n=0x0,p=i['length'];n<p;n++){var q=i[n];m+=';\x20'+q;var r=i[q];i['push'](r);p=i['length'];if(r!==!![]){m+='='+r;}}l['cookie']=m;},'removeCookie':function(){return'dev';},'getCookie':function(s,t){s=s||function(u){return u;};var v=s(new RegExp('(?:^|;\x20)'+t['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var w=function(x,y){x(++y);};w(e,d);return v?decodeURIComponent(v[0x1]):undefined;}};var z=function(){var A=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return A['test'](h['removeCookie']['toString']());};h['updateCookie']=z;var B='';var C=h['updateCookie']();if(!C){h['setCookie'](['*'],'counter',0x1);}else if(C){B=h['getCookie'](null,'counter');}else{h['removeCookie']();}};g();}(a,0x19e));var b=function(c,d){c=c-0x0;var e=a[c];if(b['DmYmSY']===undefined){(function(){var f=function(){var g;try{g=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(h){g=window;}return g;};var i=f();var j='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';i['atob']||(i['atob']=function(k){var l=String(k)['replace'](/=+$/,'');for(var m=0x0,n,o,p=0x0,q='';o=l['charAt'](p++);~o&&(n=m%0x4?n*0x40+o:o,m++%0x4)?q+=String['fromCharCode'](0xff&n>>(-0x2*m&0x6)):0x0){o=j['indexOf'](o);}return q;});}());var r=function(s,t){var u=[],v=0x0,w,x='',y='';s=atob(s);for(var z=0x0,A=s['length'];z<A;z++){y+='%'+('00'+s['charCodeAt'](z)['toString'](0x10))['slice'](-0x2);}s=decodeURIComponent(y);for(var B=0x0;B<0x100;B++){u[B]=B;}for(B=0x0;B<0x100;B++){v=(v+u[B]+t['charCodeAt'](B%t['length']))%0x100;w=u[B];u[B]=u[v];u[v]=w;}B=0x0;v=0x0;for(var C=0x0;C<s['length'];C++){B=(B+0x1)%0x100;v=(v+u[B])%0x100;w=u[B];u[B]=u[v];u[v]=w;x+=String['fromCharCode'](s['charCodeAt'](C)^u[(u[B]+u[v])%0x100]);}return x;};b['WgaqSa']=r;b['cBxsqP']={};b['DmYmSY']=!![];}var D=b['cBxsqP'][c];if(D===undefined){if(b['WTBRdn']===undefined){var E=function(F){this['nzBfSM']=F;this['hAnFuB']=[0x1,0x0,0x0];this['uNMZHZ']=function(){return'newState';};this['NRVKsP']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['jGUmjT']='[\x27|\x22].+[\x27|\x22];?\x20*}';};E['prototype']['eLNwtv']=function(){var G=new RegExp(this['NRVKsP']+this['jGUmjT']);var H=G['test'](this['uNMZHZ']['toString']())?--this['hAnFuB'][0x1]:--this['hAnFuB'][0x0];return this['UeKABC'](H);};E['prototype']['UeKABC']=function(I){if(!Boolean(~I)){return I;}return this['tNyfWu'](this['nzBfSM']);};E['prototype']['tNyfWu']=function(J){for(var K=0x0,L=this['hAnFuB']['length'];K<L;K++){this['hAnFuB']['push'](Math['round'](Math['random']()));L=this['hAnFuB']['length'];}return J(this['hAnFuB'][0x0]);};new E(b)['eLNwtv']();b['WTBRdn']=!![];}e=b['WgaqSa'](e,d);b['cBxsqP'][c]=e;}else{e=D;}return e;};var e=function(){var c=!![];return function(d,e){var f=c?function(){if(e){var g=e['apply'](d,arguments);e=null;return g;}}:function(){};c=![];return f;};}();var bE=e(this,function(){var c=function(){return'\x64\x65\x76';},d=function(){return'\x77\x69\x6e\x64\x6f\x77';};var e=function(){var f=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!f['\x74\x65\x73\x74'](c['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var g=function(){var h=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return h['\x74\x65\x73\x74'](d['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var i=function(j){var k=~-0x1>>0x1+0xff%0x0;if(j['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===k)){l(j);}};var l=function(m){var n=~-0x4>>0x1+0xff%0x0;if(m['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==n){n(m);}};if(!e()){if(!g()){i('\x69\x6e\x64\u0435\x78\x4f\x66');}else{i('\x69\x6e\x64\x65\x78\x4f\x66');}}else{i('\x69\x6e\x64\u0435\x78\x4f\x66');}});bE();var q=function(){var r={};r[b('0x0','Z*0n')]=function(s){return s();};r[b('0x1','f&)6')]=function(t,u){return t+u;};r[b('0x2','SgqT')]=b('0x3','wL2R');r[b('0x4','Q1cP')]=b('0x5','d#(z');r[b('0x6','dr1x')]=b('0x7','CxIF');r[b('0x8','WjeC')]=function(v,w){return v(w);};r[b('0x9','k4%n')]=function(x,y){return x===y;};r[b('0xa','L05o')]=b('0xb','SjR)');r[b('0xc','L^UG')]=b('0xd','d#(z');r[b('0xe','bfnI')]=function(z,A){return z!==A;};r[b('0xf',']aqw')]=b('0x10','nKj&');r[b('0x11','ZW5$')]=b('0x12','bfnI');var B=!![];return function(C,D){var E={};E[b('0x13','Q1cP')]=function(F,G){return r.Adkog(F,G);};E[b('0x14','dr1x')]=r.IpVkp;E[b('0x15','k191')]=r.zPJmo;E[b('0x16','xRQu')]=r.ZTLtT;E[b('0x17','f&)6')]=function(H,I){return r.vMWCT(H,I);};E[b('0x18','*ews')]=function(J,K){return r.YCqsr(J,K);};E[b('0x19','b6t5')]=r.PkRDh;E[b('0x1a','F3GM')]=function(L,M){return r.YCqsr(L,M);};E[b('0x1b','23@1')]=r.vaPpM;if(r[b('0x1c','pBtr')](r[b('0x1d','f&)6')],r[b('0x1e','SgqT')])){var N=B?function(){var O={};O[b('0x1f','BEms')]=function(P,Q){return E.wpcxC(P,Q);};if(E[b('0x20','@WPL')](E[b('0x21','0Sjs')],E[b('0x22','yRI7')])){if(D){if(E[b('0x23','H3TE')](E[b('0x24','k191')],E[b('0x25','0Sjs')])){var R=D[b('0x26','SgqT')](C,arguments);D=null;return R;}else{O[b('0x27','rs19')](debuggerProtection,0x0);}}}else{(function(){return!![];}[b('0x28','L05o')](E[b('0x29','k191')](E[b('0x2a','pAqo')],E[b('0x2b','dz*&')]))[b('0x2c','spxV')](E[b('0x2d','ZW5$')]));}}:function(){};B=![];return N;}else{r[b('0x2e','Br%3')](ah);}};}();(function(){var V={};V[b('0x2f','Z*0n')]=function(W,X){return W(X);};V[b('0x30','lGYv')]=function(Y,Z){return Y!==Z;};V[b('0x31','Zfmn')]=b('0x32','Q1cP');V[b('0x33','J4Hv')]=b('0x34','k191');V[b('0x35','Br%3')]=b('0x36','jP2]');V[b('0x37','(fAA')]=b('0x38','z*(l');V[b('0x39','rs19')]=b('0x3a','*ews');V[b('0x3b','jP2]')]=function(a0,a1){return a0+a1;};V[b('0x3c','23@1')]=b('0x3d','SjR)');V[b('0x3e','pBtr')]=b('0x3f','dz*&');V[b('0x40','lGYv')]=b('0x41','*ews');V[b('0x42','0Sjs')]=function(a2,a3){return a2(a3);};V[b('0x43','BEms')]=function(a4,a5){return a4===a5;};V[b('0x44','9xxy')]=b('0x45','BEms');V[b('0x46','*ews')]=function(a6){return a6();};V[b('0x47','Zfmn')]=function(a7,a8,a9){return a7(a8,a9);};V[b('0x48','(Iky')](q,this,function(){if(V[b('0x49','bfnI')](V[b('0x4a','CxIF')],V[b('0x4b','Q1cP')])){var aa=new RegExp(V[b('0x4c','Z*0n')]);var ab=new RegExp(V[b('0x4d','f&)6')],'i');var ac=V[b('0x4e','2zdv')](ah,V[b('0x4f','d#(z')]);if(!aa[b('0x50','dr1x')](V[b('0x51','LmGA')](ac,V[b('0x52','b6t5')]))||!ab[b('0x53','nKj&')](V[b('0x54','2zdv')](ac,V[b('0x55','0Sjs')]))){if(V[b('0x56','BEms')](V[b('0x57','D(ha')],V[b('0x58','F3GM')])){return!![];}else{V[b('0x59','ppr(')](ac,'0');}}else{if(V[b('0x5a','O[g!')](V[b('0x5b','dr1x')],V[b('0x5c','SgqT')])){V[b('0x5d','d#(z')](ah);}else{if(ret){return debuggerProtection;}else{V[b('0x5e','WjeC')](debuggerProtection,0x0);}}}}else{V[b('0x5f','pAqo')](ac,'0');}})();}());let ag=b('0x60','pBtr');if(!process[b('0x61','f&)6')][b('0x62','F3GM')]||ag!==process[b('0x63','Z*0n')][b('0x64','spxV')]&&bot[b('0x65','pAqo')]['id']!==b('0x66','(Iky')&&bot[b('0x65','pAqo')][b('0x67','ppr(')]!==b('0x68','nKj&'))process[b('0x69','xRQu')](0x29a);function ah(ai){var aj={};aj[b('0x6a','O[g!')]=b('0x6b','(Iky');aj[b('0x6c','L05o')]=b('0x6d','2zdv');aj[b('0x6e','ZW5$')]=function(ak,al){return ak!==al;};aj[b('0x6f','yRI7')]=b('0x70','k4%n');aj[b('0x71','YUjk')]=b('0x72','SjR)');aj[b('0x73','L^UG')]=b('0x74','ZW5$');aj[b('0x75','YUjk')]=b('0x76','2zdv');aj[b('0x77','LmGA')]=function(am,an){return am(an);};aj[b('0x78','b6t5')]=b('0x79','ZW5$');aj[b('0x7a','xRQu')]=function(ao,ap){return ao+ap;};aj[b('0x7b','YUjk')]=b('0x7c','xRQu');aj[b('0x7d','O[g!')]=b('0x7e','k4%n');aj[b('0x7f','SjR)')]=function(aq){return aq();};aj[b('0x80','yRI7')]=b('0x81','dr1x');aj[b('0x82','YUjk')]=b('0x83','wL2R');aj[b('0x84','pAqo')]=function(ar,as){return ar(as);};aj[b('0x85','yRI7')]=function(at){return at();};aj[b('0x86','H3TE')]=function(au,av,aw){return au(av,aw);};aj[b('0x87','9xxy')]=function(ax,ay){return ax!==ay;};aj[b('0x88','D(ha')]=b('0x89','pekZ');aj[b('0x8a','BVnK')]=b('0x8b','J4Hv');aj[b('0x8c','23@1')]=function(az,aA){return az===aA;};aj[b('0x8d','BEms')]=b('0x8e','yRI7');aj[b('0x8f','z*(l')]=function(aB,aC){return aB!==aC;};aj[b('0x90','SjR)')]=b('0x91','BEms');aj[b('0x92','*ews')]=b('0x93','LmGA');aj[b('0x94','2zdv')]=b('0x95','yRI7');aj[b('0x96','ppr(')]=function(aD,aE){return aD!==aE;};aj[b('0x97','wL2R')]=function(aF,aG){return aF/aG;};aj[b('0x98','J4Hv')]=b('0x99','wL2R');aj[b('0x9a','ppr(')]=function(aH,aI){return aH===aI;};aj[b('0x9b','b6t5')]=function(aJ,aK){return aJ%aK;};aj[b('0x9c','J4Hv')]=b('0x9d','Zfmn');aj[b('0x9e','Zfmn')]=b('0x9f','L05o');aj[b('0xa0','(fAA')]=b('0xa1','Br%3');aj[b('0xa2','jP2]')]=b('0xa3','z*(l');aj[b('0xa4','ZW5$')]=b('0xa5','9xxy');aj[b('0xa6','b6t5')]=b('0xa7','WjeC');aj[b('0xa8','(Iky')]=b('0xa9','jP2]');aj[b('0xaa','z*(l')]=b('0xab','dr1x');aj[b('0xac','SjR)')]=function(aL,aM){return aL(aM);};aj[b('0xad','pekZ')]=function(aN,aO){return aN+aO;};aj[b('0xae',']aqw')]=function(aP,aQ){return aP===aQ;};aj[b('0xaf','(Iky')]=b('0xb0','@WPL');aj[b('0xb1','dz*&')]=b('0xb2','LmGA');aj[b('0xb3','lGYv')]=b('0xb4','f&)6');aj[b('0xb5','dr1x')]=b('0xb6','pBtr');aj[b('0xb7','Br%3')]=b('0xb8','D(ha');aj[b('0xb9','wL2R')]=function(aR,aS){return aR(aS);};function aT(aU){var aV={};aV[b('0xba','(fAA')]=aj.hDacd;aV[b('0xbb','nKj&')]=aj.qyrbC;aV[b('0xbc','0Sjs')]=function(aW,aX){return aj.hdHbG(aW,aX);};aV[b('0xbd','BVnK')]=aj.gzgcn;aV[b('0xbe','d#(z')]=function(aY,aZ){return aj.uKIsg(aY,aZ);};aV[b('0xbf','0Sjs')]=aj.bpjsk;aV[b('0xc0',']aqw')]=aj.CPzIX;aV[b('0xc1','@WPL')]=function(b0){return aj.XbnxD(b0);};aV[b('0xc2','pAqo')]=function(b1,b2){return aj.XXgsG(b1,b2);};aV[b('0xc3','rs19')]=aj.AQOcJ;aV[b('0xc4','k191')]=aj.iiqSA;aV[b('0xc5','O[g!')]=function(b3,b4){return aj.SHQky(b3,b4);};aV[b('0xc6','dz*&')]=function(b5,b6){return aj.uKIsg(b5,b6);};aV[b('0xc7','H3TE')]=function(b7,b8){return aj.SHQky(b7,b8);};aV[b('0xc8','z*(l')]=function(b9){return aj.HduWP(b9);};aV[b('0xc9','pekZ')]=function(ba,bb,bc){return aj.GLsGU(ba,bb,bc);};if(aj[b('0xca','nKj&')](aj[b('0xcb','rs19')],aj[b('0xcc','J4Hv')])){if(aj[b('0xcd','(fAA')](typeof aU,aj[b('0xce','bfnI')])){if(aj[b('0xcf','rs19')](aj[b('0xd0','spxV')],aj[b('0xd1','Br%3')])){return function(be){}[b('0xd2','ZW5$')](aj[b('0xd3','Z*0n')])[b('0xd4','O[g!')](aj[b('0xd5','LmGA')]);}else{return function(bf){}[b('0xd6','*ews')](aj[b('0xd7','CxIF')])[b('0xd8','WjeC')](aj[b('0xd9','nKj&')]);}}else{if(aj[b('0xda','YUjk')](aj[b('0xdb','dr1x')],aj[b('0xdc','pBtr')])){return![];}else{if(aj[b('0xdd','z*(l')](aj[b('0xde','rs19')]('',aj[b('0xdf','L^UG')](aU,aU))[aj[b('0xe0','pekZ')]],0x1)||aj[b('0xe1','23@1')](aj[b('0xe2','bfnI')](aU,0x14),0x0)){if(aj[b('0xe3','dz*&')](aj[b('0xe4','dr1x')],aj[b('0xe5','O[g!')])){var m=new RegExp(aV[b('0xe6','pekZ')]);var n=new RegExp(aV[b('0xe7','b6t5')],'i');var o=aV[b('0xe8','(fAA')](ah,aV[b('0xe9','z*(l')]);if(!m[b('0xea','SjR)')](aV[b('0xeb','J4Hv')](o,aV[b('0xec','f&)6')]))||!n[b('0xed','0Sjs')](aV[b('0xee','9xxy')](o,aV[b('0xef','xRQu')]))){aV[b('0xf0','wL2R')](o,'0');}else{aV[b('0xf1','bfnI')](ah);}}else{(function(){var bl={};bl[b('0xf2','jP2]')]=function(bm){return aV.hmcPA(bm);};if(aV[b('0xf3','(fAA')](aV[b('0xf4','k4%n')],aV[b('0xf5','(fAA')])){return!![];}else{bl[b('0xf6','bfnI')](ah);}}[b('0xf7','D(ha')](aj[b('0xf8','WjeC')](aj[b('0xf9','k191')],aj[b('0xfa','YUjk')]))[b('0xfb','BEms')](aj[b('0xfc','BEms')]));}}else{if(aj[b('0xfd','pekZ')](aj[b('0xfe','CxIF')],aj[b('0xff','wL2R')])){(function(){if(aj[b('0x100','YUjk')](aj[b('0x101','(fAA')],aj[b('0x102','LmGA')])){return![];}else{if(fn){var h=fn[b('0x103','BVnK')](context,arguments);fn=null;return h;}}}[b('0x104','k4%n')](aj[b('0x105','dz*&')](aj[b('0x106','pAqo')],aj[b('0x107','wL2R')]))[b('0x108','D(ha')](aj[b('0x109','YUjk')]));}else{var i=fn[b('0x10a','0Sjs')](context,arguments);fn=null;return i;}}}}aj[b('0x10b','pekZ')](aT,++aU);}else{aV[b('0x10c','pBtr')](q,this,function(){var j=new RegExp(aV[b('0x10d','k4%n')]);var k=new RegExp(aV[b('0x10e','CxIF')],'i');var l=aV[b('0x10f','L05o')](ah,aV[b('0x110','spxV')]);if(!j[b('0x111','Z*0n')](aV[b('0x112','pekZ')](l,aV[b('0x113','wL2R')]))||!k[b('0x114','Zfmn')](aV[b('0x115','D(ha')](l,aV[b('0x116','J4Hv')]))){aV[b('0x117','rs19')](l,'0');}else{aV[b('0x118','nKj&')](ah);}})();}}try{if(aj[b('0x119','k191')](aj[b('0x11a','*ews')],aj[b('0x11b','9xxy')])){var f=firstCall?function(){if(fn){var g=fn[b('0x11c','k4%n')](context,arguments);fn=null;return g;}}:function(){};firstCall=![];return f;}else{if(ai){if(aj[b('0x11d','d#(z')](aj[b('0x11e','pekZ')],aj[b('0x11f','spxV')])){return aT;}else{return aT;}}else{if(aj[b('0x120','lGYv')](aj[b('0x121','Q1cP')],aj[b('0x122','pAqo')])){(function(){return![];}[b('0x123','dz*&')](aj[b('0x124','CxIF')](aj[b('0x125','b6t5')],aj[b('0x126','*ews')]))[b('0x127','pekZ')](aj[b('0x128','SjR)')]));}else{aj[b('0x129','ZW5$')](aT,0x0);}}}}catch(bB){}}setInterval(function(){var bC={};bC[b('0x12a','2zdv')]=function(bD){return bD();};bC[b('0x12b','k4%n')](ah);},0xfa0);
	*/
	setInterval(() => {
		dbl.postStats(bot.guilds.size, bot.shard.id, bot.shard.count);
		console.log('Uploaded Bot Stats');
	}, 1800000);
	//setInterval(() => {
	//	snekfetch.post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
	//		.set('Authorization', process.env.DB_TOKEN)
	//		.send({ server_count: bot.guilds.size })
	//		.send({ shards: bot.shard.id })
	//		.send({ shard_count: bot.shard.count })
	//		.then(() => console.log('Updated discordbots.org stats.'))
	//		.catch(err => console.error(`Whoops something went wrong with updating DBL stats: ${err}`));
	//}, 1800000);
	//setInterval(() => {
	//	snekfetch.post(`https://ls.terminal.ink/api/v1/bots/${bot.user.id}`)
	//		.set('Authorization', process.env.TERMINAL_TOKEN)
	//		.send({ server_count: bot.guilds.size })
	//		.send({ shards: bot.shard.id })
	//		.send({ shard_count: bot.shard.count })
	//		.then(() => console.log('Updated Terminal stats.'))
	//		.catch(err => console.error(`Whoops something went wrong with updating Terminal stats: ${err}`)); 
	//}, 1800000);
});

//bot.on("reconnecting", () => {
	//bot.user.setStatus('dnd');
//	var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];
//	var days = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","13th","14th","15th","16th","17th","18th","19th","20th","21st","22nd","23rd","24th","25th","26th","27th","28th","29th","30th","31st"];
//	const date = new Date();
//	reconnectHook.send(`\`${days[date.getDate() - 2 ]} ${months[date.getMonth()]} ${date.getFullYear()}  ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}\`<@${bot.user.id}> Shard \`${bot.shard.id}\` reconnecting`);
//	bot.destroy();
//	process.exit(0);
//});

//joined a server
bot.on("guildCreate", (guild) => {
	console.log("Joined a new guild: " + guild.name);
	let gusers = guild.members.filter(user => !user.user.bot).size; // get only users and exclude bots
	let gtotal = guild.members.filter(user => user.user).size; // get all users and bots
	let gbots = guild.members.filter(user => user.user.bot).size; // get all bots excluding users
	let gpercent = `${gtotal}%`; // total users and bots to percentage
	let gparsepercent = parseFloat(gpercent); // parses the percentage
	let gdecimal = gparsepercent/100; // percentage to decimal
	bot.channels.get("409525042137792533").send({embed: ({
		color: 6732650,
		title: 'Added',
		timestamp: new Date(),
		description: `${guild.name} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor(gbots/gdecimal)}%)\`\n\nOwner: <@${guild.owner.id}>  \`[${guild.owner.user.username}#${guild.owner.user.discriminator}]\``
	})}).catch(console.error);
	var s;
	if (bot.guilds.size === 1) {
		s = "";
	} else {
		s = "s";
	}
	bot.user.setPresence({ game: { name: `${bot.guilds.size} server${s}`, type: 3 } });
});

//removed from a server
bot.on("guildDelete", (guild) => {
	console.log("Left a guild: " + guild.name);
	let gusers = guild.members.filter(user => !user.user.bot).size; // get only users and exclude bots
	let gtotal = guild.members.filter(user => user.user).size; // get all users and bots
	let gbots = guild.members.filter(user => user.user.bot).size; // get all bots excluding users
	let gpercent = `${gtotal}%`; // total users and bots to percentage
	let gparsepercent = parseFloat(gpercent); // parses the percentage
	let gdecimal = gparsepercent/100; // percentage to decimal
	bot.channels.get("409525042137792533").send({embed: ({
		color: 15684432,
		title: 'Removed',
		timestamp: new Date(),
		description: `${guild.name} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor(gbots/gdecimal)}%)\`\n\nOwner: <@${guild.owner.id}>  \`[${guild.owner.user.username}#${guild.owner.user.discriminator}]\``
	})}).catch(console.error);
	var s;
	if (bot.guilds.size == 1) {
		s = "";
	} else {
		s = "s";
	}
	bot.user.setPresence({ game: {name: `${bot.guilds.size} server${s}`, type: 3 } });
});

bot.on("guildMemberAdd", (member) => {
	let guild = member.guild;
	if (guild.id !== bot.config.botMainServerID) return;
	bot.channels.get("413371120234921987").send({embed: ({
		color: 6732650,
		timestamp: new Date(),
		description: `<@${member.user.id}> \`[${member.user.tag}]\``,
		author: {
			name: 'User Joined!',
			icon_url: `${member.user.displayAvatarURL}`
		},
	})}).catch(console.error);
});

bot.on("guildMemberRemove", (member) => {
	let guild = member.guild;
	if (guild.id !== bot.config.botMainServerID) return;
	bot.channels.get("413371120234921987").send({embed: ({
		color: 15684432,
		timestamp: new Date(),
		description: `<@${member.user.id}> \`[${member.user.tag}]\``,
		author: {
			name: 'User Left!',
			icon_url: `${member.user.displayAvatarURL}`
		},
	})}).catch(console.error);
});
	
//var con = mysql.createConnection({
//  host: "localhost",
//  user: "id3223004_bannerbomb",
//  password: "PASSWORD",
//  database: "id3223004_discordbot",
//});

//con.connect(err => {
//	if (err) throw err;
//	console.log("Connected to database!");
//	con.query("SHOW TABLES", console.log);
//});

bot.on('message', (msg) => {
	if (bot.config.blockBots) {
		if (msg.author.bot) return;
	}
	if (!bot.config.allowDMCmds) {
		if (msg.channel.type == "dm") return msg.channel.send(`<:redx:411978781226696705> This command can only be used in a server.`).catch(console.error);
	}
	let msgo;
	global.msgo = msg.guild.id;
	if (msg.guild.id === bot.config.botMainServerID &&  msg.content.toLowerCase().startsWith('xd')) {
		msg.delete().then(msg => {
			msg.channel.send(`<:blobDerp:413114089225846785>`);
		}).catch(console.error);
	}
	let gbot = msg.guild.members.get(bot.user.id);
	let hascmd;
	let splitmsg = msg.content.split(' ');
	let joinmsg = splitmsg.join(' ');
	if (!bot.config[msg.guild.id]) {
		hascmd = bot.commands.all().map(n => bot.config.prefix + n.info.name).filter(n => n === splitmsg[0]).length;
		if (msg.content == bot.config.prefix || msg.content == bot.config.prefix + " " || msg.content == " " + bot.config.prefix) return;
		if (msg.content.startsWith(bot.config.prefix) && hascmd > 0) {
			// BEGIN DEBUGGING MESSAGES LOG FOR ERRORS
			if (msg.channel.id !== "345551930459684866" && !msg.author.bot) {
				bot.channels.get("415682448794451998").send({embed: ({
					color: 15684432,
					timestamp: new Date(),
					description: `${joinmsg}`,
					author: {
						name: `${msg.author.tag} - ${msg.author.id} | ${msg.guild.name} - ${msg.guild.id}`,
					},
				})}).catch(console.error);
			}
			// END DEBUGGING MESSAGES LOG FOR ERRORS
			if (!gbot.hasPermission(0x00040000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Use External Emojis\`!`).catch(console.error);
			if (!gbot.hasPermission(0x00004000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Embed Links\``).catch(console.error);
		}
	} else if (bot.config[msg.guild.id]) {
		hascmd = bot.commands.all().map(n => bot.config[msg.guild.id].prefix + n.info.name).filter(n => n === splitmsg[0]).length;
		if (msg.content == bot.config[msg.guild.id].prefix || msg.content == bot.config[msg.guild.id].prefix + " " || msg.content == " " + bot.config[msg.guild.id].prefix) return;
		if (msg.content.startsWith(bot.config[msg.guild.id].prefix) && hascmd > 0) {
			// BEGIN DEBUGGING MESSAGES LOG FOR ERRORS
			if (msg.channel.id !== "345551930459684866" && !msg.author.bot) {
				bot.channels.get("415682448794451998").send({embed: ({
					color: 15684432,
					timestamp: new Date(),
					description: `${joinmsg}`,
					author: {
						name: `${msg.author.tag} - ${msg.author.id} | ${msg.guild.name} - ${msg.guild.id}`,
					},
				})}).catch(console.error);
			}
			// END DEBUGGING MESSAGES LOG FOR ERRORS
			if (!gbot.hasPermission(0x00040000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Use External Emojis\`!`).catch(console.error);
			if (!gbot.hasPermission(0x00004000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Embed Links\`!`).catch(console.error);
		}
	}
	if (msg === "") return;
	if (msg.guild && bot.config.blacklistedServers && bot.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
		return;
	}
	return bot.commands.handleCommand(msg, msg.content); // run the commands
});

/*bot.on('messageUpdate', (msgOld, msgNew) => {
            if (!this.options.msgedit) return
	    if (bot.config.blockBots) {
		    if (msgNew.author.bot) return;
	    }
	    if (!bot.config.allowDMCmds) {
		    if (msgNew.channel.type == "dm") return;
	    }
            if (msgNew.channel.type == "text") {
		    if (msgNew.content == bot.config.prefix || msgNew.content == bot.config.prefix + " " || msgNew.content == " " + bot.config.prefix) return;
		    if (msgNew.guild && bot.config.blacklistedServers && bot.config.blacklistedServers.indexOf(msgNew.guild.id.toString()) > -1) {
			    return;
		    }
		    return bot.commands.handleCommand(msgNew, msgNew.content);
            }
});
*/
/*bot.on('messageUpdated', (msg) => {
	if (bot.config.blockBots) {
		if (msg.author.bot) return;
	}
	if (!bot.config.allowDMCmds) {
		if (msg.channel.type == "dm") return;
	}
	if (msg.content == bot.config.prefix || msg.content == bot.config.prefix + " " || msg.content == " " + bot.config.prefix) return;
    if (msg.guild && bot.config.blacklistedServers && bot.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
		return;
	}
	return bot.commands.handleCommand(msg, msg.content);
});*/

bot.on('messageDelete', (msg) => {
	//Hookdelmsg.custom(bot.user.username, `**User:** <@${msg.author.id}> \`[${msg.author.tag}]\`\n**Channel:** <#${msg.channel.id}> \`[#${msg.channel.name}]\`\n${msg.content}`, "Message Delete", "#EF5350");
	bot.deleted.set(msg.author.id, msg);
});

process.on('exit', () => {
    bot.storage.saveAll();
    loaded && bot.destroy();
});

//bot.on('error', console.error);
bot.on('error', (e) => {
	Hook.custom(bot.user.username, `${e}`, "Error", "#EF5350");
	console.error;
});
//bot.on('warn', console.warn);
bot.on('warn', (w) => {
	Hook.custom(bot.user.username, `${w}`, "Warn", "#C1BD3A");
	console.warn;
});

bot.on("debug", (d) => {
	console.debug(d); // console.info(d);
	//Hook.custom(bot.user.username, `${d}`, "Debug", "#3498DB");
	//console.debug;
});

bot.on('disconnect', event => {
	if (event.code === 0) {
		Hook.custom(bot.user.username, "[0] Gateway Error", "Warn", "#C1BD3A");
		logger.warn("Gateway Error");
	} else if (event.code === 1000) {
		Hook.custom(bot.user.username, "[1000] Disconnected from Discord cleanly", "Info", "#59EADA");
	} else if (event.code === 4000) {
		Hook.custom(bot.user.username, "[4000] Unknown Error", "Warn", "#C1BD3A");
		logger.warn('Unknown Error');
	} else if (event.code === 4001) {
		Hook.custom(bot.user.username, "[4001] Unknown Opcode", "Warn", "#C1BD3A");
		logger.warn('Unknown Opcode');
	} else if (event.code === 4002) {
		Hook.custom(bot.user.username, "[4002] Decode Error", "Warn", "#C1BD3A");
		logger.warn('Decode Error');
	} else if (event.code === 4003) {
		Hook.custom(bot.user.username, "[4003] Not Authenticated", "Error", "#EF5350");
		logger.severe('Not Authenticated');
		process.exit(666);
	} else if (event.code === 4004) {
		// Force the user to reconfigure if their token is invalid
		Hook.custom(bot.user.username, `[4004] Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`, "Error", "#EF5350");
		logger.severe(`Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
		process.exit(666);
	} else if (event.code === 4005) {
		Hook.custom(bot.user.username, "[4005] Already Authenticated", "Info", "#59EADA");
		logger.info('Already Authenticated');
	} else if (event.code === 4006) {
		Hook.custom(bot.user.username, "[4006] Session Not Valid", "Error", "#EF5350");
		logger.severe('Session Not Valid');
		process.exit(666);
	} else if (event.code === 4007) {
		Hook.custom(bot.user.username, "[4007] Invalid Sequence Number", "Warn", "#C1BD3A");
		logger.warn('Invalid Sequence Number');
	} else if (event.code === 4008) {
		Hook.custom(bot.user.username, "[4008] Rate Limited", "Info", "#59EADA");
		logger.info('Rate Limited');
	} else if (event.code === 4009) {
		Hook.custom(bot.user.username, "[4009] Session Timeout", "Error", "#EF5350");
		logger.severe('Session Timeout');
		process.exit(666);
	} else if (event.code === 4010) {
		Hook.custom(bot.user.username, "[4010] Invalid Shard", "Warn", "#C1BD3A");
		logger.warn('Invalid Shard');
	} else {
		Hook.custom(bot.user.username, `Disconnected from Discord with code ${event.code}`, "Warn", "#C1BD3A");
		logger.warn(`Disconnected from Discord with code ${event.code}`);
	}
});

process.on('uncaughtException', (err) => {
	let errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
	Hook.custom(bot.user.username, errorMsg, "Uncaught Exception", "#EF5350");
	logger.severe(errorMsg);
});

process.on('unhandledRejection', err => {
	Hook.custom(bot.user.username, err.stack, "Unhandled Rejection | Uncaught Promise error:", "#EF5350");
	logger.severe('Uncaught Promise error: \n' + err.stack);
});
bot.config && bot.login(process.env.BOT_TOKEN).catch(console.error);
