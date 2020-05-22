import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-foo-bax',
  template: `
    <p>
      <lib-foo-bax [name]=""></lib-foo-bax>
      foo-bax testing works!
    </p>
  `,
  styles: [
  ]
})
export class FooBaxComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }

}

