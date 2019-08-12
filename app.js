require("http").createServer(async (req,res) => { res.statusCode = 200; res.write("ok"); res.end(); }).listen(3000, () => console.log("Now listening on port 3000"));
const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");
const guildSettings = require("./guildsettings.json");
const changeLog = require("./changelog.json");
const jsonfile = require("jsonfile");
const http = require('http');
const request = require('request');

const $ = require("jquery")(require('jsdom-no-contextify').jsdom().parentWindow);

const bfdAPI = require('bfd-js-api');
const bfd = new bfdAPI(client, config.botsForDiscordToken, true, 900);
const DBL = require("dblapi.js");
const dbl = new DBL(config.discordBotsListToken, {statsInterval: 900000}, client);

const https = require('https');

const post = require('superagent');
const listOfRoasts = config.roasts;

const date = new Date();

var settings;
var roasts = require("./roasts.json");
var activityInt = 1;

var setTimeoutIDs = [];

client.on("ready", () => {
	//recreateSettings()
	/*request(
    {
        url : "https://discord.bots.gg/api/v1/bots/444694580894498816/stats",
		headers : {
            "Authorization" : config.discordBotsGGToken
        }
    },
    function (error, response, body) {
        // Do more stuff with 'body' here
		if(error != null)
			console.log(error)
		else{
			console.log(response)
			console.log(body)
		}
	}
);
	$.ajax({
		url: "https://discord.bots.gg/api/v1/bots/444694580894498816/stats",
		contentType: "application/json",
		type: "POST",
		headers: {
			"Authorization": config.discordBotsGGToken
		},
		data: {"guildCount": client.guilds.size},
		success: function(a) {
			console.log("success")
			console.log(a)
		},
		error: function(e) {
			console.log(e);
		}
	});
	

      const response = {
        raw: '',
        body: null,
        status: null,
        headers: null,
      };
	var data = {guildCount: client.guilds.size};
	var method = "post"
      const options = {
        hostname: 'https://discord.bots.gg/api/v1/bots/444694580894498816/stats',
        path: '',
        method: 'post',
        headers: {},
      };

    if (this.token) {
      options.headers.authorization = config.discordBotsGGToken;
    } else {
      console.warn('[dblapi.js] Warning: No DBL token has been provided.'); // eslint-disable-line no-console
    }
    if (data && method === 'post') options.headers['content-type'] = 'application/json';
    if (data && method === 'get') options.path += `?${qs.encode(data)}`;

    const request = https.request(options, res => {
        response.status = res.statusCode;
        response.headers = res.headers;
        response.ok = res.statusCode >= 200 && res.statusCode < 300;
        response.statusText = res.statusMessage;
        res.on('data', chunk => {
          response.raw += chunk;
        });
        res.on('end', () => {
          response.body = res.headers['content-type'].includes('application/json') ? JSON.parse(response.raw) : response.raw;
          if (response.ok) {
            resolve(response);
          } else {
            const err = new Error(`${res.statusCode} ${res.statusMessage}`);
            Object.assign(err, response);
            reject(err);
          }
        });

		request.on('error', err => {
			reject(err);
		});

		if (data && method === 'post') request.write(JSON.stringify(data));
		request.end();
	  });*/
	
	/*$.ajax({
		url: "https://mzz9x5fx61.execute-api.us-east-1.amazonaws.com/dev/shittalk/check-duplicate",
		contentType: "application/json; charset=utf-8",
		type: "POST",
		dataType: "json",
		data: JSON.stringify({submission: "fuck"}),
		success: function(n) {
			n.duplicate ? console.log("It is duplicate"): console.log("no duplicate")
		},
		error: function(e) {
			console.error(e)
		}
	})*/
	
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	settings = guildSettings;
	guilds = settings.guilds;
	for(var i = 0; i < guilds.length; i++){
		var channelsArray = guilds[i].channels;
		for(var j = 0; j < channelsArray.length; j++){
			if(channelsArray[j].settings.randomTimeInterval.value === "enable"){
				var delay = parseInt(channelsArray[j].settings.randomTimeInterval.date) - Date.now();
				const channelID = channelsArray[j].id;
				var tempI = i;
				var tempJ = j;
				if(delay < 0){
					console.log("CREATING NEW SETTIMEOUT")
					setTimeoutIDs.push(randomIntervalRoast(channelID, tempI, tempJ));
				}else{
					console.log("ROAST IN " + new Date(Date.now() + delay).toString())
			
					var timeOut = setTimeout(function(){
						const guildIndex = tempI;
						const channelIndex = tempJ;
						const id = channelID;
						const timeOutID = timeOut;
						const randRoast = settings.guilds[guildIndex].channels[channelIndex].settings.randomTimeInterval.value;
						var index = setTimeoutIDs.indexOf(timeOutID);
						if (index > -1) {
							setTimeoutIDs.splice(index, 1);
						}
						if(randRoast === "enable"){
							var randChance = Math.random();
							if (randChance < parseFloat(settings.guilds[guildIndex].channels[channelIndex].settings.randomTimeInterval.chance))
								roast(id, "randomInterval", null, settings.guilds[guildIndex].channels[channelIndex].settings.mention);
							setTimeoutIDs.push({"timeOut": randomIntervalRoast(id, guildIndex, channelIndex), "channel": id});
						}
					},delay);
					setTimeoutIDs.push({"timeOut": timeOut, "channel": channelID});
				}
			}
		}
	}
	var ver = changeLog[changeLog.length - 1].version;
	
	updateRoasts();
	setInterval(function (){updateRoasts()}, 5*1000*60);
	
	setInterval(function (){
		activityInt++;
		if(activityInt > 2)//<--------- CHANGE TO 3 ONCE WE GET A LOT OF SERVERS
			activityInt = 1;
		switch(activityInt){
			case 1: client.user.setActivity('with fire | V' + ver , {type: "PLAYING"}); break;
			case 2: client.user.setActivity('"!roast ?" for help', {type: "LISTENING"}); break;
			case 3: client.user.setActivity('${client.users.size} plebs' , {type: "WATCHING"}); break;
			default: break;
		}
	}, 20 * 1000);
    client.user.setActivity('with fire | v' + ver , {type: "PLAYING"});
    console.log("Charbot v" + ver + " is completed boot! Awaiting commands...");
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    var guildObj = {id: guild.id, channels: []};
    var allChannels = guild.channels.array();
    for(var i = 0; i < allChannels.length; i++){
	    guildObj.channels.push({id: allChannels[i].id, settings:{randomTimeInterval:{value:"disable", interval: 0, chance: 0, date: Date.now()}, mention: "disable"}});
    }
  
    settings.guilds.push(guildObj);
  
    /*var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
		console.log('added ' + guild.name + ' to guildsettings.json');
	});*/
	writeToFileCallback(settings, './guildsettings.json',  'added ' + guild.name + ' to guildsettings.json');
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  
    for(var i = 0; i < guilds.length; i++){
	    if(guild.id === settings.guilds[i].id){
		    settings.guilds.splice(i, 1);
		  
	    }
    }
  
	/*var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
		console.log('removed ' + guild.name + ' from guildsettings.json');
	});*/
	writeToFileCallback(settings, './guildsettings.json', 'removed ' + guild.name + ' from guildsettings.json');
});

