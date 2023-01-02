import { EJSON } from 'bson'

const ALLOWED_MIME_TYPES = new Set([
  'text/csv',
  'application/json'
])

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {  // importCollection
    if (!req.files) {
      return res.status(400).send('Missing file')
    }

    const files = Object.values(req.files)

    const areInvalidFiles = files.some((file) => !ALLOWED_MIME_TYPES.has(file.mimetype)
      || !file.data
      || !file.data.toString)
    if (areInvalidFiles) {
      return res.status(400).send('Bad file')
    }

    const docs = []

    for (const file of files) {
      const fileContent = file.data.toString('utf8')
      const lines = fileContent.split('\n').map((line) => line.trim()).filter(Boolean)
      for (const line of lines) {
        try {
          const parsedData = EJSON.parse(line)
          docs.push(...parsedData)
        } catch (error) {
          console.error(error)
          return res.status(400).send('Bad file content')
        }
      }
    }
    await req.collection.insertMany(docs).then((stats) => {
      res.status(200).send(`${stats.insertedCount} document(s) inserted`)
    }).catch((error) => {
      console.error(error)
      res.status(500).send('Server error')
    })
  }
}

export default handler