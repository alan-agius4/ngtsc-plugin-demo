import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-foo-bax',
  template: `
    <p>
      foo-bax works!!
    </p>
  `,
  styles: [
  ]
})
export class FooBaxComponent implements OnInit {

  @Input() name = '';
  constructor() { }

  ngOnInit(): void {
  }

}
