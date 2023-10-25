// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { Button, Card, CardContent, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'

const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const Dashboard = () => {
  const theme = useTheme()

  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <ApexChartWrapper>
      <Card sx={{ position: 'relative', height: 400 }}>
        <CardContent>
          <Typography variant='h2' mt={30} textAlign={'center'}>
            Welcome to {themeConfig.templateName}
            🥳
          </Typography>
          <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}></Typography>
          <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
          <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
        </CardContent>
      </Card>
    </ApexChartWrapper>
  )
}

export default Dashboard
