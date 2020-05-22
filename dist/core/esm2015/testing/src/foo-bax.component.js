import { Component } from '@angular/core';
import * as i0 from "@angular/core";
let FooBaxComponent = /** @class */ (() => {
    class FooBaxComponent {
        constructor() { }
        ngOnInit() {
        }
    }
    FooBaxComponent.ɵfac = function FooBaxComponent_Factory(t) { return new (t || FooBaxComponent)(); };
    FooBaxComponent.ɵcmp = i0.ɵɵdefineComponent({ type: FooBaxComponent, selectors: [["lib-foo-bax"]], decls: 2, vars: 0, template: function FooBaxComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "p");
            i0.ɵɵtext(1, " foo-bax testing works! ");
            i0.ɵɵelementEnd();
        } }, encapsulation: 2 });
    return FooBaxComponent;
})();
export { FooBaxComponent };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FooBaxComponent, [{
        type: Component,
        args: [{
                selector: 'lib-foo-bax',
                template: `
    <p>
      foo-bax testing works!
    </p>
  `,
                styles: []
            }]
    }], function () { return []; }, null); })();
