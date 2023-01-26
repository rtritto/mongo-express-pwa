import { useAtom, useSetAtom } from 'jotai'

import DeleteModalBoxSimple from 'components/Custom/DeleteModalBoxSimple.tsx'
import { EP_API_DATABASE_COLLECTION } from 'configs/endpoints.ts'
import { documentsState, documentCountState } from 'store/globalAtoms.ts'

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
  const setDocuments = useSetAtom<MongoDocument[]>(documentsState)
  const [count, setCount] = useAtom<number>(documentCountState)

  return (show === true && count > 0 && (
    <DeleteModalBoxSimple
      deleteUrl={EP_API_DATABASE_COLLECTION(database, collection)}
      query={query}
      messages={{
        button: `Delete all ${count} document(s)`,
        modal: <>You want to delete all <strong>{count}</strong> document(s)?</>,
        success: `${count} documents deleted!`
      }}
      ButtonProps={{ sx: { width: "100%" } }}
      additionaOnDelete={() => {
        setDocuments([])
        setCount(0)
      }}
    />
  ))
}

export default DeleteDocuments