client.on("channelCreate", channel => {
    if(channel.type != 'dm'){
		console.log(`I have been added to: ${channel.name} (id: ${channel.id})`);
		for(var i = 0; i < guilds.length; i++){
			console.log(channel)
			if(channel.guild.id == undefined) break;
			if(channel.guild.id === guilds[i].id){
				settings.guilds[i].channels.push({id: channel.id, settings:{randomTimeInterval:{value:"disable", interval: 0, chance: 0, date: Date.now()}, mention: "disable"}});
				break;
			}
		}
	  
		/*var writeBuffer = JSON.stringify(settings);
		var fs = require('fs');
		fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
			if (err) throw err;
			console.log('added ' + channel.name + ' to guildsettings.json');
		});*/
		
		writeToFileCallback(settings, './guildsettings.json', 'added ' + channel.name + ' to guildsettings.json');
	}
});

client.on("channelDelete", channel => {
    console.log(`I have been removed from: ${channel.name} (id: ${channel.id})`);
  
    for(var i = 0; i < guilds.length; i++){
		var channelsArray = guilds[i].channels;
		if(channel.guild.id === settings.guilds[i].id){
			for(var j = 0; j < channelsArray.length; j++){
				if(channel.id === channelsArray[j].id){
					settings.guilds[i].channels.splice(j, 1);
					break;
				}
			}
			break;
		}
    }
  
	/*var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
		console.log('removed ' + channel.name + ' to guildsettings.json');
	});*/
	writeToFileCallback(settings, './guildsettings.json', 'removed ' + channel.name + ' to guildsettings.json');
});

