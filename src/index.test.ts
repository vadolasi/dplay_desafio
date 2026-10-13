import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const entrada = join(import.meta.dir, "index.ts")

let pasta: string

// Cada teste usa uma pasta temporária vazia
beforeEach(() => {
  pasta = mkdtempSync(join(tmpdir(), "tarefas-"))
})

afterEach(() => {
  rmSync(pasta, { recursive: true })
})

// Executa a CLI em um processo separado, como um usuário faria no terminal.
function tarefas(...argumentos: string[]) {
  const processo = Bun.spawnSync(
    [process.execPath, "run", entrada, ...argumentos],
    { cwd: pasta }
  )

  return {
    saida: processo.stdout.toString(),
    erro: processo.stderr.toString(),
    codigo: processo.exitCode
  }
}

describe("adicionar", () => {
  test("numera as tarefas em sequência", () => {
    const primeira = tarefas("adicionar", "Estudar Git")
    const segunda = tarefas("adicionar", "Escrever o README")

    expect(primeira.saida).toBe("Tarefa #1 adicionada\n")
    expect(segunda.saida).toBe("Tarefa #2 adicionada\n")
  })

  test("continua a numeração depois de uma remoção", () => {
    tarefas("adicionar", "Estudar Git")
    tarefas("adicionar", "Escrever o README")
    tarefas("remover", "1")

    const { saida } = tarefas("adicionar", "Gravar o vídeo")

    expect(saida).toBe("Tarefa #3 adicionada\n")
  })

  test("salva a tarefa em tarefas.json com id, descrição, status e data", () => {
    tarefas("adicionar", "Estudar Git")

    const salvas = JSON.parse(readFileSync(join(pasta, "tarefas.json"), "utf8"))

    expect(salvas).toEqual([
      {
        id: 1,
        descrição: "Estudar Git",
        concluida: false,
        dataCriação: expect.any(String)
      }
    ])
  })
})

describe("listar", () => {
  test("avisa quando não há tarefas", () => {
    const { saida } = tarefas("listar")

    expect(saida).toBe("Nenhuma tarefa cadastrada\n")
  })

  test("mostra status, id, descrição e data de cada tarefa", () => {
    tarefas("adicionar", "Estudar Git")
    tarefas("adicionar", "Escrever o README")
    tarefas("concluir", "2")

    const linhas = tarefas("listar").saida.trim().split("\n")

    expect(linhas).toHaveLength(2)
    expect(linhas[0]).toMatch(/^\[ \] #1\s+Estudar Git\s+\d{2}\/\d{2}\/\d{4}$/)
    expect(linhas[1]).toMatch(
      /^\[X\] #2\s+Escrever o README\s+\d{2}\/\d{2}\/\d{4}$/
    )
  })

  test("filtra as tarefas por status", () => {
    tarefas("adicionar", "Estudar Git")
    tarefas("adicionar", "Escrever o README")
    tarefas("concluir", "2")

    const pendentes = tarefas("listar", "--status", "pendente").saida
    const concluidas = tarefas("listar", "--status", "concluida").saida

    expect(pendentes).toContain("[ ] #1")
    expect(pendentes).not.toContain("#2")
    expect(concluidas).toContain("[X] #2")
    expect(concluidas).not.toContain("#1")
  })

  test("avisa quando nenhuma tarefa tem o status pedido", () => {
    tarefas("adicionar", "Estudar Git")

    const { saida } = tarefas("listar", "--status", "concluida")

    expect(saida).toBe("Nenhuma tarefa com esse status\n")
  })
})

describe("concluir", () => {
  test("marca só a tarefa indicada", () => {
    tarefas("adicionar", "Estudar Git")
    tarefas("adicionar", "Escrever o README")

    const { saida } = tarefas("concluir", "1")
    const listagem = tarefas("listar").saida

    expect(saida).toBe("Tarefa #1 concluida\n")
    expect(listagem).toContain("[X] #1")
    expect(listagem).toContain("[ ] #2")
  })

  test("avisa quando o id não existe", () => {
    const { erro, codigo } = tarefas("concluir", "99")

    expect(erro).toBe("Tarefa #99 não encontrada\n")
    expect(codigo).toBe(1)
  })
})

describe("remover", () => {
  test("remove só a tarefa indicada", () => {
    tarefas("adicionar", "Estudar Git")
    tarefas("adicionar", "Escrever o README")

    const { saida } = tarefas("remover", "1")
    const listagem = tarefas("listar").saida

    expect(saida).toBe("Tarefa #1 removida\n")
    expect(listagem).not.toContain("#1")
    expect(listagem).toContain("#2")
  })

  test("avisa quando o id não existe", () => {
    const { erro, codigo } = tarefas("remover", "99")

    expect(erro).toBe("Tarefa #99 não encontrada\n")
    expect(codigo).toBe(1)
  })
})

describe("editar", () => {
  test("troca a descrição e mantém o status", () => {
    tarefas("adicionar", "Estudar Git")
    tarefas("concluir", "1")

    const { saida } = tarefas("editar", "1", "Estudar Git a fundo")
    const listagem = tarefas("listar").saida

    expect(saida).toBe("Tarefa #1 editada\n")
    expect(listagem).toMatch(/^\[X\] #1\s+Estudar Git a fundo\s/)
  })

  test("avisa quando o id não existe", () => {
    const { erro, codigo } = tarefas("editar", "99", "Estudar Git")

    expect(erro).toBe("Tarefa #99 não encontrada\n")
    expect(codigo).toBe(1)
  })
})

test("rejeita id que não é número inteiro", () => {
  for (const id of ["abc", "1.5"]) {
    const { erro, codigo } = tarefas("concluir", id)

    expect(erro).toBe("O id deve ser um número inteiro\n")
    expect(codigo).toBe(1)
  }
})
