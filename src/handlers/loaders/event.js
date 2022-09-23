const chalk = require('chalk');
const fs = require('fs');

module.exports = (client) => {

    // if (client.shard.ids[0] === 0) console.log(`\u001b[0m`);
    // if (client.shard.ids[0] === 0) console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), (chalk.green(`Loading events`)), (chalk.white(`...`)))
    // if (client.shard.ids[0] === 0) console.log(`\u001b[0m`);

    fs.readdirSync('./src/events').forEach(dirs => {
        const events = fs.readdirSync(`./src/events/${dirs}`).filter(files => files.endsWith('.js'));

        // if (client.shard.ids[0] === 0) console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), chalk.red(`${events.length}`), (chalk.green(`events of`)), chalk.red(`${dirs}`), (chalk.green(`loaded`)));

        for (const file of events) {
            const event = require(`../../events/${dirs}/${file}`);
            client.on(file.split(".")[0], event.bind(null, client)).setMaxListeners(0);
        };
    });
}

 