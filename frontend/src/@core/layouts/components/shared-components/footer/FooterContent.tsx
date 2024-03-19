// ** MUI Imports
import { Box, Typography, Link } from '@mui/material'

// import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Made with `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` by `}
        <Link target='_blank' href='https://www.facebook.com/ngocanh.mai.52438/'>
          Nganh
        </Link>
      </Typography>
    </Box>
  )
}

export default FooterContent
