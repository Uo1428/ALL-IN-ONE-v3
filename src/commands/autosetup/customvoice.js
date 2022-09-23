const Discord = require('discord.js');

const voiceSchema = require("../../database/models/voice");

module.exports = async (client, interaction, args) => {
    interaction.guild.channels.create("Custom voice", {
        type: "GUILD_CATEGORY"
    }).then((cat) => {
        interaction.guild.channels.create("➕ Create Voice", {
            type: "GUILD_VOICE",
            parent: cat.id,
            permissionOverwrites: [
                {
                    deny: 'SPEAK',
                    id: interaction.guild.id
                },
            ],
        }).then((ch) => {
            voiceSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if (data) {
                    data.Category = cat.id;
                    data.Channel = ch.id
                    data.ChannelName = "{emoji} {channel name}"
                    data.save();
                }
                else {
                    new voiceSchema({
                        Guild: interaction.guild.id,
                        Channel: ch.id,
                        ChannelName: "{emoji} {channel name}",
                        Category: cat.id
                    }).save();
                }
            });

            client.succNormal({
                text: `Custom voice has been set up successfully!`,
                fields: [
                    {
                        name: `<:uo_BotEvent:1015565719330627584> ┆ Channel`,
                        value: `${ch} (${ch.name})`
                    }
                ],
                type: 'editreply'
            }, interaction);
        })
    })
}

 