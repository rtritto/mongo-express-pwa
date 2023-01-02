export default class MandatoryReqBody extends Error {
  status: number

  constructor(message: string = 'Missing body request') {
    super(message)
    this.status = 400
  }
}