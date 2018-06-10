const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', message => {

    if (message.content.startsWith(prefix + 'emojiler')) {

        const List = message.guild.emojis.map(e => e.toString()).join(" ");

        const EmojiList = new Discord.MessageEmbed()
            .setTitle('➠ Emojiler')
            .setAuthor(message.guild.name, message.guild.iconURL `https://cdn.discordapp.com/attachments/383886042178256909/397988796186230784/4zBNFjA8S9yjNB_ONwqBvxTvyXYdC7Nh1jYZ2x6YEcldBr2fyijdjM2J5EoVdTpnkAw300.png`)
            .setColor('RANDOM')
            .setDescription(List)
            .setTimestamp()
            .setFooter(message.guild.name)
        message.channel.send(EmojiList)
        message.channel.send(List);
    }
});
