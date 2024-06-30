import { useRouter } from "next/router";
import ShowFileListComponent from "src/components/admin/user-collection/show-fileList";

const ShowFileListPage = () => {
    const router = useRouter();
    const data = router.query.slugs;

    console.log('check data: ', data);

    return (
        <div>
            {data && <ShowFileListComponent _id={data[0]} />}
        </div>
    )
}

export default ShowFileListPage;