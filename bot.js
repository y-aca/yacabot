// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const { ChoicePrompt, DialogSet, NumberPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');

const DIALOG_STATE_PROPERTY = 'dialogState';

const WELCOMED_USER = 'welcomedUserProperty';
const PEDRO_DIALOG = 'pedroDialog';

class MyBot {
    constructor(userState, conversationState) {
        // Creates a new user property accessor.
        // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.userState = userState;
        this.conversationState = conversationState;

        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);

        this.dialogs = new DialogSet(this.dialogState);
        this.dialogs.add(new WaterfallDialog(PEDRO_DIALOG, [
            this.pedroPresentation.bind(this),
            this.sandwich.bind(this),
            this.frequency.bind(this),

            this.sugar.bind(this),

            this.result.bind(this)

        ]));
    }

    async pedroPresentation(step) {
        await step.context.sendActivity("Je suis Pedro, j'ai 101 an. J\'habite à Lentas, un petit village de pêcheur.")
        await step.context.sendActivity("Je mange du poisson tous les jours avec des légumes et de l'ail arrosé d'huile d'olive, un vrai régal crétois !")
        return step.context.sendActivity("Et pour toi, c'est quoi un repas type ?")
    }

    async sandwich(step) {
        return step.context.sendActivity("Pratique le sandwich ! Lequel préfères-tu ?")
    }


    async frequency(step) {
        return step.context.sendActivity("Tous les jours le même ?")
    }


    async sugar(step) {
        return step.context.sendActivity("Quelques plaisirs sucrés ?")
    }

    async result(step) {
        return step.context.sendActivity("Regarde ce que j'ai fait de notre échange !")
    }

    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            const dialogContext = await this.dialogs.createContext(turnContext);
            await dialogContext.continueDialog();
            if (!turnContext.responded) {
                await dialogContext.beginDialog(PEDRO_DIALOG);
            }
            await this.userState.saveChanges(turnContext)
            await this.conversationState.saveChanges(turnContext);
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`)
        }
    }
}

module.exports.MyBot = MyBot;
