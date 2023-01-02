import { Alert } from '@mui/material'
import { useRecoilState } from 'recoil'

import { messageErrorState, messageSuccessState } from 'store/globalAtoms.mts'

const AlertMessages = () => {
  const [success, setSuccess] = useRecoilState<string | undefined | null>(messageSuccessState)
  const [error, setError] = useRecoilState<string | undefined | null>(messageErrorState)

  return (
    <>
      {success && (
        <Alert severity="success" onClose={() => { setSuccess(null) }} sx={{ my: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => { setError(null) }} sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
    </>
  )
}

export default AlertMessages