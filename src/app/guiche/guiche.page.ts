import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilaService } from '../services/fila';

@Component({
  selector: 'app-guiche',
  templateUrl: './guiche.page.html',
  styleUrls: ['./guiche.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GuichePage {
  meuGuiche: number = 1;
  senhaEmAtendimento: any = null;

  constructor(private filaService: FilaService) {}

  chamarProximo() {
    // A lógica de prioridade (SP -> SE/SG -> SP) já está no Service
    const proxima = this.filaService.chamarProximo(this.meuGuiche);
    
    if (proxima) {
      this.senhaEmAtendimento = proxima;
    } else {
      window.alert('Não há senhas na fila no momento.');
    }
  }

  finalizarAtendimento() {
    if (this.senhaEmAtendimento) {
    // Em vez de salvarNoHistorico, use finalizarAtendimento
    this.filaService.finalizarAtendimento(this.senhaEmAtendimento, 'Atendido');
    this.senhaEmAtendimento = null;
  }
  }

  registrarAusencia() {
    if (this.senhaEmAtendimento) {
    // Registra como 'Ausente' para a regra de 5% de descarte
    this.filaService.finalizarAtendimento(this.senhaEmAtendimento, 'Ausente');
    this.senhaEmAtendimento = null;
  }
  }
}