bfd.on('posted', (guildCount) => {
    console.log(`Success! Posted ${guildCount} Guilds to botsfordiscord.com`);
});
bfd.on('error', (err) => {
    console.log(`BFD has errored!\n${err}`);
});

dbl.on('posted', () => {
  console.log('Success! Posted ${guildCount} Guilds to discordbots.org');
})

dbl.on('error', e => {
 console.log(`DBL has errored!\n${e}`);
})

function recreateSettings(){
	var guildCollection = client.guilds;
	var listOfGuilds = [];
	for (let key of guildCollection)
		listOfGuilds.push(key);
	console.log(listOfGuilds)
	var guildsJSON = [];
	
	for(var i = 0; i < listOfGuilds.length; i++){
		var guildObj = {id: listOfGuilds[i][0], channels: []};
		var allChannels = listOfGuilds[i][1].channels.array();
		for(var j = 0; j < allChannels.length; j++){
			guildObj.channels.push({id: allChannels[j].id, settings:{randomTimeInterval:{value:"disable", interval: 0, chance: 0, date: Date.now()}, mention: "disable"}});
		}
		guildsJSON.push(guildObj);
	}
	
	var writeBuffer = JSON.stringify(guildsJSON);
	var fs = require('fs');
	
	fs.writeFile('./guildsettings.json.backup', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
	});
	
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
	});
}

function writeToFileCallback(array, path, callback){
	var writeBuffer = JSON.stringify(array);
	var fs = require('fs');
	
	fs.writeFile(path, writeBuffer, 'utf8', function(err) {
		if (err) throw err;
		console.log(callback);
	});
}

function writeToFile(array, path){
	var writeBuffer = JSON.stringify(array);
	var fs = require('fs');
	
	fs.writeFile(path, writeBuffer, 'utf8', function(err) {
		if (err) throw err;
	});
}


function updateRoasts(){
	$.ajax({
            url: "https://mzz9x5fx61.execute-api.us-east-1.amazonaws.com/dev/shittalk/all", //OLD LINK: https://daviseford.com/shittalk/php/controller/controller.php
            contentType: "application/json; charset=utf-8",
            type: "GET",
            dataType: "json",
            success: function(a) {
				array = a.data.random;
				for(var i = 0; i < array.length; i++){
					var item = array[i];
					var voteCount = item.net_votes;
					if(voteCount < 10)
						continue;
					var content = item.submission || "";
					var indexOfRepeat = binarySearch(roasts, content);
					if(indexOfRepeat < 0){
						for(var j = 0; j <= roasts.length; j++){
							if(j == roasts.length){
								roasts.push(item);
								break;
							}
							else if(content.localeCompare(roasts[j].submission) < 0){
								roasts.splice(j, 0, item);
								break;
							}
						}
					}else{
						roasts[indexOfRepeat] = item;
					}
				}
				
				writeToFileCallback(roasts, "./roasts.json", "Roast List Updated. Roast list has a size of " + roasts.length + ".");
			},
			error: function(a) {
                console.log(a)
            }
	});
}

function binarySearch(array, item){
	var l = 0; 
	var r = array.length - 1;
	while (l <= r){ 
		var m = l + (r - l) / 2;
		
		var res = item.localeCompare(array[Math.floor(m)].submission); 
		if (res == 0) 
			return m; 
		if (res > 0) 
			l = m + 1; 
		else
			r = m - 1; 
	}
	return -1; 
}

function getRoasts(channel, userid, hasMentions, isEveryone){
	var roastMsg = roasts[Math.floor(Math.random() * roasts.length)].submission;
	var embedMsg = {
		"title": roastMsg,
		"color": 0xff0000
	}
	var guildID = channel.guild.id;
	if(isEveryone){
		return embedMsg;
	}else{
		if(hasMentions === "enable")
			channel.send("<@" + userid + ">", {embed: embedMsg});
		else if(hasMentions === "disable"){
			var clientMapUsers = client.guilds.get(guildID).members;
			var listOfMembers = clientMapUsers.array();
			var msgName = "";
					
			var userObj = clientMapUsers.get(userid);
			
			if(userid === userObj.user.id){
				if(userObj.nickname == null){
					msgName = userObj.user.username;
				}else{
					msgName = userObj.nickname;
				}
			}
					
			channel.send(msgName, {embed: embedMsg});
		}
	}
}

