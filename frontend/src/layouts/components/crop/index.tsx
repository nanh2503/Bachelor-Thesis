import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import { useSelector } from "src/app/hooks";
import { Image } from "src/app/redux/slices/fileSlice";
import 'react-image-crop/dist/ReactCrop.css';
import { faCrop, faMagnifyingGlassPlus, faMagnifyingGlassMinus, faRotateRight, faRotateLeft, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { fabric } from 'fabric';

const CropImageForm = (props: { data: string | string[] }) => {

    const { data } = props;

    const fileList = useSelector((state) => state.fileListState.file)

    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
    const blobUrlRef = useRef('')

    const [imageSrc, setImageSrc] = useState<Image | null>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(undefined)
    const [flipX, setFlipX] = useState(false);
    const [flipY, setFlipY] = useState(false);
    const [cropStart, setCropStart] = useState(false);
    const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);
    const [drag, setDrag] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [startDraw, setStartDraw] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosX, setLastPosX] = useState(0);
    const [lastPosY, setLastPosY] = useState(0);


    useEffect(() => {
        const getFile = () => {
            fileList.map((file) => {
                if (data[0] === 'image' && file.images.some((image) => image._id === data[1])) {
                    file.images.map((image) => {
                        if (image._id === data[1]) {
                            setImageSrc(image);
                        }
                    })
                }
            })
        }

        getFile()
    }, [data])

    const centerAspectCrop = (mediaWidth: number, mediaHeight: number, aspect: number) => {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90
                },
                aspect,
                mediaWidth,
                mediaHeight
            ),
            mediaWidth,
            mediaHeight
        )
    }

    const handleCropImage = () => {
        setCropStart(true);
        setAspect(16 / 9)

        if (imageRef.current) {
            const { width, height } = imageRef.current;
            const newCrop = centerAspectCrop(width, height, 16 / 9);
            setAspect(undefined);
            setCrop(newCrop);
        }
    }

    const handleSaveCrop = () => {
        if (completedCrop && imageRef.current) {
            const canvas = document.createElement('canvas');
            const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
            const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
            canvas.width = completedCrop.width;
            canvas.height = completedCrop.height;
            const ctx = canvas.getContext('2d');

            ctx?.drawImage(
                imageRef.current,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width,
                completedCrop.height
            );

            const base64Image = canvas.toDataURL('image/png');

            // Lưu ảnh đã crop và cập nhật state
            setCroppedImage(base64Image);
            setCrop(undefined);
            setCropStart(false);
        }
    }

    const handleCancelCrop = () => {
        setCropStart(false);
        setCrop(undefined);
        setCompletedCrop(undefined);
    }

    const onDownloadCropClick = async () => {
        const image = imageRef.current;
        const previewCanvas = previewCanvasRef.current;
        if (!image || !previewCanvas || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const offscreen = new OffscreenCanvas(
            completedCrop.width * scaleX,
            completedCrop.height * scaleY
        )

        const ctx = offscreen.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }

        ctx.drawImage(
            previewCanvas,
            0,
            0,
            previewCanvas.width,
            previewCanvas.height,
            0,
            0,
            offscreen.width,
            offscreen.height
        )

        const blob = await offscreen.convertToBlob({
            type: 'image/png',
        })

        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current)
        }
        blobUrlRef.current = URL.createObjectURL(blob)

        if (hiddenAnchorRef.current) {
            hiddenAnchorRef.current.href = blobUrlRef.current
            hiddenAnchorRef.current.click()
        }
    }

    const handleZoomOut = () => {
        if (scale > 1) {
            setScale(scale - 0.1)
        }
    }

    const handleMouseDownZoom = (event: React.MouseEvent<HTMLElement>) => {
        setDrag(true);
        setStartPos({
            x: event.clientX,
            y: event.clientY
        })
    }

    const handleMouseMoveZoom = (event: React.MouseEvent<HTMLElement>) => {
        if (drag && imageRef.current) {
            const { clientX, clientY } = event;

            //Tính toán sự thay đổi vị trí của chuột so với vị trí ban đầu
            const dx = clientX - startPos.x;
            const dy = clientY - startPos.y;

            //Lấy kích thước và vị trí của khung container
            const imageContainer = document.querySelector('.image-container');
            const containerRect = imageContainer?.getBoundingClientRect();

            //Lấy kích thước và vị trí của ảnh
            const imageCrop = document.querySelector('.file-crop');
            const imageCropBound = imageCrop?.getBoundingClientRect();

            //Set vị trí mới cho ảnh
            let newOffsetX = offset.x + dx;
            let newOffsetY = offset.y + dy;

            //Khi khung ảnh trùng với khung container thì không cho kéo ảnh nữa
            if (
                !!containerRect && !!imageCropBound && (
                    (containerRect.left <= imageCropBound.left && dx > 0) ||
                    (containerRect.right >= imageCropBound.right && dx < 0) ||
                    (containerRect.top <= imageCropBound.top && dy > 0) ||
                    (containerRect.bottom >= imageCropBound.bottom && dy < 0)
                )
            ) {
                //Không cập nhật newOffsetX và newOffsetY
                newOffsetX = offset.x;
                newOffsetY = offset.y;
            }

            setOffset({ x: newOffsetX, y: newOffsetY });
            setStartPos({ x: clientX, y: clientY });
        }
    }

    const handleMouseUpZoom = () => {
        setDrag(false);
    }

    const handleSetActualSize = () => {
        setScale(1);
        setOffset({ x: 0, y: 0 });
    }

    return (
        <>
            <h1 style={{ justifyContent: 'left' }}>Resize & Crop</h1>
            <div className="crop-container">
                <div className="icon-control">
                    {!cropStart && (
                        <div className="icon-list">
                            <FontAwesomeIcon
                                icon={faMagnifyingGlassPlus}
                                className="icon"
                                onClick={() => setScale(scale + 0.1)}
                            />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlassMinus}
                                className="icon"
                                style={{ color: scale == 1 ? 'silver' : '' }}
                                onClick={handleZoomOut}
                            />
                            <img
                                src="/images/actualSize.svg"
                                className="icon-image"
                                alt="actual-size-icon"
                                onClick={handleSetActualSize}
                            />
                            <FontAwesomeIcon
                                icon={faPencil}
                                className='icon'
                                style={{ backgroundColor: startDraw ? 'rgb(116, 193, 116)' : '' }}
                            />
                            <FontAwesomeIcon
                                icon={faCrop}
                                className="icon"
                                onClick={handleCropImage}
                            />
                            <FontAwesomeIcon
                                icon={faRotateRight}
                                className="icon"
                                onClick={() => setRotate(rotate + 90)}
                            />
                            <FontAwesomeIcon
                                icon={faRotateLeft}
                                className="icon"
                                onClick={() => setRotate(rotate - 90)}
                            />
                            <img
                                src="/images/flipHorizontalIcon.svg"
                                className="icon-image"
                                alt="flip-horizontal-icon"
                                onClick={() => setFlipX(!flipX)}
                                style={{ height: 50 }}
                            />
                            <img
                                src="/images/flipVerticalIcon.svg"
                                className="icon-image"
                                alt="flip-verticalIcon-icon"
                                onClick={() => setFlipY(!flipY)}
                            />
                        </div>
                    )}
                </div >
                <div className="file-control">
                    <div>
                        {!!cropStart && (
                            <div className="crop-button">
                                <Button
                                    style={{ backgroundColor: 'green' }}
                                    onClick={handleSaveCrop}
                                >
                                    Save Crop
                                </Button>
                                <Button
                                    style={{ backgroundColor: 'red' }}
                                    onClick={handleCancelCrop}
                                >Cancel</Button>
                            </div>
                        )}

                        <div className="file-item">
                            <ReactCrop
                                crop={crop}
                                onChange={(percentCrop) => setCrop(percentCrop)}
                                onComplete={(e) => setCompletedCrop(e)}
                                aspect={aspect}
                                className="image-container"
                                // style={{
                                //     transform: `rotate(${rotate}deg)`,
                                // }}
                                disabled={!cropStart}
                            >
                                {!!imageSrc && !croppedImage
                                    ? (
                                        <div>
                                            <img
                                                ref={imageRef}
                                                src={imageSrc.base64Code}
                                                alt={`Crop Image File ${data[1]}`}
                                                className="file-crop"
                                                style={{
                                                    width: 500,
                                                    transform: `scale(${scale}) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1}) translate(${offset.x}px, ${offset.y}px)`,
                                                    cursor: startDraw ? 'crosshair' : 'grab',
                                                }}
                                                onMouseDown={handleMouseDownZoom}
                                                onMouseMove={handleMouseMoveZoom}
                                                onMouseUp={handleMouseUpZoom}
                                                onMouseLeave={handleMouseUpZoom}
                                                draggable='false'
                                            />
                                            {startDraw && <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />}
                                        </div>
                                    )
                                    : (
                                        <img
                                            ref={imageRef}
                                            src={croppedImage}
                                            alt="Cropped"
                                            className="file-crop"
                                            style={{
                                                width: 500,
                                                transform: `scale(${scale}) rotate(${rotate}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1}) translate(${offset.x}px, ${offset.y}px)`,
                                                cursor: drag ? 'grabbing' : 'grab',
                                            }}
                                            onMouseDown={handleMouseDownZoom}
                                            onMouseMove={handleMouseMoveZoom}
                                            onMouseUp={handleMouseUpZoom}
                                            onMouseLeave={handleMouseUpZoom}
                                            draggable='false'
                                        />
                                    )
                                }
                            </ReactCrop>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default CropImageForm