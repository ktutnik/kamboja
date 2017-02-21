import * as Chai from "chai"
import * as H from "../helper"
import * as Kecubung from "kecubung"
import { RangeValidator } from "../../src/validator/range-validator"

describe("RangeValidator", () => {
    it("Should return undefined if provided object", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.getByPage = function (model) {
                };
                return MyClass;
            }(controller_1.Controller));
            tslib_1.__decorate([
                tslib_1.__param(0, src_1.val.range(10)),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new RangeValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate({
            value: { data: "hellow" },
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "model"
        })
        Chai.expect(result).undefined
    })

    it("Should return undefined if provided null", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.getByPage = function (model) {
                };
                return MyClass;
            }(controller_1.Controller));
            tslib_1.__decorate([
                tslib_1.__param(0, src_1.val.range(10)),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new RangeValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate({
            value: null,
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "model"
        })
        Chai.expect(result).undefined
    })

    it("Should return provide parent name on the field", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.getByPage = function (model) {
                };
                return MyClass;
            }(controller_1.Controller));
            tslib_1.__decorate([
                tslib_1.__param(0, src_1.val.range(10)),
            ], MyClass.prototype, "getByPage", null);
            exports.MyClass = MyClass;
            `)
        let test = new RangeValidator();
        let clazz = <Kecubung.ClassMetaData>meta.children[0]
        let result = test.validate({
            value: "123456789",
            classInfo: clazz,
            decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
            field: "model",
            parentField: "parent"
        })
        Chai.expect(result[0].field).eq("parent.model")
    })

    describe("String value", () => {
        it("Should return error message when string length less then specified", () => {
            let meta = H.fromCode(`
                var MyClass = (function (_super) {
                    tslib_1.__extends(MyClass, _super);
                    function MyClass() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MyClass.prototype.getByPage = function (model) {
                    };
                    return MyClass;
                }(controller_1.Controller));
                tslib_1.__decorate([
                    tslib_1.__param(0, src_1.val.range(10)),
                ], MyClass.prototype, "getByPage", null);
                exports.MyClass = MyClass;
                `)
            let test = new RangeValidator();
            let clazz = <Kecubung.ClassMetaData>meta.children[0]
            let result = test.validate({
                value: "123456789",
                classInfo: clazz,
                decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
                field: "model"
            })
            Chai.expect(result[0].field).eq("model")
            Chai.expect(result[0].message).contain("more than 10 characters")
        })

        it("Should return error message when string length more then specified", () => {
            let meta = H.fromCode(`
                var MyClass = (function (_super) {
                    tslib_1.__extends(MyClass, _super);
                    function MyClass() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MyClass.prototype.getByPage = function (model) {
                    };
                    return MyClass;
                }(controller_1.Controller));
                tslib_1.__decorate([
                    tslib_1.__param(0, src_1.val.range(0, 5)),
                ], MyClass.prototype, "getByPage", null);
                exports.MyClass = MyClass;
                `)
            let test = new RangeValidator();
            let clazz = <Kecubung.ClassMetaData>meta.children[0]
            let result = test.validate({
                value: "123456",
                classInfo: clazz,
                decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
                field: "model"
            })
            Chai.expect(result[0].field).eq("model")
            Chai.expect(result[0].message).contain("less than 5 characters")
        })

        it("Should return undefined when provided correct value", () => {
            let meta = H.fromCode(`
                var MyClass = (function (_super) {
                    tslib_1.__extends(MyClass, _super);
                    function MyClass() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MyClass.prototype.getByPage = function (model) {
                    };
                    return MyClass;
                }(controller_1.Controller));
                tslib_1.__decorate([
                    tslib_1.__param(0, src_1.val.range(0, 5)),
                ], MyClass.prototype, "getByPage", null);
                exports.MyClass = MyClass;
                `)
            let test = new RangeValidator();
            let clazz = <Kecubung.ClassMetaData>meta.children[0]
            let result = test.validate({
                value: "1234",
                classInfo: clazz,
                decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
                field: "model"
            })
            Chai.expect(result).undefined
        })

        it("Should able to use custom message", () => {
            let meta = H.fromCode(`
                var MyClass = (function (_super) {
                    tslib_1.__extends(MyClass, _super);
                    function MyClass() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MyClass.prototype.getByPage = function (model) {
                    };
                    return MyClass;
                }(controller_1.Controller));
                tslib_1.__decorate([
                    tslib_1.__param(0, src_1.val.range(0, 5, "The string is too long")),
                ], MyClass.prototype, "getByPage", null);
                exports.MyClass = MyClass;
                `)
            let test = new RangeValidator();
            let clazz = <Kecubung.ClassMetaData>meta.children[0]
            let result = test.validate({
                value: "123456",
                classInfo: clazz,
                decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
                field: "model"
            })
            Chai.expect(result[0].field).eq("model")
            Chai.expect(result[0].message).eq("The string is too long")
        })
    })

    describe("Number value", () => {
        it("Should return error message when number less then specified", () => {
            let meta = H.fromCode(`
                var MyClass = (function (_super) {
                    tslib_1.__extends(MyClass, _super);
                    function MyClass() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MyClass.prototype.getByPage = function (model) {
                    };
                    return MyClass;
                }(controller_1.Controller));
                tslib_1.__decorate([
                    tslib_1.__param(0, src_1.val.range(10)),
                ], MyClass.prototype, "getByPage", null);
                exports.MyClass = MyClass;
                `)
            let test = new RangeValidator();
            let clazz = <Kecubung.ClassMetaData>meta.children[0]
            let result = test.validate({
                value: 9,
                classInfo: clazz,
                decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
                field: "model"
            })
            Chai.expect(result[0].field).eq("model")
            Chai.expect(result[0].message).contain("greater than 10")
        })

        it("Should return error message when number less then specified", () => {
            let meta = H.fromCode(`
                var MyClass = (function (_super) {
                    tslib_1.__extends(MyClass, _super);
                    function MyClass() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MyClass.prototype.getByPage = function (model) {
                    };
                    return MyClass;
                }(controller_1.Controller));
                tslib_1.__decorate([
                    tslib_1.__param(0, src_1.val.range(0, 99)),
                ], MyClass.prototype, "getByPage", null);
                exports.MyClass = MyClass;
                `)
            let test = new RangeValidator();
            let clazz = <Kecubung.ClassMetaData>meta.children[0]
            let result = test.validate({
                value: 100,
                classInfo: clazz,
                decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
                field: "model"
            })
            Chai.expect(result[0].field).eq("model")
            Chai.expect(result[0].message).contain("less than 99")
        })

        it("Should return error message when number less then specified", () => {
            let meta = H.fromCode(`
                var MyClass = (function (_super) {
                    tslib_1.__extends(MyClass, _super);
                    function MyClass() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MyClass.prototype.getByPage = function (model) {
                    };
                    return MyClass;
                }(controller_1.Controller));
                tslib_1.__decorate([
                    tslib_1.__param(0, src_1.val.range(0, 99)),
                ], MyClass.prototype, "getByPage", null);
                exports.MyClass = MyClass;
                `)
            let test = new RangeValidator();
            let clazz = <Kecubung.ClassMetaData>meta.children[0]
            let result = test.validate({
                value: 80,
                classInfo: clazz,
                decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
                field: "model"
            })
            Chai.expect(result).undefined
        })

        it("Should able to use custom message", () => {
            let meta = H.fromCode(`
                var MyClass = (function (_super) {
                    tslib_1.__extends(MyClass, _super);
                    function MyClass() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MyClass.prototype.getByPage = function (model) {
                    };
                    return MyClass;
                }(controller_1.Controller));
                tslib_1.__decorate([
                    tslib_1.__param(0, src_1.val.range(0, 60, "You are too old")),
                ], MyClass.prototype, "getByPage", null);
                exports.MyClass = MyClass;
                `)
            let test = new RangeValidator();
            let clazz = <Kecubung.ClassMetaData>meta.children[0]
            let result = test.validate({
                value: 61,
                classInfo: clazz,
                decoratorArgs: clazz.methods[0].parameters[0].decorators[0].parameters,
                field: "model"
            })
            Chai.expect(result[0].field).eq("model")
            Chai.expect(result[0].message).eq("You are too old")
        })
    })
})