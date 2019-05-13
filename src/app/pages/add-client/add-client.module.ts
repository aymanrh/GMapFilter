import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AddClientPage} from './add-client.page';
import {AppSharedModule} from '../../shared/app-shared.module';

const routes: Routes = [
    {
        path: '',
        component: AddClientPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppSharedModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [AddClientPage],

})
export class AddClientPageModule {
}
