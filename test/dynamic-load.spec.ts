import * as fs from "fs"
import * as path from "path"
import * as Babylon from "babylon"
import * as Kenanga from "kenanga"

describe("Dynamic Load", () => {
    it("Should load class dynamically", () => {
        let filePath = path.join(__dirname, "./dummy.js");
        var code = fs.readFileSync(filePath).toString();
        var ast = Babylon.parse(code);
        var meta = Kenanga.transform(ast, filePath);
        let theModule = require(filePath);
        let dummy = new theModule[meta.children[0].name]();
        dummy.print();
        let strPath = process.cwd();
    })
})