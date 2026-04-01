import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
      path: 'painel',
      loadChildren: () => import('./painel/painel.module').then( m => m.PainelPageModule)
  },
  {
    path: 'totem',
    loadChildren: () => import('./totem/totem.module').then( m => m.TotemPageModule)
  },
  {
    path: 'guiche',
    loadChildren: () => import('./guiche/guiche.module').then( m => m.GuichePageModule)
  },
  {
    path: 'relatorio',
    loadChildren: () => import('./relatorio/relatorio.module').then( m => m.RelatorioPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
