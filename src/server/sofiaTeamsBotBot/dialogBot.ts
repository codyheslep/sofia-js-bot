import {
    ConversationState,
    UserState,
    TeamsActivityHandler,
    TurnContext
} from "botbuilder";
import { WaterfallStepContext } from "botbuilder-dialogs";
import { MainDialog } from "./dialogs/mainDialog";

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

            const url = "http://localhost:8080/benefits/livekinnect/admin/processIntentOptionGenesysCloud";
            const query = {
                utterance: context.activity.text,
                mm_num: "310193917",
                language: "en",
                sessionId: "0",
                sessionVars: "null"
            };

            console.log("test");

            let response = "";

            await fetch(url, {
                method: "POST",
                headers: { Authorization: "Basic Z2VuZXN5c2FkbWluLUkzOiFnZW5lc3lzIzI4" },
                body: JSON.stringify(query)
            }).then(resp => resp.json()).then(data => {
                console.log("got a response!");
                console.log(data);
                response = data.message;
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
