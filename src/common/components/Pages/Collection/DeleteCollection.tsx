import { useRouter } from 'next/router.js'

import DeleteCollectionBase from 'components/Custom/DeleteCollection.tsx'
import { EP_DATABASE } from 'configs/endpoints.ts'

interface DeleteCollectionProps {
  collection: string
  database: string
}

const DeleteCollection = ({ collection, database }: DeleteCollectionProps) => {
  const router = useRouter()

  return <DeleteCollectionBase
    collection={collection}
    database={database}
    additionalHandle={() => { router.push(EP_DATABASE(database)) }}
  />
}

export default DeleteCollection