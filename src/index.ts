import yargs from "yargs"
import { hideBin } from "yargs/helpers"

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
    (_argv) => {}
  )
  .command(
    "listar",
    "Lista todas as tarefas",
    () => {},
    (_argv) => {}
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
  .strict()
  .parse()
