import { Box, Button, Container, IconButton, OutlinedInput, Typography } from "@mui/material";
import { EyeOffOutline, EyeOutline } from "mdi-material-ui";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { handleResetPasswordService } from "src/services/userServices";

interface State {
    password: string,
    cfPassword: string,
    errCode: number,
    errMessage: string,
    showPassword: boolean,
}

const ResetPasswordForm = () => {
    const router = useRouter();
    const [values, setValues] = useState<State>({
        password: '',
        cfPassword: '',
        errCode: -1,
        errMessage: '',
        showPassword: false,
    })

    const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword })
    }

    const handleResetPassword = async () => {
        try {
            const res = await handleResetPasswordService(values.password, values.cfPassword)

            const data = res.data;
            if (data && data.errCode !== 0) {
                setValues(prevState => ({ ...prevState, errMessage: data.errMessage }));
            } else {
                router.push("/auth/login")
            }
        } catch (e) {
            const error = e as { data: { errMessage: string } }
            setValues(prevState => ({ ...prevState, errMessage: error.data.errMessage }));
        }
    }

    return (
        <div className="auth-form">
            <Container maxWidth="xl">
                <div className="title">Reset your password</div>
                <div className="desc">Enter your new password to reset your password.</div>
                <div className="auth-form-item">
                    <label htmlFor="password" className="item-name">Password</label>
                    <div className="input-item">
                        <OutlinedInput
                            id='password'
                            sx={{ marginBottom: 4 }}
                            fullWidth
                            placeholder="Enter your password"
                            value={values.password}
                            onChange={handleChange('password')}
                            type={values.showPassword ? 'text' : 'password'}
                            endAdornment={
                                <IconButton
                                    onClick={handleClickShowPassword}
                                >
                                    {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                                </IconButton>
                            }
                        />
                    </div>
                </div>

                <div className="auth-form-item">
                    <label htmlFor="cfPassword" className="item-name">Confirm password</label>
                    <div className="input-item">
                        <OutlinedInput
                            id='cfPassword'
                            sx={{ marginBottom: 4 }}
                            fullWidth
                            placeholder="Enter your confirm password"
                            value={values.cfPassword}
                            onChange={handleChange('cfPassword')}
                            type={values.showPassword ? 'text' : 'password'}
                            endAdornment={
                                <IconButton
                                    onClick={handleClickShowPassword}
                                >
                                    {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                                </IconButton>
                            }
                        />
                    </div>
                </div>

                {values.errMessage &&
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography variant='body1' sx={{ color: 'red' }}>
                            {values.errMessage}
                        </Typography>
                    </Box>
                }

                <Button
                    fullWidth
                    size='large'
                    variant='contained'
                    sx={{ marginTop: 7, height: 50 }}
                    onClick={handleResetPassword}
                >
                    Reset Password
                </Button>
            </Container>
        </div>
    )
}

export default ResetPasswordForm;