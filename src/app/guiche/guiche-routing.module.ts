import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuichePage } from './guiche.page';

const routes: Routes = [
  {
    path: '',
    component: GuichePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuichePageRoutingModule {}
