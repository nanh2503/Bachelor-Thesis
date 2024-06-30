import { useRouter } from "next/router"
import ViewForm from "src/components/user/view";

const ViewPage = () => {
    const router = useRouter();
    const data = router.query.slugs;
    console.log('check album');

    return (
        <>
            {!!data && <ViewForm data={data} />}
        </>
    )

}

export default ViewPage