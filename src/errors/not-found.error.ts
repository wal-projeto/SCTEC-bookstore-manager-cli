import { BaseError } from './base.error'

export class NotFoundError extends BaseError {
  constructor(entity: string, id: number) {
    super(`${entity} com id ${id} não foi encontrado(a).`)
  }
}
