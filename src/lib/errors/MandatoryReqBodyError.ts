export default class MandatoryReqBodyError extends Error {
  status: number

  constructor(message = 'Missing body request') {
    super(message)
    this.name = 'MandatoryReqBodyError'
    this.status = 400
  }
}