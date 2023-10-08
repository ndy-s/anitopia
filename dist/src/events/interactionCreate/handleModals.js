"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getLocalModals_1 = require("../../utils/getLocalModals");
exports.default = async (client, interaction) => {
    if (!interaction.isModalSubmit())
        return;
    try {
        const localModalHandler = (0, getLocalModals_1.default)();
        const modalHandlerObject = localModalHandler.find((mdl) => mdl.name === interaction.customId);
        await modalHandlerObject.callback(client, interaction);
    }
    catch (error) {
        console.log(`There was an error running this modal submit handler: ${error}`);
    }
};