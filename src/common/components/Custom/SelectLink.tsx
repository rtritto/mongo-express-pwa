import { FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material'
import { useRecoilState } from 'recoil'

import CustomLink from 'components/Custom/CustomLink.tsx'

const SelectLink = ({ baseUrl, entities = [], label, selectedState }) => {
  const [selected, setSelected] = useRecoilState<string>(selectedState)

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value)
  }

  return (
    <FormControl sx={{ mx: 1, minWidth: 120, mt: 1, mb: 0.5 }} fullWidth size="small">
      <InputLabel id={`select-${label}`} size="small">{label}</InputLabel>

      <Select
        labelId="select-label"
        id="select"
        value={selected}
        label={label}
        onChange={handleChange}
        MenuProps={{
          MenuListProps: {
            disablePadding: true
          }
        }}
      >
        {entities.map((entity) => (
          <CustomLink
            key={entity}
            // Link
            href={`${baseUrl}/${encodeURIComponent(entity)}`}
            style={{
              display: 'flex',
              margin: 1,
              // marginLeft: 20,
              textDecoration: 'none',  // remove text underline
              // padding: 0, verticalAlign: 'middle',
              ...(selected === entity) && {
                pointerEvents: 'none'  // disable onClick when selected
              }
            }}
            // Button
            disabled={selected === entity}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              // padding: 0,
              paddingLeft: 2,
              textTransform: 'none' /* remove uppercase */,
              background: selected === entity ? 'grey' : 'darkgrey'
            }}
            value={entity}
            variant="contained"
          >
            {entity}
          </CustomLink>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectLink