import { carregar, salvar } from "./armazenamento"

export type Tarefa = {
  id: number
  descrição: string
  concluida: boolean
  dataCriação: string
}

function proximoId(tarefas: Tarefa[]): number {
  if (tarefas.length > 0) {
    return Math.max(...tarefas.map((tarefa) => tarefa.id)) + 1
  }

  return 1
}

export async function adicionar(descrição: string): Promise<Tarefa> {
  const tarefas = await carregar()

  const tarefa: Tarefa = {
    id: proximoId(tarefas),
    descrição,
    concluida: false,
    dataCriação: new Date().toISOString()
  }

  await salvar([...tarefas, tarefa])

  return tarefa
}

export async function listar(): Promise<Tarefa[]> {
  return await carregar()
}
