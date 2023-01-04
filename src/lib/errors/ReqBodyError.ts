export default class ReqBodyError extends Error {
  status: number

  constructor(message: string) {
    super(message)
    this.name = 'ReqBodyError'
    this.status = 400
  }
}