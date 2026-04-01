import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilaService {
  // Filas de espera (Agente Cliente - AC)
  private filaSP: any[] = []; // Prioritária
  private filaSG: any[] = []; // Geral
  private filaSE: any[] = []; // Exames

  // Histórico para o Painel (Últimas 5 chamadas - Agente Sistema)
  private ultimasChamadas: any[] = [];

  // Histórico Geral para o Relatório (Todas as senhas do dia)
  private historicoCompleto: any[] = [];

  // Controle de alternância: [SP] -> [Comum] -> [SP]
  private vezDaPrioritaria = true;

  constructor() {}

  // 1. GERAR SENHA (Regra: YYMMDD-PPSQ)
  gerarSenha(tipo: 'SP' | 'SG' | 'SE') {
    const agora = new Date();
    
    // Formatação da Data: YYMMDD
    const ano = agora.getFullYear().toString().slice(-2);
    const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
    const dia = agora.getDate().toString().padStart(2, '0');
    const dataPrefixo = `${ano}${mes}${dia}`;

    // Cálculo da Sequência (SQ) baseada no que já foi emitido hoje
    const sequencia = (this.historicoCompleto.filter(s => s.tipo === tipo).length + 1)
      .toString().padStart(2, '0');

    const novaSenha = {
      numero: `${dataPrefixo}-${tipo}${sequencia}`,
      tipo: tipo,
      horaEmissao: agora,
      horaAtendimento: null,
      horaFinalizacao: null,
      guiche: null,
      status: 'Aguardando' // Status: Aguardando, Atendido, Ausente
    };

    // Adiciona na fila específica e no histórico geral
    if (tipo === 'SP') this.filaSP.push(novaSenha);
    else if (tipo === 'SG') this.filaSG.push(novaSenha);
    else this.filaSE.push(novaSenha);

    this.historicoCompleto.push(novaSenha);
    return novaSenha;
  }

  // 2. CHAMAR PRÓXIMO (Regra de Prioridade: [SP] -> [SE|SG])
  chamarProximo(numGuiche: number) {
    let senhaEscolhida = null;

    // Lógica de alternância conforme o documento
    if (this.vezDaPrioritaria && this.filaSP.length > 0) {
      senhaEscolhida = this.filaSP.shift();
      this.vezDaPrioritaria = false; // Próxima deve ser comum
    } else {
      // Se for vez da comum ou se não houver SP, tenta SE depois SG
      if (this.filaSE.length > 0) {
        senhaEscolhida = this.filaSE.shift();
      } else if (this.filaSG.length > 0) {
        senhaEscolhida = this.filaSG.shift();
      } else if (this.filaSP.length > 0) {
        // Se não houver nenhuma comum, chama SP mesmo se não for a vez
        senhaEscolhida = this.filaSP.shift();
      }
      this.vezDaPrioritaria = true;
    }

    if (senhaEscolhida) {
      senhaEscolhida.guiche = numGuiche;
      senhaEscolhida.horaAtendimento = new Date();
      
      // Atualiza o Painel (Agente Sistema: mantém apenas as 5 últimas)
      this.ultimasChamadas.unshift(senhaEscolhida);
      if (this.ultimasChamadas.length > 5) {
        this.ultimasChamadas.pop();
      }
      
      // Toca um sinal sonoro (Opcional - Simulação do Agente Sistema)
      this.reproduzirAlerta();
    }

    return senhaEscolhida;
  }

  // 3. FINALIZAR OU DESCARTAR (Regra dos 5% de ausência)
  finalizarAtendimento(senha: any, status: 'Atendido' | 'Ausente') {
    const index = this.historicoCompleto.findIndex(s => s.numero === senha.numero);
    if (index !== -1) {
      this.historicoCompleto[index].status = status;
      this.historicoCompleto[index].horaFinalizacao = new Date();
      
      // Se for atendido, o sistema calcula o tempo gasto (para o Relatório de TM)
      // No mundo real, aqui você validaria as variações de 5min (SG) e 15min (SP)
    }
  }

  // 4. GETTERS PARA AS PÁGINAS
  getUltimasChamadas() {
    return this.ultimasChamadas;
  }

  getTodasAsSenhas() {
    return this.historicoCompleto;
  }

  private reproduzirAlerta() {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch(() => console.log('Alerta visual emitido (áudio bloqueado)'));
  }

  // Limpeza diária (Regra: Reinício diário às 17h/00h)
  resetDiario() {
    this.filaSP = [];
    this.filaSG = [];
    this.filaSE = [];
    this.ultimasChamadas = [];
    this.historicoCompleto = [];
  }
}