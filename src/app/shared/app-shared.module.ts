import {RouteReuseStrategy} from '@angular/router';
import {IonicRouteStrategy} from '@ionic/angular';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {AgmCoreModule, AgmFitBounds, GoogleMapsAPIWrapper} from '@agm/core';
import {environment} from '../../environments/environment';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {ArrayFilterService} from './services/utils/array-filter.service';


@NgModule({
    imports: [
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.fireBaseConfig),
        AngularFirestoreModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleMapKeys,
            libraries: ['places']
        })
    ],
    declarations: [],
    entryComponents: [],
    providers: [
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        GoogleMapsAPIWrapper,
        AgmFitBounds

    ],
    exports: [
        ReactiveFormsModule,
        AngularFireModule,
        AgmCoreModule,
        AngularFirestoreModule,

    ]
})
export class AppSharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppSharedModule,
            providers: [
                ArrayFilterService,
            ]
        };
    }
}
