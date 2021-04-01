"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var color_picker_service_1 = require("./color-picker.service");
var formats_1 = require("./formats");
var helpers_1 = require("./helpers");
var ColorPickerComponent = (function () {
    function ColorPickerComponent(el, cdr, service) {
        this.el = el;
        this.cdr = cdr;
        this.service = service;
        this.dialogArrowSize = 10;
        this.dialogArrowOffset = 15;
        this.useRootViewContainer = false;
        this.isIE10 = false;
    }
    ColorPickerComponent.prototype.setDialog = function (instance, elementRef, color, cpPosition, cpPositionOffset, cpPositionRelativeToArrow, cpOutputFormat, cpPresetLabel, cpPresetEmptyMessage, cpPresetEmptyMessageClass, cpPresetColors, cpMaxPresetColorsLength, cpCancelButton, cpCancelButtonClass, cpCancelButtonText, cpOKButton, cpOKButtonClass, cpOKButtonText, cpAddColorButton, cpAddColorButtonClass, cpAddColorButtonText, cpRemoveColorButtonClass, cpHeight, cpWidth, cpIgnoredElements, cpDialogDisplay, cpSaveClickOutside, cpAlphaChannel, cpUseRootViewContainer) {
        this.directiveInstance = instance;
        this.initialColor = color;
        this.directiveElementRef = elementRef;
        this.cpPosition = cpPosition;
        this.cpPositionOffset = parseInt(cpPositionOffset);
        if (!cpPositionRelativeToArrow) {
            this.dialogArrowOffset = 0;
        }
        this.cpOutputFormat = cpOutputFormat;
        this.cpPresetLabel = cpPresetLabel;
        this.cpPresetEmptyMessage = cpPresetEmptyMessage;
        this.cpPresetEmptyMessageClass = cpPresetEmptyMessageClass;
        this.cpPresetColors = cpPresetColors;
        this.cpMaxPresetColorsLength = cpMaxPresetColorsLength;
        this.cpCancelButton = cpCancelButton;
        this.cpCancelButtonClass = cpCancelButtonClass;
        this.cpCancelButtonText = cpCancelButtonText;
        this.cpOKButton = cpOKButton;
        this.cpOKButtonClass = cpOKButtonClass;
        this.cpOKButtonText = cpOKButtonText;
        this.cpAddColorButton = cpAddColorButton;
        this.cpAddColorButtonClass = cpAddColorButtonClass;
        this.cpAddColorButtonText = cpAddColorButtonText;
        this.cpRemoveColorButtonClass = cpRemoveColorButtonClass;
        this.width = this.cpWidth = parseInt(cpWidth);
        this.height = this.cpHeight = parseInt(cpHeight);
        this.cpIgnoredElements = cpIgnoredElements;
        this.cpDialogDisplay = cpDialogDisplay;
        if (this.cpDialogDisplay === 'inline') {
            this.dialogArrowOffset = 0;
            this.dialogArrowSize = 0;
        }
        this.cpSaveClickOutside = cpSaveClickOutside;
        this.cpAlphaChannel = cpAlphaChannel;
        this.useRootViewContainer = cpUseRootViewContainer;
        if (cpOutputFormat === 'hex' && cpAlphaChannel !== 'always' && cpAlphaChannel !== 'hex8') {
            this.cpAlphaChannel = 'disabled';
        }
        this.isIE10 = helpers_1.detectIE() === 10;
    };
    ColorPickerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var alphaWidth = this.alphaSlider.nativeElement.offsetWidth;
        var hueWidth = this.hueSlider.nativeElement.offsetWidth;
        this.sliderDimMax = new helpers_1.SliderDimension(hueWidth + 42, this.cpWidth - 32, 130, alphaWidth);
        this.slider = new helpers_1.SliderPosition(0, 0, 0, 0);
        if (this.cpOutputFormat === 'rgba') {
            this.format = 1;
        }
        else if (this.cpOutputFormat === 'hsla') {
            this.format = 2;
        }
        else {
            this.format = 0;
        }
        this.listenerMouseDown = function (event) { _this.onMouseDown(event); };
        this.listenerResize = function () { _this.onResize(); };
        this.openDialog(this.initialColor, false);
    };
    ColorPickerComponent.prototype.ngAfterViewInit = function () {
        if (this.cpWidth != 272) {
            var alphaWidth = this.alphaSlider.nativeElement.offsetWidth;
            var hueWidth = this.hueSlider.nativeElement.offsetWidth;
            this.sliderDimMax = new helpers_1.SliderDimension(hueWidth, this.cpWidth, 130, alphaWidth);
            this.update(false);
            this.cdr.detectChanges();
        }
    };
    ColorPickerComponent.prototype.setInitialColor = function (color) {
        this.initialColor = color;
    };
    ColorPickerComponent.prototype.setPresetConfig = function (cpPresetLabel, cpPresetColors) {
        this.cpPresetLabel = cpPresetLabel;
        this.cpPresetColors = cpPresetColors;
    };
    ColorPickerComponent.prototype.openDialog = function (color, emit) {
        if (emit === void 0) { emit = true; }
        this.service.setActive(this);
        if (!this.width) {
            this.cpWidth = this.directiveElementRef.nativeElement.offsetWidth;
        }
        this.setInitialColor(color);
        this.setColorFromString(color, emit);
        this.openColorPicker();
    };
    ColorPickerComponent.prototype.cancelColor = function (event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        this.setColorFromString(this.initialColor, true);
        if (this.cpDialogDisplay === 'popup') {
            this.directiveInstance.colorChanged(this.initialColor, true);
            this.closeColorPicker();
        }
        this.directiveInstance.colorCanceled();
    };
    ColorPickerComponent.prototype.oKColor = function (event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        if (this.cpDialogDisplay === 'popup') {
            this.closeColorPicker();
        }
        if (this.outputColor) {
            this.directiveInstance.colorSelected(this.outputColor);
        }
    };
    ColorPickerComponent.prototype.setColorFromString = function (value, emit, update) {
        if (emit === void 0) { emit = true; }
        if (update === void 0) { update = true; }
        var hsva;
        if (this.cpAlphaChannel === 'always' || this.cpAlphaChannel === 'hex8') {
            hsva = this.service.stringToHsva(value, true);
            if (!hsva && !this.hsva) {
                hsva = this.service.stringToHsva(value, false);
            }
        }
        else {
            hsva = this.service.stringToHsva(value, false);
        }
        if (hsva) {
            this.hsva = hsva;
            this.update(emit, update);
        }
    };
    ColorPickerComponent.prototype.addPresetColor = function (event, value) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        if (!this.cpPresetColors.filter(function (color) { return color === value; }).length) {
            this.cpPresetColors = this.cpPresetColors.concat(value);
            this.directiveInstance.presetColorsChanged(this.cpPresetColors);
        }
    };
    ColorPickerComponent.prototype.removePresetColor = function (event, value) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        this.cpPresetColors = this.cpPresetColors.filter(function (color) { return color !== value; });
        this.directiveInstance.presetColorsChanged(this.cpPresetColors);
    };
    ColorPickerComponent.prototype.onDragEnd = function (slider) {
        this.directiveInstance.sliderDragEnd({ slider: slider, color: this.outputColor });
    };
    ColorPickerComponent.prototype.onDragStart = function (slider) {
        this.directiveInstance.sliderDragStart({ slider: slider, color: this.outputColor });
    };
    ColorPickerComponent.prototype.onMouseDown = function (event) {
        // Workaround for IE10: We need to manually click on OK/Cancel button to close the color-picker [detectIE() !== 10]
        if ((!this.isDescendant(this.el.nativeElement, event.target)
            && event.target != this.directiveElementRef.nativeElement &&
            this.cpIgnoredElements.filter(function (item) { return item === event.target; }).length === 0) &&
            this.cpDialogDisplay === 'popup' && !this.isIE10) {
            if (!this.cpSaveClickOutside) {
                this.setColorFromString(this.initialColor, false);
                this.directiveInstance.colorChanged(this.initialColor);
            }
            this.closeColorPicker();
        }
    };
    ColorPickerComponent.prototype.openColorPicker = function () {
        var _this = this;
        if (!this.show) {
            this.show = true;
            this.hidden = true;
            setTimeout(function () {
                _this.setDialogPosition();
                _this.hidden = false;
                _this.cdr.detectChanges();
            }, 0);
            this.directiveInstance.toggle(true);
            /**
             * Required for IE10
             * This event listener is conditional to avoid memory leaks
             * If the directive was applied at the root level then this won't affect anything
             * but if we implement this color picker in child components then it closes on clicking anywhere (including this component)
             * and stopPropagation() does not work
             */
            if (!this.isIE10) {
                document.addEventListener('mousedown', this.listenerMouseDown);
            }
            window.addEventListener('resize', this.listenerResize);
        }
    };
    ColorPickerComponent.prototype.closeColorPicker = function () {
        if (this.show) {
            this.show = false;
            this.directiveInstance.toggle(false);
            /**
             * Required for IE10
             * If this is not attached then no need to remove the listener
             */
            if (!this.isIE10) {
                document.removeEventListener('mousedown', this.listenerMouseDown);
            }
            window.removeEventListener('resize', this.listenerResize);
            if (!this.cdr['destroyed']) {
                this.cdr.detectChanges();
            }
        }
    };
    ColorPickerComponent.prototype.onResize = function () {
        if (this.position === 'fixed') {
            this.setDialogPosition();
        }
        else if (this.cpDialogDisplay !== 'inline') {
            this.closeColorPicker();
        }
    };
    ColorPickerComponent.prototype.setDialogPosition = function () {
        if (this.cpDialogDisplay === 'inline') {
            this.position = 'relative';
            return;
        }
        var dialogHeight = this.dialogElement.nativeElement.offsetHeight;
        var node = this.directiveElementRef.nativeElement.parentNode, position = 'static', transform = '';
        var parentNode = null, transformNode = null, style = null;
        while (node !== null && node.tagName !== 'HTML') {
            style = window.getComputedStyle(node);
            position = style.getPropertyValue("position");
            transform = style.getPropertyValue("transform");
            if (position !== 'static' && parentNode === null) {
                parentNode = node;
            }
            if (transform && transform !== 'none' && transformNode === null) {
                transformNode = node;
            }
            if (position === 'fixed') {
                parentNode = transformNode;
                break;
            }
            node = node.parentNode;
        }
        var boxDirective = this.createBox(this.directiveElementRef.nativeElement, (position !== 'fixed'));
        if ((position !== 'fixed' || parentNode) && !this.useRootViewContainer) {
            if (parentNode === null) {
                parentNode = node;
            }
            var boxParent = this.createBox(parentNode, (position !== 'fixed'));
            this.top = boxDirective.top - boxParent.top;
            this.left = boxDirective.left - boxParent.left;
        }
        else {
            this.top = boxDirective.top;
            this.left = boxDirective.left;
        }
        if (position === 'fixed') {
            this.position = 'fixed';
        }
        if (this.cpPosition === 'left') {
            this.top += boxDirective.height * this.cpPositionOffset / 100 - this.dialogArrowOffset;
            this.left -= this.cpWidth + this.dialogArrowSize - 2;
        }
        else if (this.cpPosition === 'top') {
            this.top -= dialogHeight + this.dialogArrowSize;
            this.left += this.cpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
            this.arrowTop = dialogHeight - 1;
        }
        else if (this.cpPosition === 'bottom') {
            this.top += boxDirective.height + this.dialogArrowSize;
            this.left += this.cpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
        }
        else {
            this.top += boxDirective.height * this.cpPositionOffset / 100 - this.dialogArrowOffset;
            this.left += boxDirective.width + this.dialogArrowSize - 2;
        }
    };
    ColorPickerComponent.prototype.setSaturation = function (val) {
        var hsla = this.service.hsva2hsla(this.hsva);
        hsla.s = val.v / val.rg;
        this.hsva = this.service.hsla2hsva(hsla);
        this.update();
        this.directiveInstance.inputChanged({ input: 'saturation', value: hsla.s, color: this.outputColor });
    };
    ColorPickerComponent.prototype.setLightness = function (val) {
        var hsla = this.service.hsva2hsla(this.hsva);
        hsla.l = val.v / val.rg;
        this.hsva = this.service.hsla2hsva(hsla);
        this.update();
        this.directiveInstance.inputChanged({ input: 'lightness', value: hsla.l, color: this.outputColor });
    };
    ColorPickerComponent.prototype.setHue = function (val) {
        this.hsva.h = val.v / val.rg;
        this.update();
        this.directiveInstance.sliderChanged({ slider: 'hue', value: this.hsva.h, color: this.outputColor });
    };
    ColorPickerComponent.prototype.setAlpha = function (val) {
        this.hsva.a = val.v / val.rg;
        this.update();
        this.directiveInstance.sliderChanged({ slider: 'alpha', value: this.hsva.a, color: this.outputColor });
    };
    ColorPickerComponent.prototype.setR = function (val) {
        var rgba = this.service.hsvaToRgba(this.hsva);
        rgba.r = val.v / val.rg;
        this.hsva = this.service.rgbaToHsva(rgba);
        this.update();
        this.directiveInstance.inputChanged({ input: 'red', value: rgba.r, color: this.outputColor });
    };
    ColorPickerComponent.prototype.setG = function (val) {
        var rgba = this.service.hsvaToRgba(this.hsva);
        rgba.g = val.v / val.rg;
        this.hsva = this.service.rgbaToHsva(rgba);
        this.update();
        this.directiveInstance.inputChanged({ input: 'green', value: rgba.g, color: this.outputColor });
    };
    ColorPickerComponent.prototype.setB = function (val) {
        var rgba = this.service.hsvaToRgba(this.hsva);
        rgba.b = val.v / val.rg;
        this.hsva = this.service.rgbaToHsva(rgba);
        this.update();
        this.directiveInstance.inputChanged({ input: 'blue', value: rgba.b, color: this.outputColor });
    };
    ColorPickerComponent.prototype.setA = function (val) {
        this.hsva.a = val.v / val.rg;
        this.update();
        this.directiveInstance.inputChanged({ input: 'alpha', value: this.hsva.a, color: this.outputColor });
    };
    ColorPickerComponent.prototype.setHex = function (val) {
        if (val === null) {
            this.update();
        }
        else {
            this.setColorFromString(val, true, false);
            this.directiveInstance.inputChanged({ input: 'hex', value: val, color: this.outputColor });
        }
    };
    ColorPickerComponent.prototype.setSaturationAndBrightness = function (val) {
        this.hsva.s = val.s / val.rgX;
        this.hsva.v = val.v / val.rgY;
        this.update();
        this.directiveInstance.sliderChanged({ slider: 'lightness', value: this.hsva.v, color: this.outputColor });
        this.directiveInstance.sliderChanged({ slider: 'saturation', value: this.hsva.s, color: this.outputColor });
    };
    ColorPickerComponent.prototype.formatPolicy = function () {
        this.format = (this.format + 1) % 3;
        return this.format;
    };
    ColorPickerComponent.prototype.update = function (emit, update) {
        if (emit === void 0) { emit = true; }
        if (update === void 0) { update = true; }
        if (this.sliderDimMax) {
            var hsla = this.service.hsva2hsla(this.hsva);
            var rgba = this.service.denormalizeRGBA(this.service.hsvaToRgba(this.hsva));
            var hueRgba = this.service.denormalizeRGBA(this.service.hsvaToRgba(new formats_1.Hsva(this.hsva.h, 1, 1, 1)));
            if (update) {
                this.hslaText = new formats_1.Hsla(Math.round((hsla.h) * 360), Math.round(hsla.s * 100), Math.round(hsla.l * 100), Math.round(hsla.a * 100) / 100);
                this.rgbaText = new formats_1.Rgba(rgba.r, rgba.g, rgba.b, Math.round(rgba.a * 100) / 100);
                this.hexText = this.service.hexText(rgba, this.cpAlphaChannel === 'always' || this.cpAlphaChannel === 'hex8');
            }
            this.alphaSliderColor = 'rgb(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ')';
            this.hueSliderColor = 'rgb(' + hueRgba.r + ',' + hueRgba.g + ',' + hueRgba.b + ')';
            var lastOutput = this.outputColor;
            this.outputColor = this.service.outputFormat(this.hsva, this.cpOutputFormat, this.cpAlphaChannel);
            this.selectedColor = this.service.outputFormat(this.hsva, 'rgba', null);
            this.slider = new helpers_1.SliderPosition((this.hsva.h) * this.sliderDimMax.h - 8, this.hsva.s * this.sliderDimMax.s - 8, (1 - this.hsva.v) * this.sliderDimMax.v - 8, this.hsva.a * this.sliderDimMax.a - 8);
            if (emit && lastOutput !== this.outputColor) {
                this.directiveInstance.colorChanged(this.outputColor);
            }
        }
    };
    ColorPickerComponent.prototype.isDescendant = function (parent, child) {
        var node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    ColorPickerComponent.prototype.createBox = function (element, offset) {
        return {
            top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
            left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    };
    ColorPickerComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'color-picker',
                    templateUrl: './color-picker.component.html',
                    styleUrls: ['./color-picker.component.scss']
                },] },
    ];
    /** @nocollapse */
    ColorPickerComponent.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.ChangeDetectorRef, },
        { type: color_picker_service_1.ColorPickerService, },
    ]; };
    ColorPickerComponent.propDecorators = {
        'hueSlider': [{ type: core_1.ViewChild, args: ['hueSlider',] },],
        'alphaSlider': [{ type: core_1.ViewChild, args: ['alphaSlider',] },],
        'dialogElement': [{ type: core_1.ViewChild, args: ['dialogPopup',] },],
    };
    return ColorPickerComponent;
}());
exports.ColorPickerComponent = ColorPickerComponent;
//# sourceMappingURL=color-picker.component.js.map