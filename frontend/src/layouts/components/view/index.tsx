import { Input } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { Image } from "src/app/redux/slices/fileSlice";
import { setTitles } from "src/app/redux/slices/uploadFileSlice";

const ViewForm = (props: { data: string | string[] }) => {
    const dispatch = useDispatch();

    const { data } = props

    const fileList = useSelector((state) => state.fileListState.file)

    const [image, setImage] = useState<Image | null>(null)

    useEffect(() => {
        const getFile = () => {
            fileList.map((file, index) => {
                if (data[0] === 'image' && file.images.some(image => image._id === data[1])) {
                    file.images.map((image, idx) => {
                        if (image._id === data[1]){
                            console.log('check image: ', image);
                            setImage(image);
                        }
                    })
                }
            })
        }
        getFile();
    }, [data])

    console.log({ image });

    // const handleTitleChange = (value: string) => {
    //     dispatch(setTitles(value));
    // };

    // const handleDescriptionChange = (index: number, value: string) => {
    //     const newDescriptions = [...descriptions];
    //     newDescriptions[index] = value;
    //     dispatch(setDescriptions(newDescriptions))
    // };

    return (
        <div>
            hello Nganh
            {/* <div className='container'>
                <h1>View File</h1>
                <div className='title-container'>
                    <Input
                        type='text'
                        placeholder='Enter title'
                        value={titles}
                        onChange={(e) => handleTitleChange(e.target.value)}
                    />
                </div>

                <div className='file-item'>
                    <div className='image-container'>
                        {imagesReview.map((image, index) => {
                            return (
                                <div key={index}>
                                    <img src={image} alt={`Uploaded Image File ${index + 1}`} className='file-image' />
                                    <div className='description-container'>
                                        <input
                                            placeholder='Add description'
                                            value={descriptions[index]}
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                            className='description-input'
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className='video-container'>
                        {videosReview.map((video, index) => {
                            const indexVideo = index + imagesReview.length;
                            return (
                                <div key={indexVideo}>
                                    <video controls>
                                        <source src={video} type='video/mp4' className='file-video' />
                                    </video>
                                    <div className='description-container'>
                                        <input
                                            placeholder='Add description'
                                            value={descriptions[indexVideo]}
                                            onChange={(e) => handleDescriptionChange(indexVideo, e.target.value)}
                                            className='description-input'
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default ViewForm