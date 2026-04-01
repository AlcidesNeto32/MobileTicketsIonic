import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class TotemPage implements OnInit, OnDestroy {
  horaAtual = new Date();
  ultimaSenha: any = null;
  private timer: any;

  constructor(private filaService: FilaService) { }

  ngOnInit() { this.timer = setInterval(() => { this.horaAtual = this.filaService.getHoraAtualSimulada(); }, 1000) }

  avancarHoras() {
    this.filaService.pularTempo(3); // Pula 3 horas
    this.horaAtual = this.filaService.getHoraAtualSimulada(); // Atualiza a tela na hora
    console.log('Tempo avançado em 3 horas!');
  }

  ngOnDestroy() {
    if (this.timer)
      clearInterval(this.timer);
  }

  get isAberto() { return this.filaService.isHorarioAtendimento(); }

  emitir(tipo: 'SP' | 'SG' | 'SE') {
    this.ultimaSenha = this.filaService.gerarSenha(tipo);
  }
}