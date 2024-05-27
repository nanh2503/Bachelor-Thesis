import { FileList, Image, Video } from "src/app/redux/slices/fileSlice";

const MediaOverlay = (props: { file: FileList, media: Image | Video }) => {
    const { file, media } = props;

    return (
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '10px', background: 'rgba(0, 0, 0, 0.7)' }}>
            <div style={{ display: 'flex' }}>
                <div>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{file.title}</div>
                    <div style={{ color: 'white', fontSize: '14px', margin: '5px 0' }}>{media.description}</div>
                </div>
                <div style={{ marginLeft: 30 }}>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                        View: {media.clickNum}
                    </div>
                    <div style={{ display: 'flex' }}>
                        {file.tagList.map((tag, index) => (
                            <div key={index} style={{ color: 'silver', fontSize: '14px', margin: '5px 2px', fontStyle: 'italic' }}>
                                #{tag}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MediaOverlay;