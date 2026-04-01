import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FilaService } from '../services/fila';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.page.html',
  styleUrls: ['./relatorio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class RelatorioPage {
  totalEmitidas = 0;
  totalAtendidas = 0;
  totalAusentes = 0;

  spEmitidas = 0; spAtendidas = 0;
  seEmitidas = 0; seAtendidas = 0;
  sgEmitidas = 0; sgAtendidas = 0;

  relatorioDetalhado: any[] = [];

  constructor(private filaService: FilaService) {}

  ionViewWillEnter() {
    this.atualizarDados();
  }

  atualizarDados() {
    // Para que isso funcione 100%, seu FilaService precisa expor o array com TODAS as senhas geradas
    const todosOsDados = this.filaService.getTodasAsSenhas() || [];
    
    this.relatorioDetalhado = todosOsDados;
    this.totalEmitidas = todosOsDados.length;
    
    this.totalAtendidas = todosOsDados.filter((s: any) => s.status === 'Atendido').length;
    this.totalAusentes = todosOsDados.filter((s: any) => s.status === 'Ausente').length;

    // Métricas SP
    this.spEmitidas = todosOsDados.filter((s: any) => s.tipo === 'SP').length;
    this.spAtendidas = todosOsDados.filter((s: any) => s.tipo === 'SP' && s.status === 'Atendido').length;

    // Métricas SE
    this.seEmitidas = todosOsDados.filter((s: any) => s.tipo === 'SE').length;
    this.seAtendidas = todosOsDados.filter((s: any) => s.tipo === 'SE' && s.status === 'Atendido').length;

    // Métricas SG
    this.sgEmitidas = todosOsDados.filter((s: any) => s.tipo === 'SG').length;
    this.sgAtendidas = todosOsDados.filter((s: any) => s.tipo === 'SG' && s.status === 'Atendido').length;
  }
}