import { ReadlineUtil } from './readline.util'

export async function selectFromList<T>(
  items: T[],
  formatLabel: (item: T) => string
): Promise<T | null> {
  if (items.length === 0) {
    console.log('Nenhum item disponível para selecionar.')
    return null
  }

  items.forEach((item, index) => {
    console.log(`${index + 1}. ${formatLabel(item)}`)
  })

  const escolha = await ReadlineUtil.askNumber('Escolha um número da lista: ')
  const index = escolha - 1

  if (index < 0 || index >= items.length) {
    console.log('Opção inválida.')
    return null
  }

  return items[index]
}
