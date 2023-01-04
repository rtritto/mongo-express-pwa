import { Alert } from '@mui/material'
import { useRecoilState } from 'recoil'

import { messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const AlertMessages = () => {
  const [success, setSuccess] = useRecoilState<string | undefined>(messageSuccessState)
  const [error, setError] = useRecoilState<string | undefined>(messageErrorState)

  return (
    <>
      {success && (
        <Alert severity="success" onClose={() => { setSuccess(undefined) }} sx={{ my: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => { setError(undefined) }} sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
    </>
  )
}

export default AlertMessages