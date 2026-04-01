import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FilaService } from '../services/fila';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class PainelPage {
  // O Angular usará getters para manter a tela sempre atualizada com o Service
  constructor(private filaService: FilaService) {}

  get senhaAtual() {
    const historico = this.filaService.getUltimasChamadas();
    return historico.length > 0 ? historico[0] : null; // A mais recente é a [0]
  }

  get ultimasSenhas() {
    const historico = this.filaService.getUltimasChamadas();
    // Retorna do índice 1 ao 5 (ignorando a atual que já está em destaque)
    return historico.slice(1, 6);
  }
}