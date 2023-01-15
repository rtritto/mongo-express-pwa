import { useAtomValue } from 'jotai'

import { EP_DB } from 'configs/endpoints.ts'
import SelectLink from 'components/Custom/SelectLink.tsx'
import { databasesState, selectedDatabaseState } from 'store/globalAtoms.ts'

const NavDatabases = () => {
  const databases = useAtomValue<Mongo['collections']>(databasesState)
  return (
    <SelectLink
      baseUrl={EP_DB}
      entities={databases}
      label="Database"
      selectedState={selectedDatabaseState}
    />
  )
}

export default NavDatabases