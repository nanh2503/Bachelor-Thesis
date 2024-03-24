// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import { Box, Card, Tab as MuiTab, TabProps, Typography } from '@mui/material';

import { TabList, TabPanel, TabContext } from '@mui/lab';
import { styled } from '@mui/material/styles'


// ** Icons Imports
import { AccountOutline, LockOpenOutline, InformationOutline } from 'mdi-material-ui';

// ** Demo Tabs Imports
import { TabAccount, TabSecurity } from 'src/views/account-settings';

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { useSelector } from 'src/app/hooks';

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const AccountSettings = () => {
  const isLoggedIn = useSelector((state) => state.loginState.isLoggedIn)

  // ** State
  const [value, setValue] = useState<string>('account')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Card>
      {isLoggedIn ? (
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='account'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountOutline />
                  <TabName>Account</TabName>
                </Box>
              }
            />
            <Tab
              value='security'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LockOpenOutline />
                  <TabName>Security</TabName>
                </Box>
              }
            />
          </TabList>

          <TabPanel sx={{ p: 0 }} value='account'>
            <TabAccount />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='security'>
            <TabSecurity />
          </TabPanel>
        </TabContext>
      )
        : (
          <Typography variant='h2' mt={20} mb={20} textAlign={'center'}>
            You must <b>Login</b> to set up your account!
          </Typography>
        )}
    </Card>
  )
}

export default AccountSettings
