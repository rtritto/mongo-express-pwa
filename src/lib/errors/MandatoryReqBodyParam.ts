export default class MandatoryReqBodyParam extends Error {
  status: number

  constructor(parameter: string) {
    super(parameter === undefined
      ? 'Missing parameter in request body'
      : `Missing parameter '${parameter}' in request body`
    )
    this.status = 400
  }
}