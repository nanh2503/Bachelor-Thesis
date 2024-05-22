export const base64ToFileImage = (base64String: string) => {
    // Loại bỏ tiền tố 'data:image/jpeg;base64,' hoặc 'data:image/png;base64,'
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')

    // Chuyển đổi chuỗi base64 thành Buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Tạo đối tượng File từ Buffer
    return new File([buffer], `image_${Date.now()}.png`, { type: "image/png" });
};

export const base64ToFileVideo = (base64String: string) => {
    const base64Data = base64String.replace(/^data:video\/\w+;base64,/, '');

    const buffer = Buffer.from(base64Data, 'base64');

    return new File([buffer], `video_${Date.now()}.mp4`, { type: "video/mp4" });
};