import * as Chai from "chai"
import * as Core from "../src/core"
import { MetaDataStorage } from "../src/metadata-storage"
import { DefaultIdentifierResolver } from "../src/resolver"
import * as H from "./helper"

describe("MetaDataStorage", () => {
    describe("cleanupFileName", () => {
        let storage: MetaDataStorage;
        beforeEach(() => {
            storage = new MetaDataStorage(new DefaultIdentifierResolver())
        })

        it("Should remove preceding ./", () => {
            let result = storage.cleanupFileName("./the/path/of/files")
            Chai.expect(result).eq("the/path/of/files")
        })

        it("Should remove preceding /", () => {
            let result = storage.cleanupFileName("/the/path/of/files")
            Chai.expect(result).eq("the/path/of/files")
        })

        it("Should remove trailing .js", () => {
            let result = storage.cleanupFileName("the/path/of/files.js")
            Chai.expect(result).eq("the/path/of/files")
        })

        it("Should remove trailing .JS", () => {
            let result = storage.cleanupFileName("the/path/of/files.JS")
            Chai.expect(result).eq("the/path/of/files")
        })
    })

    describe("get", () => {
        let storage: MetaDataStorage;
        beforeEach(() => {
            storage = new MetaDataStorage(new DefaultIdentifierResolver())
        })

        it("Should return class by qualified name properly", () => {
            let meta = H.fromCode(`
                    "use strict";
                    var MyClass = (function () {
                        function MyClass() {
                        }
                        MyClass.prototype.getByPage = function () { };
                        return MyClass;
                    }());
                    exports.MyClass = MyClass;
                    `, "path/class.js")
            storage.save(meta)
            let result = storage.get("MyClass, ./path/class.js")
            Chai.expect(result.name).eq("MyClass")
        })

        it("Should return class by qualified name in deep namespace", () => {
            let meta = H.fromCode(`
                    var MyNameSpace;
                    (function (MyNameSpace) {
                        var MyClass = (function (_super) {
                            tslib_1.__extends(MyClass, _super);
                            function MyClass() {
                                return _super !== null && _super.apply(this, arguments) || this;
                            }
                            MyClass.prototype.getByPage = function () { };
                            return MyClass;
                        }(controller_1.Controller));
                        MyNameSpace.MyClass = MyClass;
                    })(MyNameSpace = exports.MyNameSpace || (exports.MyNameSpace = {}));
                    `, "path/namespaced-class.js")
            storage.save(meta)
            let result = storage.get("MyNameSpace.MyClass, ./path/namespaced-class")
            Chai.expect(result.name).eq("MyClass")
        })

        it("Should not error when no classes found", () => {
            let meta = H.fromCode(`
                    var MyNameSpace;
                    (function (MyNameSpace) {
                        var MyClass = (function (_super) {
                            tslib_1.__extends(MyClass, _super);
                            function MyClass() {
                                return _super !== null && _super.apply(this, arguments) || this;
                            }
                            MyClass.prototype.getByPage = function () { };
                            return MyClass;
                        }(controller_1.Controller));
                        MyNameSpace.MyClass = MyClass;
                    })(MyNameSpace = exports.MyNameSpace || (exports.MyNameSpace = {}));
                    `, "path/namespaced-class.js")
            storage.save(meta)
            let result = storage.get("MyNameSpace.MyOtherClass, ./path/namespaced-class")
            Chai.expect(result).undefined
        })

        it("Should throw when provided non qualified name", () => {
            let meta = H.fromCode(`
                    var MyNameSpace;
                    (function (MyNameSpace) {
                        var MyClass = (function (_super) {
                            tslib_1.__extends(MyClass, _super);
                            function MyClass() {
                                return _super !== null && _super.apply(this, arguments) || this;
                            }
                            MyClass.prototype.getByPage = function () { };
                            return MyClass;
                        }(controller_1.Controller));
                        MyNameSpace.MyClass = MyClass;
                    })(MyNameSpace = exports.MyNameSpace || (exports.MyNameSpace = {}));
                    `, "path/namespaced-class.js")
            storage.save(meta)

            Chai.expect(() => storage.get("MyNameSpace.MyClass"))
                .throw(/not a qualified name/)
        })
    })
})
