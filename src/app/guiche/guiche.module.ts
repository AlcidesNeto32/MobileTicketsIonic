import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuichePageRoutingModule } from './guiche-routing.module';

import { GuichePage } from './guiche.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuichePageRoutingModule,
    GuichePage
  ],
})
export class GuichePageModule {}
