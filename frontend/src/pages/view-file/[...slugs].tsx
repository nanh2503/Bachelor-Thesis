import { useRouter } from "next/router"
import ViewFileForm from "src/layouts/components/view-file";

const ViewFilePage = () => {
    const router = useRouter();
    const data = router.query.slugs;

    return (
        <>
            {!!data && <ViewFileForm data={data} />}
        </>
    )
}

export default ViewFilePage