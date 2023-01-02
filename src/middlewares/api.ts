export function withExceptionFilter(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      return await handler(req, res)
    } catch (error: CustomApiError) {
      res.status(error.status || 500)
        .send({ error: error.message })
    }
  }
}