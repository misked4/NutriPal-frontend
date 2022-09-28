import React from 'react'
import { Box, Table, TableCell, TableRow, Button } from '@mui/material';
import { theme } from './../../theme';

export const Day = () => {
    return (
      <Box sx={{width: '30%', border: '1px solid black' }} bgcolor={theme.palette.cream.main}>
        <Table>
            <TableRow >
                <TableCell variant="head">Dorucak</TableCell>
                <TableCell><Button color="ebony">Dodaj</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell variant="head">Jutarnja uzina</TableCell>
                <TableCell><Button color="ebony">Dodaj</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell variant="head">Rucak</TableCell>
                <TableCell><Button color="ebony">Dodaj</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell variant="head">Popodnevna uzina</TableCell>
                <TableCell><Button color="ebony">Dodaj</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell variant="head">Vecera</TableCell>
                <TableCell><Button color="ebony">Dodaj</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell variant="head">Obrok pred spavanje</TableCell>
                <TableCell><Button color="ebony">Dodaj</Button></TableCell>
            </TableRow>
        </Table>
      </Box>
    )
  }