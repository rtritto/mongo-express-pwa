import { useRecoilValue } from 'recoil'

import { EP_DATABASE } from 'configs/endpoints.ts'
import SelectLink from 'components/Custom/SelectLink.tsx'
import { collectionsState, selectedCollectionState, selectedDatabaseState } from 'store/globalAtoms.mts'

const NavCollections = () => {
  const collections = useRecoilValue<Mongo['collections']>(collectionsState)
  const selectedDb = useRecoilValue<string>(selectedDatabaseState)

  return (
    <SelectLink
      baseUrl={EP_DATABASE(selectedDb)}
      entities={collections[selectedDb]}
      label="Collection"
      selectedState={selectedCollectionState}
    />
  )
}

export default NavCollections