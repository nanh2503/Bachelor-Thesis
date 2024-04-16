import { useRouter } from "next/router"
import ViewForm from "src/layouts/components/view";

const ViewPage = () => {
    const router = useRouter();
    const data = router.query.slugs;
    console.log({ data });

    return (
        <>
            {!!data && <ViewForm data={data} />}
        </>
    )

}

export default ViewPage