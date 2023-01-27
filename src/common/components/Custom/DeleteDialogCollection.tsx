import { useSetAtom } from 'jotai'

import { EP_API_DATABASE_COLLECTION } from 'configs/endpoints.ts'
import DeleteDialog from 'components/Custom/DeleteDialog.tsx'
import { collectionsState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const tooltipTitle = 'Do you want to delete this collection? All documents will be deleted.'

interface DeleteDialogCollectionProps {
  collection: string
  database: string
  additionalHandle: Function
}

const DeleteDialogCollection = ({ collection, database, additionalHandle }: DeleteDialogCollectionProps) => {
  const setCollections = useSetAtom<Mongo['collections']>(collectionsState)
  const setSuccess = useSetAtom<string | undefined>(messageSuccessState)
  const setError = useSetAtom<string | undefined>(messageErrorState)

  const handleDelete = async (database: string, collection: string) => {
    await fetch(EP_API_DATABASE_COLLECTION(database, collection), {
      method: 'DELETE'
    }).then(async (res) => {
      if (res.ok === true) {
        // Remove collection from global collections to update viewing collections
        setCollections((collections) => {
          const indexToRemove = collections[database].indexOf(collection)
          return {
            ...collections,
            [database]: [
              ...collections[database].slice(0, indexToRemove),
              ...collections[database].slice(indexToRemove + 1)
            ]
          }
        })
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

export default DeleteDialogCollection