client.on("message", async message => {
	var hasMentions = "disable";
	var hasRoastEveryone = "disable";
	
	var foundGuild = false;
	var foundChannel = false;
	
	if(message.author.bot) return;
	if(message.channel.type == 'dm') return;
	
	for(i = 0; i < settings.guilds.length; i++){
		if(message.guild.id === settings.guilds[i].id){
			foundGuild = true;
			for(var j = 0; j < settings.guilds[i].channels.length; j++){
				if(message.channel.id === settings.guilds[i].channels[j].id){
					foundChannel = true;
					hasMentions = settings.guilds[i].channels[j].settings.mention;
					hasRoastEveryone = settings.guilds[i].channels[j].settings.roastEveryone;
					break;
				}
			}
			break;
		}
	}
	
	if(!foundGuild){
		resetGuildSettings(message.channel.guild.id);
	}
	
	if(!foundChannel){
		resetChannelSettings(message.channel.id);
	}
	
	//Blacklist filter
	//for(i = 0; i < config.blacklist.length; i++){
	//	if(message.author.id === config.blacklist[i]){
	//		var responses = ["I think not...",
	//			"What makes you think I can listen to you?",
	//			"Well u pissin' me off. Suck it, BITCH!",
	//			"Hehe. I only serve those who respect me.",
	//			"You think you so powerful? Wait til you get your boot!",
	//			"Who came up with the idea to listen to you?"];
	//		
	//		var responseIndex = Math.floor(Math.random() * responses.length);
	//		message.channel.send("<@" + message.author.id + "> " + responses[responseIndex]);
	//		roast(message.channel.id, message.author.id, message.author.id, hasMentions);
	//		return;
	//	}
	//}
	
	//console.log(message.author.username + "#" + message.author.discriminator + ": " + message.content);
	//console.log("[" + message.guild.name + "]  " + message.author.username + "#" + message.author.discriminator + ": " + message.content);
	
	if(message.content.indexOf(config.prefix) !== 0){
		const args = message.content.split(" ");
		
		var hasResponded = false;
		
		var botMentioned = false;
		
		for(var i = 0; i < args.length; i++){
			if(args[i] === "<@" + config.id + ">"){
				botMentioned = true;
				break;
			}
		}
		
		var memberCount = message.channel.guild.memberCount;
		var clientMapUsers = message.channel.guild.members;//guild.member;//message.channel.guild.members;
		
		var listOfMembers = [];
		for (let key of clientMapUsers)
			listOfMembers.push(key);
		
		
		for(i = 0; i < args.length; i++){
			var tempString = args[i].toLowerCase();
			
			if(tempString === 'roast' && i + 1 !== args.length){
				const IDLENGTH = 18;
				if(args[i + 1] === "<@" + config.id + ">" || args[i + 1] === "yourself"){
					roast(message.channel.id, config.id, message.author.id, hasMentions);
					hasResponded = true;
				}else if(args[i + 1].toLowerCase() === "me"){
					if(botMentioned)
						message.channel.send("Got it! One well done <@" + message.author.id + ">...");
					roast(message.channel.id, message.author.id, message.author.id, hasMentions);
					hasResponded = true;
				}else if((args[i + 1].toLowerCase() === "everyone" && hasRoastEveryone === "enable") || args[i + 1].toLowerCase() === "random"){
					if(args[i + 1] === "random" && botMentioned)
						message.channel.send("As you wish, <@" + message.author.id + ">.");
					roast(message.channel.id, args[i + 1],	message.author.id, hasMentions);
					hasResponded = true;
				}else if(args[i + 1].toLowerCase() === "everyone" && hasRoastEveryone === "disable"){
					message.channel.send("Unfortunately, I am not allowed to spam this channel with roasts.");
					hasResponded = true;
				}else if((args[i + 1].toLowerCase().indexOf("<@") == 0 && args[i + 1].toLowerCase().indexOf(">") == args[i + 1].length - 1)){ //18 characters SHOULD be the id length. Otherwise, IDLENGTH + 2
					if(botMentioned)
						message.channel.send("As you wish, <@" + message.author.id + ">.");
					var startSubIndex = 2;
					if(args[i + 1].substring(0, 3) == "<@!")
						startSubIndex = 3;
					roast(message.channel.id, args[i + 1].substring(startSubIndex, args[i + 1].length - 1), message.author.id, hasMentions);
					hasResponded = true;
				}
				console.log("[" + message.guild.name + "]  " + message.author.username + "#" + message.author.discriminator + ": " + message.content);
			}
			if((tempString === 'help' || tempString === '?') && botMentioned){
				message.channel.send("Some assistance for you <@" + message.author.id + ">.");
				help(message);
				hasResponded = true;
			}
			for(var j = 0; j < config.greetings.length; j++){
				if(message.content.toLowerCase().indexOf(config.greetings[j]) != -1 && botMentioned){
					message.channel.send("<@" + message.author.id + "> I roast people for a living...");
					hasResponded = true;
				}
			}
			if(hasResponded)
				break;
		}
		
		if(!hasResponded && botMentioned){
			message.channel.send("<@" + message.author.id + ">! You summoned me! What is it that you request?");
			console.log("[" + message.guild.name + "]  " + message.author.username + "#" + message.author.discriminator + ": " + message.content);
		}
		return;
	}
	console.log("[" + message.guild.name + "]  " + message.author.username + "#" + message.author.discriminator + ": " + message.content);
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    if(command === "<@" + config.id + ">"){
		message.channel.send("Hmmmmm... So, <@" + message.author.id + "> thinks they can trick me... Hmmmmmmmmmmmmmmmmmmmmmmmm... I DON\'T THINK SO!! HAHA!");
		roast(message.channel.id, config.id, message.author.id, hasMentions);
    }else if(command.indexOf("<@") == 0 && command.indexOf(">") == command.length - 1){
	    var startSubIndex = 2;
	    if(command.substring(0, 3) == "<@!")
		    startSubIndex = 3;
	    roast(message.channel.id, command.substring(startSubIndex,command.length - 1), message.author.id, hasMentions);
    }else if((command === "everyone" && hasRoastEveryone === "enable") || command === "random"){
		roast(message.channel.id, command, message.author.id, hasMentions);
    }else if((command === "everyone" && hasRoastEveryone === "disable")){
		message.channel.send("Unfortunately, I am not allowed to spam this channel with roasts.");
	}
    if(command === "changelog"){
	    requestChangelog(message);
    }
    if(command === "settings"){
	    let hasKick = message.member.hasPermission("KICK_MEMBERS");
	    if(hasKick || message.author.id === config.owner){
			var guilds = settings.guilds;
			for(var i = 0; i < guilds.length; i++){
				if(guilds[i].id === message.channel.guild.id){
					var channels = guilds[i].channels;
					for(var j = 0; j < channels.length; j++){
						if(message.channel.id === channels[j].id){
							if(args.length == 0){
								settingsHelp(message, i, j);
							}else if(args[0] === "randomTimeInterval"){
								if(args.length == 1){
									if(channels[j].settings.randomTimeInterval.value === "enable"){
										plural = "s";
										if(channels[j].settings.randomTimeInterval.interval == 1)
											plural = "";
										message.channel.send("Intervals are set to " + channels[j].settings.randomTimeInterval.interval + " minute"+ plural +" with a " + (channels[j].settings.randomTimeInterval.chance * 100) + "% chance of roasting someone.");
									}else
										message.channel.send("Random interval roasting is disabled.");
								}else{
									//!roast settings randomTimeInterval disable
									//!roast settings randomTimeInterval enable <timeIntervalToCheck> <chanceofRoast>
									switch(args[1]){
										case "1": args[1] = "enable"; break;
										case "0": args[1] = "disable"; break;
										default: break;
									}
									if(args[1] === "disable" || args[1] === "enable"){
										var validCommand = true;
										var prevValue = channels[j].settings.randomTimeInterval.value;
										channels[j].settings.randomTimeInterval.value = args[1];
									
										if(args[1] === "enable"){
											var inputSettings = [30, 0.2]; //[minutes, probablility]
											for(var k = 0; k < inputSettings.length; k++){
												if(args.length > k + 2){
													var testInt = parseFloat(args[k + 2]);
													if(typeof testInt !== "number"){
														message.channel.send("<@" + message.author.id + "> These are invalid arguments! :angry:");
														validCommand = false;
														break;
													}
													inputSettings[k] = testInt;
												}
											}
											channels[j].settings.randomTimeInterval.interval = inputSettings[0];
											channels[j].settings.randomTimeInterval.chance = inputSettings[1];
											if(prevValue === "disable")
												setTimeoutIDs.push({"timeOut": randomIntervalRoast(message.channel.id, i, j), "channel": message.channel.id});
										}else if(args[1] === "disable"){
											for(var k = setTimeoutIDs.length - 1; k >= 0; k--){
												if(message.channel.id === setTimeoutIDs[k].channel){
													clearTimeout(setTimeoutIDs[k].timeOut);
													setTimeoutIDs.splice(k, 1);
												}
											}
										}else{
											message.channel.send("The arguments here are to \"enable\" or to \"disable\", not \"" + args[1] + "\".");
										}
										if(validCommand){
											if(prevValue === args[1]){
												message.channel.send("It seems that randomTimeInterval was already " + args[1] +"d.");
											}else{
												message.channel.send("randomTimeInterval is now " + args[1] + "d.");
											}
											
											/*var writeBuffer = JSON.stringify(settings);
											var fs = require('fs');
											fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
												if (err) throw err;
											});*/
											writeToFile(settings,'./guildsettings.json');
										}
									}
								}
							}else if(args[0] === "reset"){
								if(args.length < 2){
									message.channel.send("<@" + message.author.id + "> That is not enough arguments! Please, I don't know what you want to do!");
								}else if(args.length > 2){
									message.channel.send("<@" + message.author.id + "> That is too much information! Please remove some arguments.");
								}else if(args.length == 2){
									if(args[1] === "guild"){
										resetGuildSettings(message.channel.guild.id);
										message.channel.send("Guild settings have been reset to the default.");
									}else if(args[1] === "channel"){
										resetChannelSettings(message.channel.id);
										message.channel.send("Channel settings have been reset to the default. Any guild settings not been adjusted.");
									}else{
										message.channel.send("<@" + message.author.id + "> You must mention \"guild\" or \"channel\".");
									}
								}
							}else if(args[0] === "mentions"){
								if(args.length == 1){
									message.channel.send("Mentions are " + channels[j].settings.mention + "d.");
								}else{
									switch(args[1]){
										case "1": args[1] = "enable"; break;
										case "0": args[1] = "disable"; break;
										default: break;
									}
									if(args[1] === "enable" || args[1] === "disable"){
										var prevMention = channels[j].settings.mention;
										channels[j].settings.mention = args[1];
										if(args[1] === prevMention){
											message.channel.send("Mentions are already " + args[1] + "d for this channel.");
										}else{
											message.channel.send("Mentions have been " + args[1] + "d for this channel.");
										}
										
										updateSettingsJson();
									}else{
										message.channel.send("The arguments here are to \"enable\" or to \"disable\", not \"" + args[1] + "\".");
									}
								}
							}else if(args[0] === "roastEveryone"){//add roastEveryone to settings first!!!!!!!! DONE
								if(args.length == 1){
									message.channel.send("roastEveryone is " + channels[j].settings.roastEveryone + "d.");
								}else{
									switch(args[1]){
										case "1": args[1] = "enable"; break;
										case "0": args[1] = "disable"; break;
										default: break;
									}
									if(args[1] === "enable" || args[1] === "disable"){
										var prevMention = channels[j].settings.roastEveryone;
										channels[j].settings.roastEveryone = args[1];
										if(args[1] === prevMention){
											message.channel.send("roastEveryone is already " + args[1] + "d for this channel.");
										}else{
											message.channel.send("roastEveryone has been " + args[1] + "d for this channel.");
										}
										
										updateSettingsJson();
									}else{
										message.channel.send("The arguments here are to \"enable\" or to \"disable\", not \"" + args[1] + "\".");
									}
								}
							}
							break;
						}
					}
				}
			}
		}else{
			message.channel.send("<@" + message.author.id + "> WHAT ARE YOU DOING TOUCHING MY PRIVATE PARTS!");
		}
	}
  
	if(command === "help" || command === "?"){
		help(message);
	}
	if(message.author.id === config.owner || message.author.id === config.admins){
	  
		if(command === "ping") {
			console.log(message.channel.guild.id);
	
			//const m = await message.channel.send("Ping?");
			//m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
		}
    }
});

