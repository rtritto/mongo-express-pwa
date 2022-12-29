import { FormControl, Select, SelectChangeEvent } from '@mui/material'
import { useRecoilState } from 'recoil'

import CustomLink from 'components/Custom/CustomLink.tsx'

const SelectLink = ({ baseUrl, entities = [], label, selectedState }) => {
  const [selected, setSelected] = useRecoilState<string>(selectedState)

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value)
  }

  return (
    <FormControl sx={{ display: 'inline', minWidth: 120 }} fullWidth size="small">
      <CustomLink
        key={label}
        // Link
        href={`${baseUrl}/${encodeURIComponent(selected)}`}
        style={{
          textDecoration: 'none',  // remove text underline
        }}
        // Button
        sx={{
          color: 'rgb(153, 143, 143)',
          justifyContent: 'flex-start',
          pl: 0,
          pr: 0.5,
          textTransform: 'none',  // remove uppercase
          ':hover': {
            color: 'white'
          }
        }}
        variant="text"
      >
        {label}:
      </CustomLink>

      <Select
        labelId="select-label"
        id="select"
        value={selected}
        onChange={handleChange}
        sx={{
          color: 'rgb(153, 143, 143)',
          ':hover': {
            color: 'white'
          }
        }}
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
              textDecoration: 'none',  // remove text underline
              ...(selected === entity) && {
                pointerEvents: 'none'  // disable onClick when selected
              }
            }}
            // Button
            disabled={selected === entity}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              paddingLeft: 2,
              textTransform: 'none',  // remove uppercase
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