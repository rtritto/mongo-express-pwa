import { useAtomValue, useSetAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useEffect, useRef } from 'react'

import StatsTable from 'components/Custom/StatsTable.tsx'
import { databaseStatsState } from 'store/globalAtoms.ts'

interface DatabaseStatsProps {
  databaseStats: any // TODO
}

const DatabaseStats = ({ databaseStats: databaseStatsInit }: DatabaseStatsProps) => {
  const { current: initialValues } = useRef([[databaseStatsState, databaseStatsInit]] as const)
  useHydrateAtoms(initialValues)
  const setDatabaseStats = useSetAtom(databaseStatsState)

  useEffect(() => {
    setDatabaseStats(databaseStatsInit)
  }, [databaseStatsInit, setDatabaseStats])

  const databaseStats = useAtomValue(databaseStatsState)

  return <StatsTable label="Database Stats" fields={databaseStats} />
}

export default DatabaseStats