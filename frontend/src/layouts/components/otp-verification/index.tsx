import { useEffect, useState } from 'react';
import style from '/styles/otp.module.scss';
import { handleCheckOTPService, handleUpdateUserInfoService } from 'src/services/userServices';
import { useDispatch } from 'src/app/hooks';
import { setUser } from 'src/app/redux/slices/loginSlice';
import { setUserInfo } from 'src/app/redux/slices/userInfoSlice';
import { useRouter } from 'next/router';

interface State {
    errCode: number,
    errMessage: string,
}


const OTPVerfication = (props: { email: string }) => {
    const { email } = props;

    const dispatch = useDispatch();
    const router = useRouter();

    const [values, setValues] = useState<State>({
        errCode: -1,
        errMessage: '',
    })

    useEffect(() => {
        const inputs = document.querySelectorAll(`.${style.otpCardInput} input`) as NodeListOf<HTMLInputElement>;
        const button = document.querySelector(`.${style.otpCard} button`);

        button?.setAttribute('disabled', 'true');

        inputs.forEach(input => {
            let lastInputStatus = 0;
            input.onkeyup = (e) => {
                const currentElement = e.target as HTMLInputElement;;
                const nextElement = input.nextElementSibling as HTMLInputElement;
                const prevElement = input.previousElementSibling as HTMLInputElement;

                if (prevElement && e.keyCode === 8) { //click on backspace
                    if (lastInputStatus === 1) {
                        prevElement.value = '';
                        prevElement.focus();
                    }
                    button?.setAttribute('disabled', 'true');
                    lastInputStatus = 1;
                } else {
                    const reg = /^[0-9]+$/
                    if (!reg.test(currentElement.value)) {
                        currentElement.value = currentElement.value.replace(/\D/g, '');
                    } else if (currentElement.value) {
                        if (nextElement) {
                            nextElement.focus();
                        } else {
                            button?.removeAttribute('disabled');
                            lastInputStatus = 0;
                        }
                    }
                }
            }
        })
    })

    const handleVerifyOTP = async () => {
        let otp = '';
        const inputs = document.querySelectorAll(`.${style.otpCardInput} input`) as NodeListOf<HTMLInputElement>;
        inputs.forEach(input => {
            otp += input.value;
        })
        const res = await handleCheckOTPService(otp);
        const data = res.data;
        if (data && data.errCode !== 0) {
            setValues(prevState => ({ ...prevState, errMessage: data.errMessage, errCode: data.errCode }))
        } else if (data && data.errCode === 0) {
            dispatch(setUser(data.user))
            router.push("/");
            await handleUpdateUserInfoService(data.user.email, data.user.username);
            dispatch(setUserInfo(data.user))
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={style.otpCard}>
                <h1>OTP Verification</h1>
                <p>Code has been send to <b>{email}</b></p>
                <div className={style.otpCardInput}>
                    <input type="text" maxLength={1} autoFocus />
                    <input type="text" maxLength={1} />
                    <input type="text" maxLength={1} />
                    <input type="text" maxLength={1} />
                </div>
                <p>Didn't get the OTP <a href="#">Resend</a></p>
                <button onClick={handleVerifyOTP}>Verify</button>
            </div>
        </div>
    )
}

export default OTPVerfication;