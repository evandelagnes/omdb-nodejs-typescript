import {
    GoogleSpreadsheet,
    GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { env } from "@providers";

class SpreadSheet {
    private _doc: GoogleSpreadsheet | undefined;
    private _sheet: GoogleSpreadsheetWorksheet | undefined;

    constructor() {}

    public async checkAndCreateSheet(
        title: string,
        headerValues: Array<string>
    ): Promise<void> {
        this._doc = new GoogleSpreadsheet(env.GOOGLE_SPREADSHEET_FILE_ID);

        await this._doc.useServiceAccountAuth({
            client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: env.GOOGLE_PRIVATE_KEY,
        });
        await this._doc.loadInfo();

        if (this._doc.sheetCount <= 0)
            throw new Error("No sheets in this file");

        // get the key in insensitive case check to avoid errors
        const key =
            Object.keys(this._doc.sheetsByTitle).find(
                (key) => key.toLowerCase() === title.toLowerCase()
            ) || false;

        if (key) {
            this._sheet = this._doc.sheetsByTitle[key];
        } else {
            this._sheet = await this._doc.addSheet({
                title,
                headerValues,
            });
        }
    }

    public async clearRows(): Promise<void> {
        if (this._sheet === undefined)
            throw new Error("No sheets in this file");
        return await this._sheet.clearRows();
    }

    public async addRow(row: { [header: string]: string }): Promise<void> {
        if (this._sheet === undefined)
            throw new Error("No sheets in this file");
        await this._sheet.addRow(row);
    }
}

export default new SpreadSheet();
