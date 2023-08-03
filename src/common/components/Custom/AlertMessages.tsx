import { Alert, Snackbar } from '@mui/material'
import { useAtom } from 'jotai'

import { messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const AlertMessages = () => {
  const [success, setSuccess] = useAtom(messageSuccessState)
  const [error, setError] = useAtom(messageErrorState)

  return (
    <>
      {success && (
        <Snackbar open>
          <Alert severity="success" onClose={() => { setSuccess(undefined) }} sx={{ my: 2 }}>
            {success}
          </Alert>
        </Snackbar>
      )}

      {error && (
        <Snackbar open>
          <Alert severity="error" onClose={() => { setError(undefined) }} sx={{ my: 2 }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}

export default AlertMessages