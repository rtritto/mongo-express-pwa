import { useSetAtom } from 'jotai'

import { EP_API_DATABASE } from 'configs/endpoints.ts'
import DeleteModalBox from 'components/Custom/DeleteModalBox.tsx'
import { databasesState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const tooltipTitle = 'Are you sure you want to delete this database? All collections and documents will be deleted.'

interface DeleteModalBoxDatabaseProps {
  database: string
  additionaOnDelete: Function
}

const DeleteModalBoxDatabase = ({ database, additionaOnDelete }: DeleteModalBoxDatabaseProps) => {
  const setDatabases = useSetAtom<Mongo['databases']>(databasesState)
  const setSuccess = useSetAtom<string | undefined>(messageSuccessState)
  const setError = useSetAtom<string | undefined>(messageErrorState)

  const handleDelete = async (database: string) => {
    await fetch(EP_API_DATABASE(database), {
      method: 'DELETE'
    }).then(async (res) => {
      if (res.ok === true) {
        setSuccess('Database created!')
        // Remove database from global database to update viewing databases
        setDatabases((databases) => {
          const indexToRemove = databases.indexOf(database)
          return [
            ...databases.slice(0, indexToRemove),
            ...databases.slice(indexToRemove + 1)
          ]
        })
        if (typeof additionaOnDelete === 'function') {
          additionaOnDelete()
        }
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((error) => {
      setError(error.message)
    })
  }

  return (
    <DeleteModalBox
      value={database}
      entity="database"
      tooltipTitle={tooltipTitle}
      handleDelete={() => handleDelete(database)}
    />
  )
}

export default DeleteModalBoxDatabase