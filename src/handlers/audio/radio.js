const Discord = require('discord.js');
const Voice = require('@discordjs/voice');

const Schema = require("../../database/models/music");

const player = Voice.createAudioPlayer({
    behaviors: {
        noSubscriber: Voice.NoSubscriberBehavior.Play
    },
});

module.exports = (client) => {

    client.startStream = async function (url) {
        const resource = Voice.createAudioResource(url, {
            inputType: Voice.StreamType.Arbitrary,
        });

        player.play(resource);

        return Voice.entersState(player, Voice.AudioPlayerStatus.Playing, 5e3).catch(() => { });
    }

    client.connectToChannel = async function (channel = Discord.VoiceChannel) {
        const connection = Voice.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        setTimeout(() => {
            if (channel.type == "GUILD_STAGE_VOICE") {
                channel.guild.me.voice.setSuppressed(false).catch(() => { });
            }
        }, 500)

        try {
            await Voice.entersState(connection, Voice.VoiceConnectionStatus.Ready, 5e3).catch(() => { });
            return connection;
        } catch (error) {
            connection.destroy();
            client.emit("voiceError", error);
        }
    }

    client.radioStart = async function (channel) {
        try {
            const connection = await client.connectToChannel(channel);
            connection.subscribe(player);
        }
        catch { }
    }

    client.radioStop = async function (channel) {
        const connection = Voice.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        connection.destroy();
    }


    player.on('stateChange', (oldState, newState) => {
        if (newState.status === Voice.AudioPlayerStatus.Idle) {
            client.startStream(process.env.RADIO)
        }
    });

    player.on('error', error => {
        client.emit("voiceError", error);
        client.startStream(process.env.RADIO);
    });

    client.on('ready', async () => {
        // client.startStream(process.env.RADIO);
        
        Schema.find(async (err, data) => {
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    try {
                        const channel = await client.channels.fetch(data[i].Channel)

                        if (channel) {
                            client.radioStart(channel);
                        }
                    }
                    catch { }
                }
            }
        })
    });
}

 