import { useSetAtom } from 'jotai'

import { EP_API_DATABASE } from 'configs/endpoints.ts'
import DeleteDialog from 'components/Custom/DeleteDialog.tsx'
import { databasesState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const tooltipTitle = 'Do you want to delete this database? All collections and documents will be deleted.'

interface DeleteDatabaseProps {
  database: string
}

const DeleteDatabase = ({ database }: DeleteDatabaseProps) => {
  const setDatabases = useSetAtom<Mongo['databases']>(databasesState)
  const setSuccess = useSetAtom<string | undefined>(messageSuccessState)
  const setError = useSetAtom<string | undefined>(messageErrorState)

  const handleDelete = async (database: string) => {
    await fetch(EP_API_DATABASE(database), {
      method: 'DELETE'
    }).then(async (res) => {
      if (res.ok === true) {
        // Remove database from global database to update viewing databases
        setDatabases((databases) => {
          const indexToRemove = databases.indexOf(database)
          return [
            ...databases.slice(0, indexToRemove),
            ...databases.slice(indexToRemove + 1)
          ]
        })
        setSuccess(`Database "${database}" deleted!`)
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((error) => { setError(error.message) })
  }

  return (
    <DeleteDialog
      value={database}
      entity="database"
      tooltipTitle={tooltipTitle}
      handleDelete={() => handleDelete(database)}
    />
  )
}

export default DeleteDatabase