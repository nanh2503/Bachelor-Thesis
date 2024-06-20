// ** MUI Imports
import { Box, Typography, Link } from '@mui/material'

// import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
      <Typography sx={{ mr: 2, color: '#fff' }}>
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
