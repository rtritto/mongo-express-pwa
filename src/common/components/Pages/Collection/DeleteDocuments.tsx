import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router.js'

import DeleteDialogSimple from 'components/Custom/DeleteDialogSimple.tsx'
import { EP_API_DATABASE_COLLECTION } from 'configs/endpoints.ts'
import { documentCountState } from 'store/globalAtoms.ts'

interface DeleteDocumentsProps {
  collection: string
  database: string
  query: QueryParameter
  show: boolean
}

const DeleteDocuments = ({
  collection,
  database,
  query,
  show
}: DeleteDocumentsProps) => {
  const router = useRouter()

  const count = useAtomValue<number>(documentCountState)

  return (show === true && count > 0 && (
    <DeleteDialogSimple
      deleteUrl={EP_API_DATABASE_COLLECTION(database, collection)}
      query={query}
      messages={{
        button: `Delete all ${count} document(s)`,
        modal: <>You want to delete all <strong>{count}</strong> document(s)?</>,
        success: `${count} documents deleted!`
      }}
      ButtonProps={{ sx: { width: "100%" } }}
      additionalHandle={() => { router.reload() }}
    />
  ))
}

export default DeleteDocuments