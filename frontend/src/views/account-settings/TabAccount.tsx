// ** React Imports
import { useState, ElementType, ChangeEvent, forwardRef } from 'react'

import {
  Box,
  Grid,
  Radio,
  Button,
  Typography,
  TextField,
  FormLabel,
  RadioGroup,
  CardContent,
  FormControl,
  FormControlLabel
} from '@mui/material';

import { styled } from '@mui/material/styles'
import { ButtonProps } from '@mui/material/Button'

// ** Icons Imports
import { useDispatch, useSelector } from 'src/app/hooks'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { handleUpdateUserInfoService } from 'src/services/userServices';
import { setUserInfo } from 'src/app/redux/slices/userInfoSlice';

interface userInfoState {
  username: string,
  phoneNum: string,
  gender: string
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

const TabAccount = () => {
  const dispatch = useDispatch()

  const userInfo = useSelector((state) => state.localStorage.userInfoState.userInfo)

  // ** State
  const [imgSrc, setImgSrc] = useState<string>(userInfo?.avatar ?? '/images/avatars/male.png')
  const [birthDate, setBirthDate] = useState<Date>(userInfo?.birthDate && new Date(userInfo?.birthDate) instanceof Date ? new Date(userInfo?.birthDate) : new Date());

  const [values, setValues] = useState<userInfoState>({
    username: userInfo?.username ?? '',
    phoneNum: userInfo?.phoneNum ?? '',
    gender: userInfo?.gender ?? ''
  })

  const onChangeAvatar = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)

      reader.readAsDataURL(files[0])
    }
  }

  const handleChange = (prop: keyof userInfoState) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleSaveChanges = async () => {
    try {
      if (!!userInfo) {
        const response = await handleUpdateUserInfoService(userInfo?.email, values.username, imgSrc, birthDate, values.phoneNum, values.gender)

        const data = response.data;

        if (data && data.errCode === 0) {
          dispatch(setUserInfo(data.userInfo))
        }
      }
    } catch (e) {
      const error = e as { data: { errMessage: string } }
      setValues(prevState => ({ ...prevState, errMessage: error.data.errMessage }));
    }
  }

  return (
    <CardContent>
      {!!userInfo ? (
        <form>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      onChange={onChangeAvatar}
                      accept='image/png, image/jpeg'
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/male.png')}>
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Username'
                placeholder={userInfo?.username}
                value={values.username}
                onChange={handleChange('username')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='email'
                label='Email'
                placeholder={userInfo?.email}
                value={userInfo?.email}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  showYearDropdown
                  showMonthDropdown
                  id='account-settings-date'
                  placeholderText='MM-DD-YYYY'
                  customInput={<CustomInput />}
                  onChange={(birthDate: Date) => setBirthDate(birthDate)}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Phone'
                placeholder='(123) 456-7890'
                value={values.phoneNum}
                onChange={handleChange('phoneNum')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
                <RadioGroup
                  row
                  aria-label='gender'
                  name='account-settings-info-radio'
                  onChange={handleChange('gender')}
                  value={values.gender}
                >
                  <FormControlLabel value='male' label='Male' control={<Radio />} />
                  <FormControlLabel value='female' label='Female' control={<Radio />} />
                  <FormControlLabel value='other' label='Other' control={<Radio />} />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleSaveChanges}>
                Save Changes
              </Button>
              <Button type='reset' variant='outlined' color='secondary'>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : <></>}
    </CardContent>
  )
}

export default TabAccount
