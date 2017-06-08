import * as Chalk from "chalk"
import { LogType } from "kamboja-core"

export class Logger {
    constructor(private type: LogType) { }

    private log(type: "Info" | "Warning" | "Error", message: string) {
        let chalk: (...string) => string;
        let prefix = ""
        switch (type) {
            case "Error":
                prefix = "Error: "
                chalk = Chalk.red
                break;
            case "Warning":
                prefix = "Warning: "
                chalk = Chalk.yellow;
                break
            default:
                chalk = Chalk.black;
                break
        }
        console.log(chalk(Chalk.bold("  [Kamboja] ")) + chalk(prefix + message))
        return this;
    }

    info(message: string) {
        if (this.type == "Info")
            return this.log("Info", message)
        else return this;
    }

    error(message: string) {
        if (this.type == "Info" || this.type == "Warning" || this.type == "Error")
            return this.log("Error", message)
        else return this;
    }

    warning(message: string) {
        if (this.type == "Info" || this.type == "Warning")
            return this.log("Warning", message)
        else return this;
    }

    newLine() {
        console.log();
        return this
    }
}
