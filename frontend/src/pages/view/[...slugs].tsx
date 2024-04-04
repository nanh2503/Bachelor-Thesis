import { useRouter } from "next/router"
import { useSelector } from "src/app/hooks";
import ViewForm from "src/layouts/components/view";

const ViewPage = () => {
    const router = useRouter();
    const data = router.query.slugs;
    
    return (
        <>
            {!!data && <ViewForm data={data} />}
        </>
    )

}

export default ViewPage