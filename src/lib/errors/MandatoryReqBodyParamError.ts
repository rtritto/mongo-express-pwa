export default class MandatoryReqBodyParamError extends Error {
  status: number

  constructor(parameter: string) {
    super(parameter === undefined
      ? 'Missing parameter in request body'
      : `Missing parameter '${parameter}' in request body`
    )
    this.name = 'MandatoryReqBodyParamError'
    this.status = 400
  }
}