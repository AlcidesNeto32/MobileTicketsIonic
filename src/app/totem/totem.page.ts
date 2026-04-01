import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FilaService } from '../services/fila';

@Component({
  selector: 'app-totem',
  templateUrl: './totem.page.html',
  styleUrls: ['./totem.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TotemPage {
  ultimaSenhaEmitida: any = null;

  constructor(private filaService: FilaService) {}

  emitir(tipo: 'SP' | 'SG' | 'SE') {
    const horaAtual = new Date().getHours();
    // Regra do PDF: Funcionamento das 07h às 17h
    if (horaAtual < 7 || horaAtual >= 17) {
      alert('O sistema de emissão funciona apenas das 07:00 às 17:00.');
      return;
    }
    
    this.ultimaSenhaEmitida = this.filaService.gerarSenha(tipo);
  }
}