client.on('messageReactionAdd', (reaction, user) => {
	
});

function roast(channelID, user, author, hasMentions){
	var msgChannel = client.channels.get(channelID);
	var memberCount = msgChannel.guild.memberCount;
	var clientMapUsers = msgChannel.members;
	
	var listOfMembers = [];
	for (let key of clientMapUsers)
		listOfMembers.push(key);

	if(user === config.id){
		msgChannel.send("Why would I roast myself <@" + author + ">? lol");
		getRoasts(msgChannel, author, hasMentions, false);
	}else{
		if(user === "randomInterval"){
			
			var randomUser;
			do{
				randomUser = listOfMembers[Math.floor(Math.random() * listOfMembers.length)][0]
			}while(randomUser === config.id);
			getRoasts(msgChannel, randomUser, hasMentions, false);
		}else{
			if(user === "random"){
				var randomUser;
				do{
					randomUser = listOfMembers[Math.floor(Math.random() * listOfMembers.length)][0]
				}while(randomUser === config.id);
				
				getRoasts(msgChannel, randomUser, hasMentions, false);
			}else if(user === "everyone"){
				/*var allowsRoastEveryone = false;
				for(var i = 0; i < channels.){
					if(channels[i].settings.roastEveryone){
						if(channels[i].settings.roastEveryone === "enable")
							allowsRoastEveryone = true;
						break;
					}
				}
				if(allowsRoastEveryone){*/
					msgChannel.send("<@" + author + "> has summoned an avalanche of dead bodies.");
					
					var memberCounter = 0;
					var listOfEmbeds = [];
					for(var i = 0; i < listOfMembers.length; i++){
						if(listOfMembers[i][0] !== config.id && listOfMembers[i][0] !== "1"){ //ignores own name and clyde "the discord owned bot" 
							getRoasts(msgChannel, listOfMembers[i][0], hasMentions, false);
							memberCounter++;
						}
					}
					msgChannel.send("Castualties: " + memberCounter);
				//}
			}else{
				getRoasts(msgChannel, user, hasMentions, false);
			}
		}
	}
}

