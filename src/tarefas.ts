import { carregar, salvar } from "./armazenamento"

export type Tarefa = {
  id: number
  descrição: string
  concluida: boolean
  dataCriação: string
}

export class TarefaNaoEncontradaError extends Error {
  constructor(id: number) {
    super(`Tarefa #${id} não encontrada`)
  }
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

export async function concluir(id: number): Promise<void> {
  const tarefas = await carregar()

  const index = tarefas.findIndex((tarefa) => tarefa.id === id)

  if (index < 0) {
    throw new TarefaNaoEncontradaError(id)
  }

  tarefas[index]!.concluida = true

  await salvar(tarefas)
}
