const arquivo = Bun.file("./tarefas.json")

type Tarefa = {
  id: number
  descrição: string
  concluida: boolean
}

export async function carregar(): Promise<Tarefa[]> {
  return await arquivo.json()
}

export async function salvar(tarefas: Tarefa[]): Promise<void> {
  await arquivo.write(JSON.stringify(tarefas, null, 2))
}
