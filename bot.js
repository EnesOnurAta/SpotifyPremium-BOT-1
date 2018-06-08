	const Discord = require("discord.js");
	const botconfig = require("./botconfig.json");
	const fs = require("fs");
	let bot = new Discord.Client();
	bot.commands = new Discord.Collection();
	const coins = require("./coins.json");
	const xp = require("./xp.json");
	const db = require('quick.db');
	var prefix = botconfig.prefix;
	/*
        const DBL = require("dblapi.js");
        const dbl = new DBL(process.env.DBL_TOKEN, bot);*/

	bot.on('ready', () => {
	console.log("Yukleniyor...");
	setTimeout(function(){
	console.log("Basariyla yuklendi.");
	}, 1000);
	function botStatus() {
        let status = [
            `Prefix 》${botconfig.prefix}`,
            `Teşekkürler 》${bot.guilds.size} sunucu.`,
	    `Teşekkürler 》${bot.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} kullanıcı.`,
            `Bedava Spotify Premium Hesapları.`,
 	    `*hesapver 》Bedava hesap alabilirsiniz.`,
	    `Spotify Premium Botu hesap dağıtmaya devam ediyor!`,
	    `Proje Fikir Tarihi: 7 Haziran 2018 - Botu Açma Tarihi: 8 Haziran 2018`,
	    `Ramazan Ayınız Mübarek Olsun`,
	    `Sizlere 7/24 Hizmet Veriyoruz!`,
	    `Artık o sıkıcı , huzur bozan reklamlara son!`,
	    `Sizde Spotify Premium Botunu kullanın şarkılarınızı kaliteli dinleyin!`,
	    `Para vermeye artık son!`,
	    `Hesaplarımız Günceldir!`,
	    `Hesaplarımız Sorunsuz çalışmaktadır!`,
            `Çalışmayan veya yanlış bilgilere sahip hesap varsa "*hesapbozuk eposta:şifre" şeklinde sohbete yazın bot bize gönderir!`,
	    `©2018 Bedava Spotify Premium™`,
	    `*yardım 》Yardım alabilirsiniz.`,
            `Botun Geliştiricisi 》 Enes Onur Ata#9427`
        ];
        let rstatus = Math.floor(Math.random() * status.length);

        bot.user.setActivity(status[rstatus], {Type: 'STREAMING'});        // BOT STATUS
      }; setInterval(botStatus, 20000)
        setInterval(() => {
        dbl.postStats(bot.guilds.size)
        }, 1800000);
	})

	fs.readdir("./commands/", (err, files) => {
    console.log(`Yuklendi ${files.length} komut.`)
	if(err) console.log(err);
	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if(jsfile.length <= 0){
	console.log("Komutlar bulunamadi.");
	return;
	}


	jsfile.forEach((f, i) =>{
	let props = require(`./commands/${f}`);
	console.log(`${f} loaded!`);
	bot.commands.set(props.help.name, props);
	});
	});

	bot.on("message", async message => {
      let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }
	
    let prefix = prefixes[message.guild.id].prefixes;
	if(message.author.bot) return undefined;
	if(message.channel.type === 'dm') return ;
        if(message.content.toLowerCase() === '<@421925809532436481>'){
        let embed = new Discord.RichEmbed()
       .setTitle("Zappara Pro")
       .addField("Prefix", `\`${prefix}\``, true)
       .addField("Yardım", `\`${prefix}yardım\``, true)
       .setThumbnail(bot.user.displayAvatarURL)
       .setColor(`${message.guild.me.displayHexColor!=='#000000' ? message.guild.me.displayHexColor : 0xffffff}`);
        message.channel.send(embed);
        }

	let args = message.content.slice(prefix.length).trim().split(" ");
	let cmd = args.shift().toLowerCase();
	if(message.author.bot) return undefined;
	if(!message.content.startsWith(prefix)) return undefined;
   message.prefix = prefix;


	try {
	let commandFile = require(`./commands/${cmd}.js`);
	commandFile.run(bot, message, args);
	if(!commandFile) return message.channel.send("Bu isimde bir komut yok!");
	} catch (e) { console.log(e) }

	if(!coins[message.author.id]){
	coins[message.author.id] = {
	coins: 0
	};
	}

	let coinAmt = Math.floor(Math.random() * 15) + 14;
	let baseAmt = Math.floor(Math.random() * 15) + 14;
 

	

	if(coinAmt === baseAmt){
	coins[message.author.id] = {
	coins: coins[message.author.id].coins + coinAmt
	};
	fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
	if (err) console.log(err)
	});

	}

	let xpAdd = Math.floor(Math.random() * 15) + 14;
	

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

	}
	fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
	if(err) console.log(err)
	});


	});
	bot.on('guildMemberAdd', member => {
        bot.channels.get('439792255365021696').setName(`Toplam Kullanıcı: ${member.guild.memberCount}`)
        let humans = member.guild.members.filter(m => !m.user.bot).size;
        bot.channels.get('439793088001736725').setName(`Üye Sayısı: ${humans}`)
        let bots = member.guild.members.filter(m => m.user.bot).size;
        bot.channels.get('439793716052623361').setName(`Bot Sayısı: ${bots}`)
	const members = member.guild.memberCount;
	const channel = member.guild.channels.find('name', 'uye-log');
	if (!channel) return;

       let Role = member.guild.roles.find(`name`, "Bot");
       if(member.user.bot){
	member.addRole(Role.id)
       }else{
      let role = member.guild.roles.find(`name`, "Üye");
	member.addRole(role.id)
       }
 
	let Embed = new Discord.RichEmbed()
	.setFooter(`Üye Katıldı | Kaç Kişi Olduk = ${member.guild.memberCount}`)
	.setColor("#cde246")    
	.setAuthor(`${member.displayName} isimli üye ${member.guild.name} sunucusuna katıldı`, member.user.displayAvatarURL)
	.setTimestamp()
	channel.send(Embed);
	});
	bot.on('guildMemberRemove', member => {
    	bot.channels.get('439792255365021696').setName(`Toplam Kullanıcı: ${member.guild.memberCount}`)
    	let humans = member.guild.members.filter(m => !m.user.bot).size;
    	bot.channels.get('439793088001736725').setName(`Üye Sayısı: ${humans}`)
    	let bots = member.guild.members.filter(m => m.user.bot).size;
    	bot.channels.get('439793716052623361').setName(`Bot Sayısı: ${bots}`)
	const channel = member.guild.channels.find(`name`, 'uye-log');
	if(!channel) return; 
	let Embed = new Discord.RichEmbed()
	.setColor("#e26346")
	.setAuthor(`${member.displayName} isimli üye ${member.guild.name} sunucusundan ayrıldı.`, member.user.displayAvatarURL)
	.setTimestamp()
	.setFooter(`Üye Ayrıldı | Kaç Kişi Olduk = ${member.guild.memberCount}`)
	channel.send(Embed);
	});
	
	//Hesaplar
	bot.on('message', msg => {
  	if (msg.content === ${prefix} + 'hesapver') {
    	const hesap1 = new Discord.RichEmbed()
      	.setColor("RED")
      	.setAuthor(msg.author.username, msg.author.avatarURL)
      	.addField("Hesap Bilgileri", `Eposta: deneme123@gmail.com`)
	.addField(`Şifre: deneme123`)
     	.setDescription(`${bot.user.username} Bedava Hesap Sistemi`)
     	.setFooter("Spotify Premium")
     	.setTimestamp()
    	const hesapgonder = new Discord.RichEmbed()
      	.setColor("GREEN")
      	.setDescription("Bedava Spotify hesabını özelden yolladım. Eposta ve Şifresi içinde :postbox:")
      	.setAuthor(msg.author.username, msg.author.avatarURL)
      	.setFooter("Spotify Premium")
      	.setTimestamp()
   	 msg.channel.send(hesapgonder).then(msg.author.send(hesap1));
  	 }
	 });

	bot.login(process.env.BOT_TOKEN);
