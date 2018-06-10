const exec = require('child_process').exec;
const Discord = require('discord.js');

module.exports.run = async(bot, message, args, level) => {
    let embed = new Discord.RichEmbed()
  .setTitle("Evaluation")
  .setDescription("Üzgünüm, `eval` komutunu sadece botun sahibi kullanabilir.")
  .setColor("#cdf785");
  if(message.author.id !== '274551537139712001') return message.channel.send(embed);
    exec(`${args.join(' ')}`, (error, stdout) => {
      const response = (error || stdout);
      let embed = new Discord.RichEmbed()
      .setTitle(`Executed in ${Math.round(bot.ping)}ms`)
      .addField(":inbox_tray: Girdi", `\`\`\`asciidoc\n${args.join(" ")}\n\`\`\``)
      .addField(":outbox_tray: Çıktı", `\`\`\`js\n${response}\n\`\`\``)
      .setColor('GREEN');
      message.channel.send({embed});
    });
}
module.exports.help = {
name: "exec"
}