function generateRoast(){
	var listIndex = Math.floor(Math.random() * listOfRoasts.length);
	return listOfRoasts[listIndex].substring(4);
}

function help(message){
	var embed;
	if(message.member.hasPermission("KICK_MEMBERS") || message.member.id == config.owner){
		embed = {
			"title": "THE ADMIN COMMANDS",
			"description": "All these commands can be used in casual conversation. Just mention me and I will come to your service.",
			"color": 0xff9933,
			"fields": [
				{
					"name": "!roast <username> *or* roast <username>",
					"value": "Roasts user on demand.\n<username> = @ <username>, everyone, random"
				},
				{
					"name": "!roast <help|?> *or* @CharBot <help|?>",
					"value": "Brings up this list of commands."
				},
				{
					"name": "!roast settings <settingName> [value]",
					"value": "Brings up this list of settings and is used to edit setting values. MUST HAVE KICK PERMISSION."
				},
				{
					"name": "!roast changelog",
					"value": "Shows the changelog of the bot."
				}
			]
		};
	}else{
		embed = {
			"title": "BASIC COMMANDS",
			"description": "All these commands can be used in casual conversation. Just mention me and I will come to your service.",
			"color": 0xff9933,
			"fields": [
				{
					"name": "!roast <username> *or* roast <username>",
					"value": "Roasts user on demand.\n<username> = @ <username>, everyone, random"
				},
				{
					"name": "!roast <help|?> *or* @CharBot <help|?>",
					"value": "Brings up this list of commands."
				},
				{
					"name": "!roast changelog",
					"value": "Shows the changelog of the bot."
				}
					
			]
		};
	}
	message.channel.send({embed});
}

