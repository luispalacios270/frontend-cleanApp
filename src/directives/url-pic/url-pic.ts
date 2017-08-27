import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import * as globalVariables from '../../global'

/**
 * Generated class for the UrlPicDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[url-pic]',
  host: {
    '(error)': 'onError()'
  }
})
export class UrlPicDirective implements OnInit {

  private api = globalVariables.API_ENDPOINT;
  @Input() id: string;
  @Input() type: string;

  constructor(
    private elRef: ElementRef
  ) { };

  ngOnInit(): any {
    this.elRef.nativeElement.src = ""
  }

  setSrc() {
  /*   switch (key) {
      case value:
        
        break;
    
      default:
        break;
    }
 */
  }


  onError() {

  }

}
