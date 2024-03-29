export default function withExceptionHandler(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      await handler(req, res)
    } catch (error: CustomApiError) {
      console.error(error)
      res.status(error.status || 500)
        .send({ error: error.message })
    }
  }
}