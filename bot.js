// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder')
const { ChoicePrompt, DialogSet, NumberPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs')

const DIALOG_STATE_PROPERTY = 'dialogState'

const WELCOMED_USER = 'welcomedUserProperty'
const PAUL_DIALOG = 'paulDialog'

class MyBot {
    constructor(userState, conversationState) {
        // Creates a new user property accessor.
        // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER)

        this.userState = userState
        this.conversationState = conversationState

        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);

        this.dialogs = new DialogSet(this.dialogState);
        this.dialogs.add(new WaterfallDialog(PAUL_DIALOG, [
            this.howAreYou.bind(this),
            this.tired.bind(this),
            this.overhelmed.bind(this),
            this.hobbies_time.bind(this),
            this.liked_activity.bind(this),
            this.liked_activity_frequency.bind(this),
            this.liked_activity_eating.bind(this),
            this.eating_habits_balanced.bind(this),
            this.eating_habits_sugar.bind(this),
            this.eating_habits_fat.bind(this),
            this.results.bind(this),
        ]));
    }

    async howAreYou(step) {
        return step.context.sendActivity("Et toi, comment ça va ?")
    }

    async tired(step) {
        return step.context.sendActivity("Ah bon, fatigué le matin ?")
    }

    async overhelmed(step) {
        return step.context.sendActivity("Te sens-tu débordé ?")
    }

    async hobbies_time(step) {
        return step.context.sendActivity("As-tu du temps pour tes loisirs ?")
    }

    async liked_activity(step) {
        return step.context.sendActivity("Qu'est ce qui te fait du bien ?")
    }

    async liked_activity_frequency(step) {
        return step.context.sendActivity("Combien de fois par semaine ?")
    }

    async liked_activity_eating(step) {
        return step.context.sendActivity("Tu manges avant ?")
    }

    async eating_habits_balanced(step) {
        await step.context.sendActivity("Quelles sont tes habitudes de repas dans la semaine ?")
        return step.context.sendActivity("Équilibré ?")
    }

    async eating_habits_sugar(step) {
        return step.context.sendActivity("Sucré ?")
    }

    async eating_habits_fat(step) {
        return step.context.sendActivity("Gras ?")
    }

    async results(step) {
        await step.context.sendActivity("Merci de ta dispo !")
        await step.context.sendActivity("Voilà ton profil santé aujourd'hui : XXX")
        await step.context.sendActivity("Bravo, ton profil activité physique est top !")
        await step.context.sendActivity("Toutes ces habitudes de vie sont nécessaires pour ta santé d'aujourd'hui et de demain")
        return step.context.sendActivity("Je te propose de relever un challenge / défi en cliquant sur une habitude de vie à améliorer !")
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
                await dialogContext.beginDialog(PAUL_DIALOG);
            }
            await this.userState.saveChanges(turnContext)
            await this.conversationState.saveChanges(turnContext);
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`)
        }
    }
}

module.exports.MyBot = MyBot;
