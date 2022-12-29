import { useRecoilValue } from 'recoil'

import { EP_DATABASE } from 'configs/endpoints.ts'
import SelectLink from 'components/Custom/SelectLink.tsx'
import { selectedCollectionState, selectedDbState } from 'store/globalAtoms.mts'

declare interface NavCollectionsProps {
  collections: ReqType.collections
}

const NavCollections = ({ collections }: NavCollectionsProps) => {
  const selectedDb = useRecoilValue<string>(selectedDbState)

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