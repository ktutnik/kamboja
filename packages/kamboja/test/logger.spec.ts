import * as Chai from "chai"
import * as Core from "../src/core"
import { Logger } from "../src/logger"
import { DefaultIdentifierResolver } from "../src/resolver"
import * as H from "./helper"

describe("Logger", () => {
    it("Should show black on info", () => {
        let logger = new Logger("Info")
        logger.info("Hello this is logger!")
    })

    it("Should show yellow on warning", () => {
        let logger = new Logger("Info")
        logger.warning("Hello this is logger!")
    })

    it("Should show red on error", () => {
        let logger = new Logger("Info")
        logger.error("Hello this is logger!")
    })

    it("Should add new line", () => {
        let logger = new Logger("Info")
        logger.newLine().info("Hello this is logger!")
    })

    it("Warning mode should not show info", () => {
        let logger = new Logger("Warning")
        logger.info("Hello this is logger!")
        logger.warning("Hello this is logger!")
        logger.error("Hello this is logger!")
    })

    it("Error mode should not show info and warning", () => {
        let logger = new Logger("Error")
        logger.info("Hello this is logger!")
        logger.warning("Hello this is logger!")
        logger.error("Hello this is logger!")
    })

    it("Silent mode should not show anything", () => {
        let logger = new Logger("None")
        logger.info("Hello this is logger!")
        logger.warning("Hello this is logger!")
        logger.error("Hello this is logger!")
    })
})
