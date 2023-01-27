import { Box, Pagination } from '@mui/material'
import type { ChangeEvent } from 'react'

interface PaginationBoxProps {
  lastPage: number
  currentPage: number
  onChange: (event: ChangeEvent<unknown>, page: number) => void
}

const PaginationBox = ({ lastPage, currentPage, onChange }: PaginationBoxProps) => {
  return (
    <Box padding={1} textAlign="center">
      <Pagination
        count={lastPage}
        // hideNextButton={currentPage === lastPage}
        // hidePrevButton={currentPage === 1}
        onChange={onChange}
        page={currentPage}
        shape="rounded"
        siblingCount={0}
        sx={{ display: 'inline-flex' }}
        variant="outlined"
      />
    </Box>
  )
}

export default PaginationBox