import { useRouter } from "next/router"
import CropImageForm from "src/components/user/edit";

const CropImagePage = () => {
    const router = useRouter();
    const data = router.query.slugs;

    return (
        <>
            {!!data && <CropImageForm data={data} />}
        </>
    )
}

export default CropImagePage