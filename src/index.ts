import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import ptBR from "../node_modules/yargs/locales/pt_BR.json"
import { adicionar, concluir, editar, listar, remover } from "./tarefas"

const posicionalId = {
  describe: "Identificador da tarefa",
  type: "number",
  demandOption: true,
  coerce: (id: number) => {
    if (!Number.isInteger(id)) {
      throw new Error("O id deve ser um número inteiro")
    }
    return id
  }
} as const

yargs(hideBin(process.argv))
  .scriptName("tarefas")
  .usage("$0 <comando> [opções]")
  .locale("pt_BR")
  // O executável compilado não leva os arquivos de tradução do yargs, então as
  // mensagens em português são embutidas pela importação do pt_BR.json.
  .updateLocale(ptBR as unknown as Record<string, string>)

  // Comando de ajuda automático
  .help("ajuda")
  .alias("ajuda", "h")

  // Autocomplete nativo no shell
  .completion("completion", "Gera o script de autocompletar para o shell")

  // Comandos da aplicação
  .command(
    "adicionar <descricao>",
    "Adiciona uma nova tarefa",
    (y) =>
      y.positional("descricao", {
        describe: "Descrição da tarefa",
        type: "string",
        demandOption: true
      }),
    async ({ descricao }) => {
      const tarefa = await adicionar(descricao)

      console.log(`Tarefa #${tarefa.id} adicionada`)
    }
  )
  .command(
    "listar",
    "Lista todas as tarefas",
    (y) =>
      y.option("status", {
        describe: "Mostra só as tarefas com esse status",
        choices: ["pendente", "concluida"] as const
      }),
    async ({ status }) => {
      const tarefas = await listar(status)

      if (tarefas.length > 0) {
        for (const tarefa of tarefas) {
          console.log(
            `[${tarefa.concluida ? "X" : " "}] #${tarefa.id}  ${tarefa.descrição}            ${new Date(tarefa.dataCriação).toLocaleDateString("pt-BR")}`
          )
        }
      } else if (status) {
        console.log("Nenhuma tarefa com esse status")
      } else {
        console.log("Nenhuma tarefa cadastrada")
      }
    }
  )
  .command(
    "concluir <id>",
    "Marca uma tarefa como concluida",
    (y) => y.positional("id", posicionalId),
    async ({ id }) => {
      await concluir(id)

      console.log(`Tarefa #${id} concluida`)
    }
  )
  .command(
    "remover <id>",
    "Remove uma tarefa",
    (y) => y.positional("id", posicionalId),
    async ({ id }) => {
      await remover(id)

      console.log(`Tarefa #${id} removida`)
    }
  )
  .command(
    "editar <id> <descricao>",
    "Edita a descrição de uma tarefa",
    (y) =>
      y.positional("id", posicionalId).positional("descricao", {
        describe: "Nova descrição da tarefa",
        type: "string",
        demandOption: true
      }),
    async ({ id, descricao }) => {
      await editar(id, descricao)

      console.log(`Tarefa #${id} editada`)
    }
  )

  .demandCommand(1, "Comando inválido")
  .fail((msg, err, y) => {
    if (err) {
      console.error(err.message)
    } else {
      y.showHelp()
      console.error(`\n${msg}`)
    }
    process.exit(1)
  })
  .strict()
  .parse()
