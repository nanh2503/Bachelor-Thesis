import { Button, Container, OutlinedInput } from "@mui/material";
import { ChangeEvent, PropsWithoutRef, useEffect, useState } from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from "next/router";
import { isValidEmail } from "src/utils/format";
import { handleForgetPasswordService } from "src/services/userServices";
import styles from "styles/auth.module.scss";
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustration";

interface State {
    email: string,
    errCode: number,
    errMessage: string,
}

const ForgetPasswordForm = (props: PropsWithoutRef<{
    onChangeViewLogin?: () => void;
}>) => {

    const { onChangeViewLogin } = props;

    const router = useRouter();
    const [values, setValues] = useState<State>({
        email: '',
        errCode: -1,
        errMessage: '',
    })

    useEffect(() => {
        setValues(prevState => ({ ...prevState, errMessage: '' }))
    }, [values.email])

    const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleSearchAccount = async () => {
        try {
            const response = await handleForgetPasswordService(values.email);

            const data = response.data;
            if (data && data.errCode !== 0) {
                setValues(prevState => ({ ...prevState, errMessage: data.errMessage }));
            } else if (data && data.errCode === 0) {
                router.push(`/otp-verification/${values.email}`)
            }
        } catch (e) {
            const error = e as { data: { errMessage: string } }
            setValues(prevState => ({ ...prevState, errMessage: error.data.errMessage }));
        }
    }

    return <div className={styles.authForm}>
        <div className={styles.container}>
            <div style={{ marginBottom: '15px' }}>
                <Button onClick={onChangeViewLogin} startIcon={<ArrowBackIosNewIcon />} sx={{ fontSize: 18 }}>
                    Back
                </Button>
            </div>
            <div className={styles.title}>Forgot password?</div>
            <div className={styles.desc}>Lost your password? Please enter your email address. You will receive a link to create a new password via email.</div>
            <div className={styles.authFormItem}>
                <label htmlFor="email">Email</label>
                <div className={styles.input}>
                    <OutlinedInput
                        id="email"
                        autoComplete="email"
                        fullWidth
                        placeholder="Enter your email"
                        onChange={handleChange('email')}
                    />
                    {values.email.length > 0 && !isValidEmail(values.email) && <div className={styles.errorMsg}>Invalid email</div>}
                    {values.errMessage &&
                        <div className={styles.errorMsg}>
                            {values.errMessage}
                        </div>
                    }
                </div>
            </div>

            <Button
                fullWidth
                size='large'
                variant='contained'
                sx={{ marginTop: 7, color: '#fff' }}
                onClick={handleSearchAccount}
            >
                Search Account
            </Button>
        </div>
        <FooterIllustrationsV1 />
    </div>
}

export default ForgetPasswordForm;