import * as Chai from "chai"
import * as Core from "../src/core"
import { InMemoryMetaDataStorage } from "../src/metadata-storage"
import { DefaultIdentifierResolver } from "../src/resolver"
import * as H from "./helper"

describe("MetaDataStorage", () => {

    describe("save", () => {
        let storage: InMemoryMetaDataStorage;
        beforeEach(() => {
            storage = new InMemoryMetaDataStorage(new DefaultIdentifierResolver())
        })

        it("Should save class properly", () => {
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

        it("Should not duplicate saved class", () => {
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
            let dupe = H.fromCode(`
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
            storage.save(dupe)
            let result = storage.get("MyClass, ./path/class.js")
            Chai.expect(result.name).eq("MyClass")
        })
    })

    describe("get", () => {
        let storage: InMemoryMetaDataStorage;
        beforeEach(() => {
            storage = new InMemoryMetaDataStorage(new DefaultIdentifierResolver())
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
                .throw(/Provided name is not qualified/)
        })
    })
})
