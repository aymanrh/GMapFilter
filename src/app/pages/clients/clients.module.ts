import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ClientsPage} from './clients.page';
import {AppSharedModule} from '../../shared/app-shared.module';
import {ClipboardModule} from 'ngx-clipboard';

const routes: Routes = [
    {
        path: '',
        component: ClientsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppSharedModule,
        IonicModule,
        RouterModule.forChild(routes),
        ClipboardModule
    ],
    declarations: [ClientsPage]
})
export class ClientsPageModule {
}
