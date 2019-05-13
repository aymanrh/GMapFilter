import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'clients', pathMatch: 'full' },
  { path: 'add-client', loadChildren: './pages/add-client/add-client.module#AddClientPageModule' },
  { path: 'add-client/:id', loadChildren: './pages/add-client/add-client.module#AddClientPageModule' },
  { path: 'clients', loadChildren: './pages/clients/clients.module#ClientsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
