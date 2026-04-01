import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class PainelPage implements OnInit, OnDestroy {
  // Variáveis para o HTML
  senhaPrincipal: any = null;
  historico: any[] = [];
  horaAtual: Date = new Date();
  timer: any;

  // Referência do timer para podermos pará-lo ao fechar a página
  private atualizador: any;

  constructor(private filaService: FilaService) { }

  ngOnInit() { this.timer = setInterval(() => { this.horaAtual = this.filaService.getHoraAtualSimulada(); }, 1000) }


  ngOnDestroy() {
    // Limpa o timer da memória ao destruir o componente
    if (this.atualizador) {
      clearInterval(this.atualizador);
    }
  }

  /**
   * Sincroniza o componente com o estado atual do FilaService
   */
  private verificarDados() {
    this.horaAtual = new Date();

    // Puxa a senha que o atendente chamou (e que ainda não foi finalizada)
    this.senhaPrincipal = this.filaService.getSenhaAtivaNoPainel();

    // Puxa a lista das últimas 5 chamadas (para a barra lateral)
    this.historico = this.filaService.getUltimasChamadas();
  }

  /**
   * Método disparado pelo Ionic toda vez que a aba ganha foco
   */
  ionViewWillEnter() {
    this.verificarDados();
  }
}