"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
exports.default = (interaction) => {
    interaction.reply({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('⚠️ Command Not Available')
                .setDescription("Sorry, this command is **server-specific** and cannot be used in direct messages. Please use this command within a server.")
                .setFooter({
                text: config_1.config.messages.footerText
            })
        ],
        ephemeral: true,
    });
};