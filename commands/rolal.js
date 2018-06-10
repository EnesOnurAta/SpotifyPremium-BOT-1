const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(":no_entry_sign: **| Senin `MANAGE_ROLES` yetkin yok.**");
  let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!rMember) return message.channel.send(":name_badge: **| Üye bulunamadı.**");
  let role = args.join(" ").slice(22);
  if(!role) return message.channel.send(":name_badge: **| Lütfen bir rol belirtin **");
  let gRole = message.guild.roles.find(`name`, role);
  if(!gRole) return message.channel.send(":name_badge: **| Bu isimde rol bulunamadı**");

  if(!rMember.roles.has(gRole.id)) return message.channel.send(":name_badge: **| Bu isimde bir rol yok**");
  await(rMember.removeRole(gRole.id));
  message.channel.send(`:white_check_mark: **| ${rMember} isimli üyenin ${gRole.name} rolü alındı.**`)
  
}

module.exports.help = {
  name: "rolal"
}
