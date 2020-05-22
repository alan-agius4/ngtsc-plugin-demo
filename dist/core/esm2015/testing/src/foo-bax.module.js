import { NgModule } from '@angular/core';
import { FooBaxComponent } from './foo-bax.component';
import { FooBaxModule as FooBaxModule2 } from 'core';
import * as i0 from "@angular/core";
let FooBaxModule = /** @class */ (() => {
    class FooBaxModule {
    }
    FooBaxModule.ɵmod = i0.ɵɵdefineNgModule({ type: FooBaxModule });
    FooBaxModule.ɵinj = i0.ɵɵdefineInjector({ factory: function FooBaxModule_Factory(t) { return new (t || FooBaxModule)(); }, imports: [[
                FooBaxModule2
            ]] });
    return FooBaxModule;
})();
export { FooBaxModule };
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(FooBaxModule, { declarations: [FooBaxComponent], imports: [FooBaxModule2], exports: [FooBaxComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FooBaxModule, [{
        type: NgModule,
        args: [{
                declarations: [FooBaxComponent],
                imports: [
                    FooBaxModule2
                ],
                exports: [FooBaxComponent]
            }]
    }], null, null); })();
