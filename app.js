const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");
const guildSettings = require("./guildsettings.json");
const changeLog = require("./changelog.json");
const jsonfile = require("jsonfile");

const $ = require("jquery")(require('jsdom-no-contextify').jsdom().parentWindow);

const listOfRoasts = config.roasts;

const date = new Date();

var settings;

var setTimeoutIDs = [];

client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	settings = guildSettings;
	guilds = settings.guilds;
	for(var i = 0; i < guilds.length; i++){
		var channelsArray = guilds[i].channels;
		for(var j = 0; j < channelsArray.length; j++){
			if(channelsArray[j].settings.randomTimeInterval.value === "enable"){
				//console.log("FOUND ONE!");
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
    client.user.setActivity('you burn | V1.2 | !roast ?', {type: "WATCHING"});// <<<< CHANGE BACK TO THIS ONCE STABLE
    console.log("Charbot v1.2 is completed boot! Awaiting commands...");
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    var guildObj = {id: guild.id, channels: []};
    var allChannels = guild.channels.array();
    for(var i = 0; i < allChannels.length; i++){
	    guildObj.channels.push({id: allChannels[i].id, settings:{randomTimeInterval:{value:"disable", interval: 0, chance: 0, date: Date.now()}, mention: "disable"}});
    }
  
    settings.guilds.push(guildObj);
  
    var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
		console.log('added ' + guild.name + ' to guildsettings.json');
	});
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  
    for(var i = 0; i < guilds.length; i++){
	    if(guild.id === settings.guilds[i].id){
		    settings.guilds.splice(i, 1);
		  
	    }
    }
  
	var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
		console.log('removed ' + guild.name + ' to guildsettings.json');
	});
});

client.on("channelCreate", channel => {
    console.log(`I have been added to: ${channel.name} (id: ${channel.id})`);
  
    for(var i = 0; i < guilds.length; i++){
		if(channel.guild.id === guilds[i].id){
			settings.guilds[i].channels.push({id: channel.id, settings:{randomTimeInterval:{value:"disable", interval: 0, chance: 0, date: Date.now()}, mention: "disable"}});
			break;
		}
    }
  
	var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
		console.log('added ' + channel.name + ' to guildsettings.json');
	});
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
  
	var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) throw err;
		console.log('removed ' + channel.name + ' to guildsettings.json');
	});
});

function getRoasts(channel, user, hasMentions){
	$.ajax({
            url: "https://daviseford.com/shittalk/php/controller/controller.php",
            contentType: "application/json; charset\x3dutf-8",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                query: "get_RandomList"
            }),
            success: function(a) {
				var array = a;
				for(var i = 0; i < array.length; i++){
					var item = array[i];
					var voteCount = parseInt(item.netVotes);
					var content = item.text || "";
					
					if(voteCount < 10){
						array.splice(i, 1);
						i--;
					}
				}
				var roastMsg = array[0].text;
				var embed = {
					"title": roastMsg,
					"color": 0xff0000
				}
				var guildID = channel.guild.id;
				
				if(hasMentions === "enable")
					channel.send("<@" + user + ">", {embed});
				else if(hasMentions === "disable"){
					var clientMapUsers = client.guilds.get(guildID).members;
					var listOfMembers = clientMapUsers.array();
					var msgName = "";
							
					var userObj = clientMapUsers.get(user);
							
					if(user === userObj.user.id){
						if(userObj.nickname == null){
							msgName = userObj.user.username;
						}else{
							msgName = userObj.nickname;
						}
					}
							
					channel.send(msgName, {embed});
				}
			},
            error: function(a) {
                console.log(a)
            }
        });
}

