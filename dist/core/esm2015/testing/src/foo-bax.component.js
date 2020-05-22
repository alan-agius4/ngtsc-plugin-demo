import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "core";
let FooBaxComponent = /** @class */ (() => {
    class FooBaxComponent {
        constructor() { }
        ngOnInit() {
        }
    }
    FooBaxComponent.ɵfac = function FooBaxComponent_Factory(t) { return new (t || FooBaxComponent)(); };
    FooBaxComponent.ɵcmp = i0.ɵɵdefineComponent({ type: FooBaxComponent, selectors: [["lib-foo-bax"]], decls: 3, vars: 0, consts: [[3, "name"]], template: function FooBaxComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "p");
            i0.ɵɵelement(1, "lib-foo-bax", 0);
            i0.ɵɵtext(2, " foo-bax testing works! ");
            i0.ɵɵelementEnd();
        } }, directives: [i1.FooBaxComponent, FooBaxComponent], encapsulation: 2 });
    return FooBaxComponent;
})();
export { FooBaxComponent };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FooBaxComponent, [{
        type: Component,
        args: [{
                selector: 'lib-foo-bax',
                template: `
    <p>
      <lib-foo-bax [name]=""></lib-foo-bax>
      foo-bax testing works!
    </p>
  `,
                styles: []
            }]
    }], function () { return []; }, null); })();
