import { CommandInteraction, EmbedBuilder } from "discord.js";
import { config } from "../../config";

export default (interaction: CommandInteraction) => {
    interaction.reply({ embeds: [
        new EmbedBuilder()
            .setColor('Red')
            .setAuthor({
                name: `${interaction.user.username}#${interaction.user.discriminator}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTitle("Anitopian Not Found❗")
            .setDescription(`Oh dear, it seems that you hasn't registered yet!`)
            .setFooter({
                text: config.messages.footerText
            })
    ]});
};