function settingsHelp(message, guildIndex, channelIndex){
	var randTimeIntervalHeader = "randomTimeInterval = " + settings.guilds[guildIndex].channels[channelIndex].settings.randomTimeInterval.value + "d";
	if(settings.guilds[guildIndex].channels[channelIndex].settings.randomTimeInterval.value === "enable"){
		randTimeIntervalHeader += " Interval: " + settings.guilds[guildIndex].channels[channelIndex].settings.randomTimeInterval.interval + " mins Chance: " + (100 * settings.guilds[guildIndex].channels[channelIndex].settings.randomTimeInterval.chance) + "%";
	}
	var embed = {
		"title": "SETTINGS",
		"description": "All the settings on this server.",
		"color": 0xff9933,
		"fields": [
			{
				"name": randTimeIntervalHeader,
				"value": "Allows bot to roast someone random on server at a random time. (Channel Setting)"
			},
			{
				"name": "mentions = " + settings.guilds[guildIndex].channels[channelIndex].settings.mention + "d",
				"value": "Allows the bot to mention other users on server. Can be really annoying if spammed. (Channel Setting)"
			},
			{
				"name": "roastEveryone = " + settings.guilds[guildIndex].channels[channelIndex].settings.roastEveryone + "d",
				"value": "Allows the bot to roast everyone on command. Can be amusing, but will spam a lot. (Channel Setting)"
			}
		]
	};
	message.channel.send({embed});
}

//function setRandomTimeRoast(guild){
//	var currentTime = date.getTime();
//	var timeTilRoast = Math.floor(Math.random() * 5 + 5) * 600000;
//	
//}

