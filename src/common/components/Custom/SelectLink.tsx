import { FormControl, Select, SelectChangeEvent } from '@mui/material'
import { RecoilState, useRecoilState, useSetRecoilState } from 'recoil'

import CustomLink from 'components/Custom/CustomLink.tsx'
import { messageErrorState, messageSuccessState } from 'store/globalAtoms.mts'

interface SelectLinkProps {
  baseUrl: string
  entities: string[]
  label: string
  selectedState: RecoilState<string>
}

const SelectLink = ({ baseUrl, entities = [], label, selectedState }: SelectLinkProps) => {
  const [selected, setSelected] = useRecoilState<string>(selectedState)
  const setSuccess = useSetRecoilState<string | undefined | null>(messageSuccessState)
  const setError = useSetRecoilState<string | undefined | null>(messageErrorState)

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value)
    // reset Alerts
    setSuccess(null)
    setError(null)
  }

  return (
    <FormControl sx={{ display: selected ? 'inline' : 'inline-flex', minWidth: 120 }} fullWidth size="small">
      {selected && (
        <CustomLink
          key={label}
          // Link
          href={`${baseUrl}/${encodeURIComponent(selected)}`}
          style={{
            textDecoration: 'none'  // remove text underline
          }}
          // Button
          onClick={() => {
            // reset Alerts
            setSuccess(null)
            setError(null)
          }}
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
      )}

      <Select
        id={`select${label}`}
        displayEmpty
        renderValue={(value: string): React.ReactNode =>
          (value === '' ? label : value) as string
        }
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