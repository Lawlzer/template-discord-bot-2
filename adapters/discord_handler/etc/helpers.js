const Server = require.main.require('./models/server.js');

const Discord = require('discord.js');

const fs = require('fs');


const getAllCommands = () => {
    return fs.readdirSync('./adapters/discord_handler/commands').map((folder) => {
        return fs.readdirSync(`./adapters/discord_handler/commands/${folder}`).map((file) => {
            let command = require(`../commands/${folder}/${file}`);
            return command;
        });
    }).flat(1);
};
module.exports.getAllCommands = getAllCommands;

const getServer = async (message) => {
    const server = await Server.findOne({ id: message.guildId });
    if (server) return server;

    const newServer = await Server.create({
        id: message.guildId,
        users: [],
    });
    await newServer.save();
    return newServer;
};
module.exports.getServer = getServer;

const getUser = async (server, user) => {
    const foundUser = server.users.find(user => user.id === user.id);
    if (foundUser) return foundUser;
    const newUser = ({
        id: user.id,
        username: user.username,
        tag: user.tag,
    });
    server.users.push(newUser);
    return newUser;
};
module.exports.getUser = getUser;


const createEmbed = ({ title, colour, description, url, timestamp, error, }) => {
    const embed = new Discord.MessageEmbed()
        .setColor(colour || error ? global.errorColor : global.defaultColor)
        .setTitle(title || 'ERROR: NO TITLE SET FOR EMBED')
        .setDescription(description || 'ERROR: NO DESCRIPTION SET FOR EMBED')
        .setURL(url || global.url)
        // .setAuthor('Lawlzer', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Neko_Wikipe-tan.svg/1200px-Neko_Wikipe-tan.svg.png')
        // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        // .addFields(
        //     { name: 'Regular field title', value: 'Some value here' },
        //     { name: '\u200B', value: '\u200B' },
        //     { name: 'Inline field title', value: 'Some value here', inline: true },
        //     { name: 'Inline field title', value: 'Some value here', inline: true },
        // )
        // .setImage('')
        .setTimestamp()
        .setFooter(global.footerText, global.footerImage);
        return embed; 
}
module.exports.createEmbed = createEmbed;

const sendEmbed = async (channel, { title, colour, description, timestamp, error }) => {
    const embed = createEmbed({ title, colour, description, timestamp, error });
    await channel.send({ embeds: [embed] });
};
module.exports.sendEmbed = sendEmbed;


const sendImage = async ({ channel, colour, title, description, imagePath, error }) => {
    const attachment = new Discord.MessageAttachment(imagePath, `file-name.png`)

    const myEmbed = new Discord.MessageEmbed()
        .setColor(colour || error ? global.errorColor : global.defaultColor)
        .setTitle(title || 'ERROR: NO TITLE SET FOR IMAGE')
        .setDescription(description || 'ERROR: NO DESCRIPTION SET FOR IMAGE')
        .setImage(`attachment://file-name.png`)
        .setURL(global.url)

    await channel.send({ embeds: [myEmbed], files: [attachment] });
}
module.exports.sendImage = sendImage;