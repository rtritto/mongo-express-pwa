import { useAtomValue } from 'jotai'

import { EP_DATABASE } from 'configs/endpoints.ts'
import SelectLink from 'components/Custom/SelectLink.tsx'
import { collectionsState, selectedCollectionState, selectedDatabaseState } from 'store/globalAtoms.ts'

const NavCollections = () => {
  const collections = useAtomValue<Mongo['collections']>(collectionsState)
  const selectedDb = useAtomValue<string>(selectedDatabaseState)

  return collections[selectedDb]?.length > 0 && (
    <SelectLink
      baseUrl={EP_DATABASE(selectedDb)}
      entities={collections[selectedDb]}
      label="Collection"
      selectedState={selectedCollectionState}
    />
  )
}

export default NavCollections