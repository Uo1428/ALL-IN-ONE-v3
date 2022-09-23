const Discord = require('discord.js');

const Schema = require("../../database/models/blacklist");
const { blacklistedWords } = require("../../Collection");

module.exports = async (client, interaction, args) => {
    Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (data && data.Words.length > 0) {
            client.embed({
                title: "<:uo_BotEvent:1015565719330627584>・Blacklisted words",
                desc: data.Words.join(", "),
                type: 'editreply'
            }, interaction)
        }
        else {
            client.errNormal({
                error: `This guild has not data!`,
                type: 'editreply'
            }, interaction);
        }
    })
}

 