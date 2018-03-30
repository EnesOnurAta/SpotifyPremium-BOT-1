	const http = require('http');
	const express = require('express');
	const app = express();
	app.get("/", (request, response) => {
	console.log(Date.now() + " Ping Received");
	response.sendStatus(200);
	});
	app.listen(process.env.PORT);
	setInterval(() => {
	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
	}, 280000);

	const Discord = require("discord.js");
	const botconfig = require("./botconfig.json");
	const fs = require("fs");
	let bot = new Discord.Client();
	bot.commands = new Discord.Collection();
	const coins = require("./coins.json");
	const xp = require("./xp.json");
	const db = require('quick.db');




	bot.on('ready', () => {
	console.log("Loading...");
	setTimeout(function(){
	console.log("Bot has been loaded completely.");
	}, 1000);
	setTimeout(function(){
	console.log(`Logged in as ${bot.user.tag}`);
	}, 2000);
	bot.user.setActivity(`t.help | ${bot.guilds.size} servers | ${bot.users.size} users`,{type: "PLAYING"});
	})


	fs.readdir("./commands/", (err, files) => {

	if(err) console.log(err);
	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if(jsfile.length <= 0){
	console.log("Couldn't find commands.");
	return;
	}


	jsfile.forEach((f, i) =>{
	delete require.cache[require.resolve(`./commands/${f}`)];
	let props = require(`./commands/${f}`);
	console.log(`${f} loaded!`);
	bot.commands.set(props.help.name, props);
	});
	});


	bot.on("message", async message => {
	if(message.author.bot) return undefined;
	if(message.channel.type === 'dm') return ;
	db.add(`messagesSent_${message.author.id}`, 1);
	let prefix = botconfig.prefix;

	let args = message.content.slice(prefix.length).trim().split(" ");
	let cmd = args.shift().toLowerCase();

	if(message.author.bot) return undefined;;
	if(!message.content.startsWith(prefix)) return undefined;


	try {
	let commandFile = require(`./commands/${cmd}.js`);
	commandFile.run(bot, message, args);
	if(!commandFile) return message.channel.send("No command found with that name.");
	} catch (e) { console.log(e) }




	if(!coins[message.author.id]){
	coins[message.author.id] = {
	coins: 0
	};
	}

	let coinAmt = Math.floor(Math.random() * 15) + 14;
	let baseAmt = Math.floor(Math.random() * 15) + 14;
	console.log(`${coinAmt} ; ${baseAmt}`);

	if(coinAmt === baseAmt){
	coins[message.author.id] = {
	coins: coins[message.author.id].coins + coinAmt
	};
	fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
	if (err) console.log(err)
	});
	let coinEmbed = new Discord.RichEmbed()
	.setAuthor(message.author.username)
	.setThumbnail(message.author.displayAvatarURL)
	.setColor("#42f45c")
	.addField("💸", `${coinAmt} coins added!`);

	message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});
	}

	let xpAdd = Math.floor(Math.random() * 15) + 14;
	console.log(xpAdd);

	if(!xp[message.author.id]){
	xp[message.author.id] = {
	xp: 0,
	level: 1
	};
	}


	let curxp = xp[message.author.id].xp;
	let curlvl = xp[message.author.id].level;
	let nxtLvl = xp[message.author.id].level * 300;
	xp[message.author.id].xp =  curxp + xpAdd;
	if(nxtLvl <= xp[message.author.id].xp){
	xp[message.author.id].level = curlvl + 1;
	let lvlup = new Discord.RichEmbed()
	.setTitle("Level Up!")
	.setColor('RANDOM')
	.addField("New Level", curlvl + 1)
	.setThumbnail(message.author.displayAvatarURL);
	message.channel.send(lvlup).then(msg => {msg.delete(5000)});
	}
	fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
	if(err) console.log(err)
	});


	});
	bot.on('guildMemberAdd', member => {
	const members = member.guild.memberCount;
	const channel = member.guild.channels.find('name', 'bot-spam');
	if (!channel) return;
	let role = member.guild.roles.find(`name`, "User");
	member.addRole(role.id)
	let Embed = new Discord.RichEmbed()
	.setTitle(`${member}, Welcome to ${member.guild.name}`)
	.setColor(0xD4AF37)
	.setDescription(`I'm sure you have a lot of questions.\nPlease take a look at #rules-info!\nType t.help to see my commands!\nHave a great time here!`)
	.addField('Users: ', `${members}`, true)
	channel.send(Embed);
	});
	bot.on('guildMemberRemove', member => {
	const channel = member.guild.channels.find('name', 'bot-spam');
	if (!channel) return;
	const members = member.guild.memberCount;
	let Embed = new Discord.RichEmbed()
	.setColor(0xD4AF37)
	.setdescription(`member.displayName, has left the server! We have ${members} members now.`)

	channel.send(Embed);
	});
	bot.on('guildCreate', guild => {

	guild.channel.send(`Thank You for adding me in ${guild}. Type t!help to see my commands! `)
	});

	bot.login(process.env.TOKEN);