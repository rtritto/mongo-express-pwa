import { useSetAtom } from 'jotai'

import { EP_API_DATABASE_COLLECTION } from 'configs/endpoints.ts'
import DeleteDialog from 'components/Custom/DeleteDialog.tsx'
import { messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const tooltipTitle = 'Do you want to delete this collection? All documents will be deleted.'

interface DeleteCollectionProps {
  collection: string
  database: string
  additionalHandle?: () => void
}

const DeleteCollection = ({ collection, database, additionalHandle }: DeleteCollectionProps) => {
  const setSuccess = useSetAtom(messageSuccessState)
  const setError = useSetAtom(messageErrorState)

  const handleDelete = async (database: string, collection: string) => {
    await fetch(EP_API_DATABASE_COLLECTION(database, collection), {
      method: 'DELETE'
    }).then(async (res) => {
      if (res.ok === true) {
        setSuccess(`Collection "${collection}" deleted!`)
        if (typeof additionalHandle === 'function') {
          additionalHandle()
        }
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((error) => { setError(error.message) })
  }

  return (
    <DeleteDialog
      value={collection}
      entity="collection"
      tooltipTitle={tooltipTitle}
      handleDelete={() => handleDelete(database, collection)}
    />
  )
}

export default DeleteCollection