client.on("message", async message => {
	var hasMentions = "disable";
	
	var foundGuild = false;
	var foundChannel = false;
	for(i = 0; i < settings.guilds.length; i++){
		if(message.guild.id === settings.guilds[i].id){
			foundGuild = true;
			for(var j = 0; j < settings.guilds[i].channels.length; j++){
				if(message.channel.id === settings.guilds[i].channels[j].id){
					foundChannel = true;
					hasMentions = settings.guilds[i].channels[j].settings.mention;
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

	if(message.author.bot) return;
	
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
				if(args[i + 1] === "<@" + config.id + ">"){
					roast(message.channel.id, config.id, message.author.id, hasMentions);
					hasResponded = true;
				}else if(args[i + 1] === "everyone" || args[i + 1] === "random"){
					if(args[i + 1] === "random" && botMentioned)
						message.channel.send("As you wish, <@" + message.author.id + ">.");
					roast(message.channel.id, args[i + 1],	message.author.id, hasMentions);
					hasResponded = true;
				}else if((args[i + 1].indexOf("<@") == 0 && args[i + 1].indexOf(">") == args[i + 1].length - 1)){ //18 characters SHOULD be the id length. Otherwise, IDLENGTH + 2
					if(botMentioned)
						message.channel.send("As you wish, <@" + message.author.id + ">.");
					var startSubIndex = 2;
					if(args[i + 1].substring(0, 3) == "<@!")
						startSubIndex = 3;
					roast(message.channel.id, args[i + 1].substring(startSubIndex, args[i + 1].length - 1), message.author.id, hasMentions);
					hasResponded = true;
				}
			}
			if((tempString === 'help' || tempString === '?') && botMentioned){
				message.channel.send("Some assistance for you <@" + message.author.id + ">.");
				help(message);
				hasResponded = true;
			}
		}
		
		if(!hasResponded && botMentioned)
			message.channel.send("<@" + message.author.id + ">! You summoned me! What is it that you request?");
		
		return;
	}

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
    }else if(command === "everyone" || command === "random"){
		roast(message.channel.id, command, message.author.id, hasMentions);
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
								//<-------------------REUTRN RANDOMTIMEINTERVAL VALUE, TIME, AND CHANCE
								
								}else{
									//!roast settings randomTimeInterval disable
									//!roast settings randomTimeInterval enable <timeIntervalToCheck> <chanceofRoast>
									
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
											
											var writeBuffer = JSON.stringify(settings);
											var fs = require('fs');
											fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
												if (err) throw err;
											});
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
								if(args[1] === "enable" || args[1] === "disable"){
									var prevMention = channels[j].settings.mention;
									channels[j].settings.mention = args[1];
									if(args[1] === prevMention){
										message.channel.send("Mentions are already been " + args[1] + "d for the channel.");
									}else{
										message.channel.send("Mentions have been " + args[1] + "d for the channel.");
									}
									
									updateSettingsJson();
								}else{
									message.channel.send("The arguments here are to \"enable\" or to \"disable\", not \"" + args[1] + "\".");
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
	var clientMapUsers = msgChannel.guild.members;
	
	var listOfMembers = [];
	for (let key of clientMapUsers)
		listOfMembers.push(key);

	//var roastIntros = config.roastIntros;
	if(user === config.id){
		msgChannel.send("Why would I roast myself <@" + author + ">? lol");
		getRoasts(msgChannel, author, hasMentions);
	}else{
		if(user === "randomInterval"){
			
			var randomUser;
			do{
				randomUser = listOfMembers[Math.floor(Math.random() * listOfMembers.length)][0]
			}while(randomUser === config.id);
			getRoasts(msgChannel, randomUser, hasMentions);
		}else{
			//msgChannel.send(roastIntros[Math.floor(Math.random() * roastIntros.length)]);
			if(user === "random"){
				var randomUser;
				do{
					randomUser = listOfMembers[Math.floor(Math.random() * listOfMembers.length)][0]
				}while(randomUser === config.id);
				
				getRoasts(msgChannel, randomUser, hasMentions);
			}else if(user === "everyone"){
				msgChannel.send("<@" + author + "> has summoned an avalanche of dead bodies.");
				
				var memberCounter = 0;
				for(var i = 0; i < listOfMembers.length; i++){
					if(listOfMembers[i][0] !== config.id && listOfMembers[i][0] !== "1"){ //ignores own name and clyde "the discord owned bot"
						getRoasts(msgChannel, listOfMembers[i][0], hasMentions);
						memberCounter++;
					}
				}
				msgChannel.send("Castualties: " + memberCounter);
			}else{
				getRoasts(msgChannel, user, hasMentions);
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
	if(message.member.hasPermission("KICK_MEMBERS")){
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
					"name": "!roast settings",
					"value": "Brings up this list of settings. MUST HAVE KICK PERMISSION."
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
	
	
	
	var writeBuffer = JSON.stringify(settings);
	var fs = require('fs');
	fs.writeFile('./guildsettings.json', writeBuffer, 'utf8', function(err) {
		if (err) 
			throw err;
		console.log('updated guildsettings.json');
	});
}

function requestChangelog(message){
	var changelogDetails = [];
	
	for(var i = 0; i < changeLog.length; i++){
		var fieldObj = {name: "_**Version " + changeLog[i].version + "**_", value: ""};
		fieldObj.value += "__**Features & Changes**__\n";
		for(var j = 0; j < changeLog[i].features.length; j++){
			fieldObj.value += changeLog[i].features[j] + "\n";
		}
		if(changeLog[i].bugfixes.length > 0){
			fieldObj.value += "\n__**Bug Fixes**__\n";
			for(var j = 0; j < changeLog[i].bugfixes.length; j++){
				fieldObj.value += changeLog[i].bugfixes[j] + "\n";
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
		"timestamp": "2018-06-21T07:20:05.994Z" //<==== UPDATE THIS DATE AFTER AN UPDATE
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