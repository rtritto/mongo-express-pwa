import { EP_DB } from 'configs/endpoints.ts'
import SelectLink from 'components/Custom/SelectLink.tsx'
import { selectedDatabaseState } from 'store/globalAtoms.mts'

declare interface NavDatabasesProps {
  databases: ReqType['databases']
}

const NavDatabases = ({ databases }: NavDatabasesProps) => {
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