"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getBounds_1 = __importDefault(require("../utils/getBounds"));
var getOffsetTop_1 = __importDefault(require("../utils/getOffsetTop"));
var functions_1 = require("./functions");
var Observer = /** @class */ (function () {
    function Observer(controller, _a) {
        var element = _a.element, _b = _a.normalizeInitialView, normalizeInitialView = _b === void 0 ? false : _b, _c = _a.offsetStart, offsetStart = _c === void 0 ? 0 : _c, _d = _a.offsetEnd, offsetEnd = _d === void 0 ? 0 : _d, start = _a.start, distance = _a.distance, tween = _a.tween, _e = _a.addClasses, addClasses = _e === void 0 ? false : _e, _f = _a.callback, callback = _f === void 0 ? function () { } : _f;
        this.controller = controller;
        this.element = element;
        this.start = 0;
        this.distance = 0;
        this.options = {
            normalizeInitialView: normalizeInitialView,
            offsetStart: offsetStart,
            offsetEnd: offsetEnd,
            start: start,
            distance: distance,
            tween: {
                element: (tween === null || tween === void 0 ? void 0 : tween.element) || this.element,
                css: tween === null || tween === void 0 ? void 0 : tween.css,
            },
            addClasses: addClasses,
            callback: callback,
        };
        this.bounds = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0,
        };
        this.init();
    }
    Observer.prototype.construct = function () {
        var viewport = this.controller.viewport;
        if (!viewport)
            return;
        var tween = this.options.tween;
        if (tween.css)
            (0, functions_1.applyTween)(tween, 0);
        this.bounds = (0, getBounds_1.default)(this.element);
        var viewBounds = viewport.getBounds().viewable;
        var scrollY = this.controller.scroll.scrollY;
        var offsetTop = (0, getOffsetTop_1.default)(this.bounds.top, viewBounds.top, scrollY);
        var inInitialView = (0, functions_1.getInInitialView)(offsetTop, viewBounds);
        this.start = (0, functions_1.getStart)(offsetTop, inInitialView, this.options, viewport);
        this.distance = (0, functions_1.getDistance)(offsetTop, inInitialView, this.options, viewport, this.bounds);
        this.update();
    };
    Observer.prototype.init = function () {
        this.construct();
        this.controller.items.observer.add(this);
    };
    Observer.prototype.kill = function () {
        this.controller.items.observer.delete(this);
    };
    Observer.prototype.update = function () {
        var scrollY = this.controller.scroll.scrollY;
        var _a = this.options, tween = _a.tween, addClasses = _a.addClasses, callback = _a.callback;
        var progress = (0, functions_1.getProgress)(this.start, this.distance, scrollY);
        var inViewport = progress > 0 && progress < 1;
        if (tween.css)
            (0, functions_1.applyTween)(tween, progress);
        if (addClasses)
            (0, functions_1.applyClasses)(this.element, progress);
        if (callback && typeof callback === 'function') {
            callback({ progress: progress, inViewport: inViewport });
        }
    };
    Observer.prototype.refresh = function () {
        this.construct();
    };
    return Observer;
}());
exports.default = Observer;
