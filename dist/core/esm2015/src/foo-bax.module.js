import { NgModule } from '@angular/core';
import { FooBaxComponent } from './foo-bax.component';
import * as i0 from "@angular/core";
let FooBaxModule = /** @class */ (() => {
    class FooBaxModule {
    }
    FooBaxModule.ɵmod = i0.ɵɵdefineNgModule({ type: FooBaxModule });
    FooBaxModule.ɵinj = i0.ɵɵdefineInjector({ factory: function FooBaxModule_Factory(t) { return new (t || FooBaxModule)(); }, imports: [[]] });
    return FooBaxModule;
})();
export { FooBaxModule };
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(FooBaxModule, { declarations: [FooBaxComponent], exports: [FooBaxComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FooBaxModule, [{
        type: NgModule,
        args: [{
                declarations: [FooBaxComponent],
                imports: [],
                exports: [FooBaxComponent]
            }]
    }], null, null); })();
