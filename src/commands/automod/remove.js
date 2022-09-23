const Discord = require('discord.js');

const Schema = require("../../database/models/blacklist");
const { blacklistedWords } = require("../../Collection");

module.exports = async (client, interaction, args) => {
    const word = interaction.options.getString('word');

    Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (data) {
            if (!data.Words.includes(word)) {
                return client.errNormal({
                    error: `That word doesn't exist in the database!`,
                    type: 'editreply'
                }, interaction);
            }

            const filtered = data.Words.filter((target) => target !== word);

            await Schema.findOneAndUpdate({ Guild: interaction.guild.id }, {
                Guild: interaction.guild.id,
                Words: filtered
            });

            blacklistedWords.set(interaction.guild.id, filtered)

            client.succNormal({
                text: `Word is removed from the blacklist!`,
                fields: [
                    {
                        name: `<:uo_BotEvent:1015565719330627584> ┆ Word`,
                        value: `${word}`
                    }
                ],
                type: 'editreply'
            }, interaction);
        }
        else {
            client.errNormal({
                error: `This guild has not data!`,
                type: 'editreply'
            }, interaction);
        }
    })
}

 