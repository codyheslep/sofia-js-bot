/* eslint-disable indent */
/* eslint-disable quote-props */
import {
    ConversationState,
    UserState,
    TeamsActivityHandler,
    TurnContext
} from "botbuilder";
import { WaterfallStepContext } from "botbuilder-dialogs";
import { MainDialog } from "./dialogs/mainDialog";

const axios = require("axios");

export class DialogBot extends TeamsActivityHandler {
    public dialogState: any;

    constructor(public conversationState: ConversationState, public userState: UserState, public dialog: MainDialog) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty("DialogState");

        this.onMessage(async (context, next) => {
            // Run the MainDialog with the new message Activity.
            // await this.dialog.run(context, this.dialogState);
            // await next();

            const postData = {
                utterance: context.activity.text,
                mm_num: "310193917",
                language: "en",
                sessionId: "0",
                sessionVars: "null"
            };

            const axiosConfig = {
                headers: {
                    Authorization: "Basic Z2VuZXN5c2FkbWluLUkzOiFnZW5lc3lzIzI4",
                    "Access-Control-Allow-Origin": "*"
                }
            };

            let response = "";

            await axios.post("http://localhost:8080/benefits/livekinnect/admin/processIntentOptionGenesysCloud", postData, axiosConfig)
            .then(res => {
                console.log(`statusCode: ${res.status}`);
                response = res.data.message;
            })
            .catch(error => {
                response = "I found an error :(";
                console.error(error);
            });

            await context.sendActivity(response);
            await next();
        });
    }

    public async run(context: TurnContext) {
        await super.run(context);
        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}
