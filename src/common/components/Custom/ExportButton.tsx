import { Button, SvgIcon } from '@mui/material'

import { Save } from 'common/SvgIcons.mts'

const ButtonExportImportStyle = {
  backgroundColor: 'rgb(139, 107, 62)',
  flexDirection: 'column',
  py: 0.5,
  textTransform: 'none'
} as const

interface ExportButtonProps {
  href: string
  text?: string
}

const ExportButton = ({ href, text = 'Export' }: ExportButtonProps) => {
  return (
    <Button
      href={href}
      startIcon={<SvgIcon><path d={Save} /></SvgIcon>}
      variant="contained"
      sx={ButtonExportImportStyle}
    >
      {text}
    </Button>
  )
}

export default ExportButton