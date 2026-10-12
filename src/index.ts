import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { adicionar, concluir, listar } from "./tarefas"

yargs(hideBin(process.argv))
  .scriptName("tarefas")
  .usage("$0 <comando> [opções]")
  .locale("pt_BR")

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
    () => {},
    async () => {
      const tarefas = await listar()

      if (tarefas.length > 0) {
        for (const tarefa of tarefas) {
          console.log(
            `[${tarefa.concluida ? "X" : " "}] #${tarefa.id}  ${tarefa.descrição}            ${new Date(tarefa.dataCriação).toLocaleDateString("pt-BR")}`
          )
        }
      } else {
        console.log("Nenhuma tarefa cadastrada")
      }
    }
  )
  .command(
    "concluir <id>",
    "Marca uma tarefa como concluida",
    (y) =>
      y.positional("id", {
        describe: "Identificador da tarefa",
        type: "number",
        demandOption: true
      }),
    async ({ id }) => {
      await concluir(id)

      console.log(`Tarefa #${id} concluida com sucesso`)
    }
  )
  .command(
    "remover <id>",
    "Remove uma tarefa",
    (y) =>
      y.positional("id", {
        describe: "Identificador da tarefa",
        type: "number",
        demandOption: true
      }),
    (_argv) => {}
  )
  .command(
    "editar <id> <descricao>",
    "Edita a descrição de uma tarefa",
    (y) =>
      y
        .positional("id", {
          describe: "Identificador da tarefa",
          type: "number",
          demandOption: true
        })
        .positional("descricao", {
          describe: "Nova descrição da tarefa",
          type: "string",
          demandOption: true
        }),
    (_argv) => {}
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
