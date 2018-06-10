const Discord = require('discord.js');

module.exports.run = (client, message, args) => {
  if (message.author.id !== ('274551537139712001')) return message.channel.send("Benim sahibim olduğun doğrulandı!");
  const status = args.join(' ');
  if (status.length === 0) {
    const embed = new Discord.RichEmbed()
      .setColor("#7289DA")
      .setDescription(':negative_squared_cross_mark: Botun durumu değiştirildi!');
    message.channel.send({ embed });
  }

  else if (status.length !== 0) {
   client.user.setPresence({ game: { name: `${status}`, url: 'https://twitch.tv/enesonurata', type: 1 } });
  const embed = new Discord.RichEmbed()
    .setColor("#7289DA")
    .setDescription(':white_check_mark: Yayını başarıyla değiştirdin');
  message.channel.send({ embed });
}};
