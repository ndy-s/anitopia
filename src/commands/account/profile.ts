import { ActionRowBuilder, Client, CommandInteraction, EmbedBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import redis from "../../lib/redis";
import AccountModel from "../../models/Account";
import { config , configProfileEmbed } from "../../config";

export default {
    name: 'profile',
    description: 'Shows your Anitopia profile',
    cooldown: 5_000,
    options: [],
    deleted: false,
    
    // Optional
    devOnly: false,
    testOnly: false,
    botPermissions: [],
    permissionsRequired: [],

    callback: async (client: Client, interaction: CommandInteraction, followUp = false) => {
        const result = await redis.get(interaction.user.id);
        let account;

        if (result) {
            account = JSON.parse(result);
        } else {
            account = await AccountModel.findOne({
                accountId: interaction.member && 'id' in interaction.member ? interaction.member.id : undefined,
            });

            await redis.set(interaction.user.id, JSON.stringify(account), 'EX', 60);
        }

        const profileOption = new StringSelectMenuBuilder()
            .setCustomId('profileOption')
            .setPlaceholder('Select an option to explore!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`Customize Profile`)
                    .setDescription('Personalize your profile to make it uniquely yours')
                    .setValue('customize'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Daily Rewards')
                    .setDescription('Earn exciting rewards every day')
                    .setValue('daily'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Redeem Code')
                    .setDescription('Got a code? Redeem it for cool perks')
                    .setValue('redeem'),
            );

        const profileEmbed = configProfileEmbed(interaction, account);

        const responseOptions: any = {
            embeds: [profileEmbed],
            components: [new ActionRowBuilder().addComponents(profileOption)],
        };

        let response = followUp ? await interaction.followUp(responseOptions) : await interaction.reply(responseOptions);

        const collectorFilter = (i: { user: { id: string; }; }) => i.user.id === interaction.user.id;

        try {
            while (true) {
                let profileConfirmation = await response.awaitMessageComponent({
                    filter: collectorFilter,
                    time: 300_000
                });


                // profileOption.options.forEach(option => {
                //     if ('values' in profileConfirmation) {
                //         if (profileConfirmation.values.includes(option.data.value)) {
                //             option.setDefault(true);
                //         }
                //     }
                // });

                if (profileConfirmation.customId === 'profileOption' && 'values' in profileConfirmation) {
                    if (profileConfirmation.values.includes('customize')) {
                        account = await AccountModel.findOne({
                            accountId: interaction.member && 'id' in interaction.member ? interaction.member.id : undefined,
                        });
            
                        if (account) {
                            await redis.set(interaction.user.id, JSON.stringify(account), 'EX', 60);
                        
                            const customizeProfileModal = new ModalBuilder()
                                .setCustomId('customizeProfileModal')
                                .setTitle('Customize Profile');
    
                            const bioInput = new TextInputBuilder()
                                .setCustomId('bioInput')
                                .setLabel("Biography")
                                .setStyle(TextInputStyle.Paragraph)
                                .setValue(account.bio)
                                .setMaxLength(100)
                                .setRequired(true);
    
                            const customizeProfileModalRow: any = new ActionRowBuilder().addComponents(bioInput);
                            customizeProfileModal.addComponents(customizeProfileModalRow);
                            await profileConfirmation.showModal(customizeProfileModal);
    
                            const components: any = [new ActionRowBuilder().addComponents(profileOption)];
                            response = await (followUp ? response.edit({ components }) : interaction.editReply({ components }));
                        }
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Collector received no interactions before ending with reason: time") {
                    profileEmbed.setFooter({
                        text: `⏱️ This command is only active for 5 minutes. To use it again, please type /profile.`
                    });
                    await interaction.editReply({
                        embeds: [profileEmbed],
                        components: []
                    });
                } else {
                    console.log(`Profile Command Error: ${error}`);
                }
            }
        }

    }
};