import { NgModule } from '@angular/core';
import { FooBaxComponent } from './foo-bax.component';
import {FooBaxModule as FooBaxModule2} from 'core';


@NgModule({
  declarations: [FooBaxComponent],
  imports: [
    FooBaxModule2
  ],
  exports: [FooBaxComponent]
})
export class FooBaxModule { }

