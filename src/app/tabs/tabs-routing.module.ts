import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'totem',
        loadComponent: () => import('../totem/totem.page').then(m => m.TotemPage)
      },
      {
        path: 'guiche',
        loadComponent: () => import('../guiche/guiche.page').then(m => m.GuichePage)
      },
      {
        path: 'painel',
        loadComponent: () => import('../painel/painel.page').then(m => m.PainelPage)
      },
      {
        path: 'relatorio',
        loadComponent: () => import('../relatorio/relatorio.page').then(m => m.RelatorioPage)
      },
      {
        path: '',
        redirectTo: '/tabs/totem',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/totem',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
