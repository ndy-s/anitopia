"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterNF = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const characterNF = (interaction, type = null) => {
    const characterNFEmbed = new discord_js_1.EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🚫 Character Not Found')
        .setFooter({
        iconURL: interaction.client.user.displayAvatarURL({ extension: 'png', size: 512 }),
        text: config_1.config.messages.footerText
    });
    if (type === 'spaces') {
        characterNFEmbed.setDescription(`It seems like there might be **spaces** in your character ID. Could you please remove any spaces and try again? We appreciate your patience!`);
    }
    else if (type === 'symbols') {
        characterNFEmbed.setDescription(`Hmm, your character ID seems to contain **symbols**. Remember, only alphanumeric characters are allowed in character IDs. Could you please check your input and try again? Thanks for understanding!`);
    }
    else {
        characterNFEmbed.setDescription(`The character ID might be **incorrect**. Please make sure you have a character with the given ID and try again.`);
    }
    interaction.reply({
        embeds: [characterNFEmbed],
        ephemeral: true,
    });
};
exports.characterNF = characterNF;
