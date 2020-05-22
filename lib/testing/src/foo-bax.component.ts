import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-foo-bax',
  template: `
    <p>
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

