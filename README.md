# tarefas

Gerenciador de tarefas no terminal, feito para o desafio técnico de Desenvolvedor Júnior da Dplay Solutions.

## Sobre o projeto

Aplicação de linha de comando para adicionar, listar, concluir, editar e remover tarefas. Cada tarefa tem id, descrição, status e data de criação, e a lista fica salva em um arquivo `tarefas.json`.

## Tecnologias

- TypeScript 7.0
- [Bun](https://bun.com) 1.3.14: execução, testes e geração dos executáveis
- [yargs](https://yargs.js.org/) 18.2: comandos, argumentos e ajuda

## Como instalar

Pré-requisitos: [Git](https://git-scm.com/) e [Bun](https://bun.com/docs/installation) 1.3 ou superior.

```bash
git clone https://github.com/vadolasi/dplay_desafio.git
cd dplay_desafio
bun install
bun run src/index.ts ajuda
```

Se a lista de comandos aparecer, a instalação está pronta.

### Sem instalar o Bun

Há executáveis prontos na página de [releases](https://github.com/vadolasi/dplay_desafio/releases/latest): `tarefas-linux-x64`, `tarefas-linux-arm64`, `tarefas-macos-arm64`, `tarefas-macos-x64` e `tarefas-windows-x64.exe`. No Linux e no macOS, troque o nome do arquivo no fim do endereço pelo do seu sistema:

```bash
curl -L -o tarefas https://github.com/vadolasi/dplay_desafio/releases/latest/download/tarefas-linux-x64
chmod +x tarefas
./tarefas ajuda
```

No Windows, baixe o `.exe` e rode `.\tarefas-windows-x64.exe ajuda`. Só os executáveis de macOS foram testados; se o do seu sistema não funcionar, use a instalação acima.

## Como usar

Rode os comandos dentro da pasta do projeto. Com o executável, troque `bun run src/index.ts` por `./tarefas`.

```console
$ bun run src/index.ts ajuda
tarefas <comando> [opções]

Comandos:
  tarefas completion               Gera o script de autocompletar para o shell
  tarefas adicionar <descricao>    Adiciona uma nova tarefa
  tarefas listar                   Lista todas as tarefas
  tarefas concluir <id>            Marca uma tarefa como concluida
  tarefas remover <id>             Remove uma tarefa
  tarefas editar <id> <descricao>  Edita a descrição de uma tarefa

Opções:
      --version  Exibe a versão                                       [booleano]
  -h, --ajuda    Exibe ajuda                                          [booleano]

$ bun run src/index.ts adicionar "Estudar Git"
Tarefa #1 adicionada

$ bun run src/index.ts adicionar "Escrever o README"
Tarefa #2 adicionada

$ bun run src/index.ts concluir 1
Tarefa #1 concluida

$ bun run src/index.ts listar
[X] #1  Estudar Git            12/10/2026
[ ] #2  Escrever o README            12/10/2026

$ bun run src/index.ts listar --status pendente
[ ] #2  Escrever o README            12/10/2026

$ bun run src/index.ts editar 2 "Escrever o README do projeto"
Tarefa #2 editada

$ bun run src/index.ts remover 1
Tarefa #1 removida

$ bun run src/index.ts concluir 99
Tarefa #99 não encontrada
```

- `listar --status` aceita `pendente` ou `concluida`.
- O `tarefas.json` é criado na pasta de onde o comando é executado.
- Para rodar os testes: `bun test`.

## Organização

O código está dividido em três camadas, e cada uma chama apenas a seguinte:

- `src/index.ts` (entrada): define os comandos com o yargs, chama as regras e imprime o resultado.
- `src/tarefas.ts` (regras): o tipo `Tarefa` e as funções de adicionar, listar, concluir, remover e editar.
- `src/armazenamento.ts` (armazenamento): lê e grava o `tarefas.json`.
