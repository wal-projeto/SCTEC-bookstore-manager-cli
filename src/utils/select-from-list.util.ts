// Função reutilizável pra qualquer tipo — Autor, Livro, Cliente, o que for.
//  T é um "tipo variável": quando você chamar selectFromList<Autor>(...), o TypeScript substitui todo T por Autor automaticamente

// npx tsc --noEmit 2>&1 && echo "---lint---" && npx eslint src 2>&1 (compilando em busca de error

import { ReadlineUtil } from './readline.util'

export async function selectFromList<T>(
  items: T[], // items é um array de T
  formatLabel: (item: T) => string
): Promise<T | null> {
  if (items.length === 0) {
    // array vazio
    console.log('Nenhum item disponível para selecionar.')
    return null
  }

  // precorrendo e imprimindo o array colocando um indice antes de cada item para que o usuário possa ver-los
  items.forEach((item, index) => {
    console.log(`${index + 1}. ${formatLabel(item)}`)
  })

  const escolha = await ReadlineUtil.askNumber('Escolha um número da lista: ')
  const index = escolha - 1
  //Para as pessoas, faz sentido ver a lista começando em 1

  if (index < 0 || index >= items.length) {
    // se selecionar <= 0 opção invalida
    console.log('Opção inválida.')
    return null
  }

  return items[index]
}
