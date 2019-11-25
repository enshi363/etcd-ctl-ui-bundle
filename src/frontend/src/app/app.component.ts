import { Component } from '@angular/core';

//import { NgClass, ɵNgClassImpl, ɵNgClassR2Impl,NgStyle,ɵNgStyleImpl,ɵNgStyleR2Impl} from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    //providers: [{
        //provide: ɵNgClassImpl,
        //useClass: ɵNgClassR2Impl
    //}, NgClass,{
        //provide: ɵNgStyleImpl,
        //useClass: ɵNgStyleR2Impl
    //},NgStyle],
})
export class AppComponent {
    title = 'frontend';
}
