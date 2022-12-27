import { FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material'
import { useRecoilState, useRecoilValue } from 'recoil'

import { selectedDbState, databasesState } from 'store/globalAtoms.mts'
import CustomLink from 'components/Custom/CustomLink.tsx'

const NavDatabases = () => {
  const databases = useRecoilValue<string[]>(databasesState)
  const [selectedDb, setSelectedDb] = useRecoilState<string>(selectedDbState)

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedDb(event.target.value)
  }

  return (
    <FormControl sx={{ mx: 1, minWidth: 120, mt: 1, mb: 0.5 }} fullWidth size="small">
      <InputLabel id="select-database" size="small">Database</InputLabel>

      <Select
        labelId="select-label"
        id="select"
        value={selectedDb}
        label="Databases"
        onChange={handleChange}
        MenuProps={{
          MenuListProps: {
            disablePadding: true
          }
        }}
      >
        {databases.map((database) => (
          <CustomLink
            key={database}
            // Link
            href={`/db/${encodeURIComponent(database)}`}
            style={{
              display: 'flex',
              margin: 1,
              // marginLeft: 20,
              textDecoration: 'none',  // remove text underline
              // padding: 0, verticalAlign: 'middle',
              ...(selectedDb === database) && {
                pointerEvents: 'none'  // disable onClick when selected
              }
            }}
            // Button
            disabled={selectedDb === database}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              // padding: 0,
              paddingLeft: 2,
              textTransform: 'none' /* remove uppercase */,
              background: selectedDb === database ? 'grey' : 'darkgrey'
            }}
            value={database}
            variant="contained"
          >
            {database}
          </CustomLink>
        ))}
      </Select>
    </FormControl>
  )
}

export default NavDatabases