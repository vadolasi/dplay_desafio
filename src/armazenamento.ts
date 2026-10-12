import type { Tarefa } from "./tarefas"

const arquivo = Bun.file("./tarefas.json")

export async function carregar(): Promise<Tarefa[]> {
  if (await arquivo.exists()) {
    return await arquivo.json()
  }

  return []
}

export async function salvar(tarefas: Tarefa[]): Promise<void> {
  await arquivo.write(JSON.stringify(tarefas, null, 2))
}
