import { useRouter } from "next/router";
import OTPVerfication from "src/components/auth/otp-verification";

const OTPVerficationPage = () => {
    const router = useRouter();
    const data = router.query.slugs;

    return (
        <div>
            {!!data && <OTPVerfication email={data[0]} />}
        </div>
    )
}

export default OTPVerficationPage;