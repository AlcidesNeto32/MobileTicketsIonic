import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilaService {
  // Filas em Memória
  private filaSP: any[] = []; 
  private filaSG: any[] = []; 
  private filaSE: any[] = []; 

  // Estados do Painel e Histórico
  private senhaAtualNoPainel: any = null;
  private ultimasChamadas: any[] = [];
  private historicoCompleto: any[] = [];

  // Lógica de Prioridade e Tempo
  private vezDaPrioritaria = true;
  private offsetTempoMs = 0; // Armazena o "pulo" de tempo em milissegundos

  constructor() {}

  // --- MÁQUINA DO TEMPO ---

  /**
   * Retorna a data atual somada ao deslocamento manual (pulo de horas).
   * Substitui o 'new Date()' em todo o sistema.
   */
  getHoraAtualSimulada(): Date {
    const agoraReal = new Date();
    return new Date(agoraReal.getTime() + this.offsetTempoMs);
  }

  /**
   * Adiciona horas ao relógio interno do sistema.
   * @param horas Quantidade de horas a avançar (ex: 3)
   */
  pularTempo(horas: number) {
    const milissegundos = horas * 60 * 60 * 1000;
    this.offsetTempoMs += milissegundos;
  }

  /**
   * Valida se o sistema está aberto (07:00 às 17:00) 
   * usando a hora simulada.
   */
  isHorarioAtendimento(): boolean {
    const hora = this.getHoraAtualSimulada().getHours();
    return hora >= 7 && hora < 17;
  }

  // --- GESTÃO DE SENHAS (AGENTE CLIENTE / AC) ---

  gerarSenha(tipo: 'SP' | 'SG' | 'SE') {
    if (!this.isHorarioAtendimento()) {
      console.error('Tentativa de emissão fora do horário permitido.');
      return null;
    }

    const agora = this.getHoraAtualSimulada();
    
    // Formatação YYMMDD
    const prefixoData = agora.getFullYear().toString().slice(-2) + 
                        (agora.getMonth() + 1).toString().padStart(2, '0') + 
                        agora.getDate().toString().padStart(2, '0');

    // Sequência baseada no histórico do dia para aquele tipo
    const sequencia = (this.historicoCompleto.filter(s => s.tipo === tipo).length + 1)
                      .toString().padStart(2, '0');

    const novaSenha = {
      numero: `${prefixoData}-${tipo}${sequencia}`,
      tipo: tipo,
      horaEmissao: agora,
      status: 'Aguardando',
      guiche: null
    };

    // Adiciona na fila correta
    if (tipo === 'SP') this.filaSP.push(novaSenha);
    else if (tipo === 'SE') this.filaSE.push(novaSenha);
    else this.filaSG.push(novaSenha);

    this.historicoCompleto.push(novaSenha);
    return novaSenha;
  }

  // --- GESTÃO DE ATENDIMENTO (AGENTE ATENDENTE / AA) ---

  chamarProximo(numGuiche: number) {
    let escolhida: any = null;

    // Lógica de prioridade...
    if (this.vezDaPrioritaria && this.filaSP.length > 0) {
      escolhida = this.filaSP.shift();
      this.vezDaPrioritaria = false;
    } else {
      escolhida = this.filaSE.shift() || this.filaSG.shift() || this.filaSP.shift();
      this.vezDaPrioritaria = true;
    }

    if (escolhida) {
      // --- REGRA DE OURO PARA O PAINEL ---
      // 1. Se já existia uma senha no telão, mandamos ela para o histórico ANTES de trocar
      if (this.senhaAtualNoPainel) {
        this.adicionarAoHistoricoLateral(this.senhaAtualNoPainel);
      }

      // 2. Configuramos a nova senha como a ATUAL
      escolhida.guiche = numGuiche;
      escolhida.horaAtendimento = this.getHoraAtualSimulada();
      escolhida.status = 'Em Atendimento';
      this.senhaAtualNoPainel = escolhida;

      return escolhida;
    }

    return null;
  }


  finalizarAtendimento(senha: any, status: 'Atendido' | 'Ausente') {
    const item = this.historicoCompleto.find(s => s.numero === senha.numero);
    if (item) {
      item.status = status;
      item.horaFinalizacao = this.getHoraAtualSimulada();
      
      // Quando finaliza, a senha sai do "Destaque" e vai para o "Histórico Lateral"
      if (this.senhaAtualNoPainel?.numero === senha.numero) {
        this.adicionarAoHistoricoLateral(this.senhaAtualNoPainel);
        this.senhaAtualNoPainel = null;
      }
    }
  }


// Função auxiliar interna para organizar a lista lateral
  private adicionarAoHistoricoLateral(senha: any) {
    // Evita duplicados na lista lateral
    const jaExiste = this.ultimasChamadas.find(s => s.numero === senha.numero);
    if (!jaExiste) {
      this.ultimasChamadas.unshift({ ...senha });
      if (this.ultimasChamadas.length > 5) {
        this.ultimasChamadas.pop();
      }
    }
  }

  // --- GETTERS PARA O PAINEL E RELATÓRIO (AGENTE SISTEMA / AS) ---

  getSenhaAtivaNoPainel() {
    return this.senhaAtualNoPainel;
  }

  getUltimasChamadas() {
    return this.ultimasChamadas;
  }

  getHistoricoCompleto() {
    return this.historicoCompleto;
  }
}