import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

export function DescriptionAlertError(descText) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="error">
        <AlertTitle>Greska</AlertTitle>
        {descText} — <strong>check it out!</strong>
      </Alert>
    </Stack>
  );
}
export function DescriptionAlertWarning(descText) {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="warning">
          <AlertTitle>Upozorenje</AlertTitle>
          {descText} — <strong>check it out!</strong>
        </Alert>
      </Stack>
    );
  }
  export function DescriptionAlertInfo(descText) {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          {descText} — <strong>check it out!</strong>
        </Alert>
      </Stack>
    );
  }
  export function DescriptionAlertSuccess(descText) {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="success">
          <AlertTitle>Uspesno</AlertTitle>
          {descText} — <strong>check it out!</strong>
        </Alert>
      </Stack>
    );
  }