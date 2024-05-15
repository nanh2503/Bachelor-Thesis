import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import { useSelector } from "src/app/hooks";
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
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [imageSrc, setImageSrc] = useState<string>("")
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(undefined)
    const [flipX, setFlipX] = useState(false);
    const [flipY, setFlipY] = useState(false);

    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [cropStart, setCropStart] = useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = useState("");

    const [drag, setDrag] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const [startDraw, setStartDraw] = useState(false);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

    useEffect(() => {
        const getFile = () => {
            fileList.map((file) => {
                if (data[0] === 'image' && file.images.some((image) => image._id === data[1])) {
                    file.images.map((image) => {
                        if (image._id === data[1]) {
                            setImageSrc(image.base64Code);
                        }
                    })
                }
            })
        }

        getFile()
    }, [data])

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;

        const canvasFabric = new fabric.Canvas(canvasElement);
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const scaleFactor = 500 / image.width;
            const width = 500;
            const height = image.height * scaleFactor;
            canvasFabric.setDimensions({ width: width, height: height });
            canvasFabric.setBackgroundImage(imageSrc, canvasFabric.renderAll.bind(canvasFabric), {
                scaleX: scaleFactor,
                scaleY: scaleFactor
            });
        };

        canvasFabric.isDrawingMode = true;

        canvasFabric.freeDrawingBrush.color = 'red';
        canvasFabric.freeDrawingBrush.width = 10;

        setCanvas(canvasFabric);

        return () => {
            canvasFabric.dispose();
        };
    }, [imageSrc]);

    useEffect(() => {
        if (startDraw && canvasRef.current) {
            const imageUrl = croppedImageUrl || imageSrc;

            if (imageUrl) {
                fabric.Image.fromURL(imageUrl, (img) => {
                    if (img.width && img.height) {
                        // Calculate aspect ratio
                        const aspectRatio = img.height / img.width;
                        const canvasWidth = 500;
                        const canvasHeight = canvasWidth * aspectRatio;

                        // Resize canvas to desired dimensions
                        canvas?.setWidth(canvasWidth);
                        canvas?.setHeight(canvasHeight);

                        // Set background image
                        canvas?.setBackgroundImage(img, canvas?.renderAll.bind(canvas), {
                            scaleX: canvasWidth / img.width,
                            scaleY: canvasHeight / img.height,
                        });

                        canvas?.renderAll();
                    }
                });
            }
        }
    }, [startDraw]);

    const saveDrawImage = () => {
        if (!!canvas && !canvas.isDrawingMode && canvasRef.current) {
            const canvasElement = canvasRef.current;

            // Tạo một canvas mới để vẽ các nét vẽ
            const drawingCanvas = document.createElement('canvas');
            drawingCanvas.width = canvasElement.width;
            drawingCanvas.height = canvasElement.height;
            const ctx = drawingCanvas.getContext('2d');

            // Vẽ ảnh gốc lên canvas mới
            const image = new Image();
            image.src = canvasElement.toDataURL();
            image.onload = () => {
                ctx?.drawImage(image, 0, 0, drawingCanvas.width, drawingCanvas.height);

                // Kết hợp canvas mới (bao gồm ảnh và các nét vẽ) với canvas ban đầu
                canvas.clear();
                canvas.setBackgroundImage(drawingCanvas.toDataURL(), canvas.renderAll.bind(canvas));
                setCroppedImageUrl(drawingCanvas.toDataURL());
            };
        }
    }

    const handleDrawImage = () => {
        setCropStart(false);
        setStartDraw(!startDraw);
        if (!!canvas) {
            canvas.isDrawingMode = !startDraw;

            if (!canvas.isDrawingMode) {
                saveDrawImage()
            }
        }
    };

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
        setStartDraw(false);
        if (!!canvas) {
            canvas.isDrawingMode = false;
            saveDrawImage();
        }

        setCropStart(true);
        setAspect(16 / 9)

        if (canvasRef.current) {
            const { width, height } = canvasRef.current;
            const newCrop = centerAspectCrop(width, height, 16 / 9);
            setAspect(undefined);
            setCrop(newCrop);
        }
    }

    const handleSaveCrop = () => {
        if (completedCrop && canvasRef.current && !!canvas) {
            const canvasElement = canvasRef.current;
            const { x, y, width, height } = completedCrop;

            // Create a temporary image to draw the cropped area
            const image = new Image();
            image.src = canvasElement.toDataURL();

            image.onload = () => {
                const scaleX = image.naturalWidth / canvasElement.width;
                const scaleY = image.naturalHeight / canvasElement.height;

                const croppedWidth = width * scaleX;
                const croppedHeight = height * scaleY;

                // Define the target width and calculate the target height to maintain aspect ratio
                const targetWidth = 500;
                const targetHeight = (croppedHeight / croppedWidth) * targetWidth;

                const croppedCanvas = document.createElement('canvas');
                croppedCanvas.width = targetWidth;
                croppedCanvas.height = targetHeight;
                const croppedCtx = croppedCanvas.getContext('2d');

                croppedCtx?.drawImage(
                    image,
                    x * scaleX,
                    y * scaleY,
                    croppedWidth,
                    croppedHeight,
                    0,
                    0,
                    targetWidth,
                    targetHeight
                );

                const base64Image = croppedCanvas.toDataURL();
                fabric.Image.fromURL(base64Image, (img) => {
                    if (img.width && img.height) {
                        canvas.clear();
                        canvas.setDimensions({ width: targetWidth, height: targetHeight });
                        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                        canvas.renderAll();
                    }
                });

                setCroppedImageUrl(base64Image)
                setCrop(undefined);
                setCropStart(false);
            }
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
        if (drag && canvasRef.current) {
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
                                onClick={handleDrawImage}
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
                                style={{
                                    transform: `rotate(${rotate}deg)`,
                                }}
                                disabled={!cropStart}
                            >
                                <canvas
                                    ref={canvasRef}
                                    id="canvas"
                                    className="file-crop"
                                    style={{
                                        transform: `scale(${scale}) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1}) translate(${offset.x}px, ${offset.y}px)`,
                                        cursor: drag ? 'grab' : 'pointer',
                                    }}
                                    onMouseDown={handleMouseDownZoom}
                                    onMouseMove={handleMouseMoveZoom}
                                    onMouseUp={handleMouseUpZoom}
                                    onMouseLeave={handleMouseUpZoom}
                                    draggable='false'
                                />
                            </ReactCrop>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default CropImageForm