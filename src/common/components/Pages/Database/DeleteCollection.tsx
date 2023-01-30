import { useRouter } from 'next/router.js'

import DeleteCollectionBase from 'components/Custom/DeleteCollection.tsx'

interface DeleteCollectionProps {
  collection: string
  database: string
}

const DeleteCollection = ({ collection, database }: DeleteCollectionProps) => {
  const router = useRouter()

  return <DeleteCollectionBase
    collection={collection}
    database={database}
    additionalHandle={() => { router.reload() }}
  />
}

export default DeleteCollection