function randomIntervalRoast(channelID, i, j, hasMentions){
	var delay = Math.floor(settings.guilds[i].channels[j].settings.randomTimeInterval.interval * 60000);//Math.floor(Math.random() * 5 + 5) * 60000;
	var date = Date.now() + delay;
	settings.guilds[i].channels[j].settings.randomTimeInterval.date = date;
						
	var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json.backup', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
	});
	
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
	});
	
	var msgChannel = client.channels.get(channelID);
	
	var timeOut = setTimeout(function(){
	    const guildIndex = i;
		const channelIndex = j;
		const id = channelID;
		const timeOutID = timeOut;
		const randRoast = settings.guilds[i].channels[j].settings.randomTimeInterval.value;
		for(var k = setTimeoutIDs.length - 1; k >= 0; k--){
			if(id === setTimeoutIDs[k].channel){
				clearTimeout(setTimeoutIDs[k].timeOut);
				setTimeoutIDs.splice(k, 1);
				break;				
			}
		}
		if(randRoast === "enable"){
			var randChance = Math.random();
			if (randChance < parseFloat(settings.guilds[guildIndex].channels[channelIndex].settings.randomTimeInterval.chance)){
				roast(id, "randomInterval", null, settings.guilds[i].channels[j].settings.mention);
			}
			setTimeoutIDs.push({"timeOut": randomIntervalRoast(id, guildIndex, channelIndex), "channel": id});
		}
	},delay);
	
	return timeOut;
}

function resetGuildSettings(guildID){
	for(var i = 0; i < guilds.length; i++){
		if(guildID === settings.guilds[i].id){
		  settings.guilds.splice(i, 1);
		}
	}
	var guildObj = {id: guildID, channels: []};
	var allChannels = client.guilds.get(guildID).channels.array();
	for(var i = 0; i < allChannels.length; i++){
		guildObj.channels.push({id: allChannels[i].id, settings:{randomTimeInterval:{value:"disable", interval: 0, chance: 0, date: Date.now()}, mention: "disable"}});
	}
	
	settings.guilds.push(guildObj);
	updateSettingsJson();
}

function resetChannelSettings(channelID){
	var channelObj = client.channels.get(channelID);
	var guildID = channelObj.guild.id;
	
	for(var i = 0; i < guilds.length; i++){
		var channelsArray = guilds[i].channels;
		if(guildID === settings.guilds[i].id){
			for(var j = 0; j < channelsArray.length; j++){
				if(channelID === channelsArray[j].id){
					settings.guilds[i].channels.splice(j, 1);
					settings.guilds[i].channels.push({id: channelID, settings:{randomTimeInterval:{value:"disable", interval: 0, chance: 0, date: Date.now()}, mention: "disable"}});
					break;
				}
			}
			break;
		}
	}
	updateSettingsJson();
}

function updateSettingsJson(){
	/*var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) 
			throw err;
		console.log('updated guildsettings.json');
	});*/
	writeToFileCallback(settings, './guildsettings.json', 'updated guildsettings.json');
}

function requestChangelog(message){
	var changelogDetails = [];
	
	for(var i = 0; i < changeLog.length; i++){
		var fieldObj = {name: "_**Version " + changeLog[i].version + "**_", value: ""};
		if(changeLog[i].features.length > 0){
			fieldObj.value += "__**Features & Changes**__\n";
			for(var j = 0; j < changeLog[i].features.length; j++){
				fieldObj.value += " - " + changeLog[i].features[j] + "\n";
			}
		}
		if(changeLog[i].bugfixes.length > 0){
			fieldObj.value += "\n__**Bug Fixes**__\n";
			for(var j = 0; j < changeLog[i].bugfixes.length; j++){
				fieldObj.value += " - " + changeLog[i].bugfixes[j] + "\n";
			}
		}
		fieldObj.value += "\n";
		changelogDetails.push(fieldObj);
	}
	
	var embed = {
		"title": "Changelog",
		"fields": changelogDetails,
		"color": 0x1e74ff,
		"footer": {
			"text": "Nydauron"
		},
		"timestamp": "2019-04-20T18:39:56.004Z" //<==== UPDATE THIS DATE AFTER AN UPDATE
	}
	message.channel.send({embed});
}

client.on('disconnect', function(msg, code) {
	console.log("disconnected....");
    if (code === 0) return console.error(msg);
    client.connect();
	console.log("Connected");
});

client.on('error', function(){
	console.error;
});

client.login(config.token);