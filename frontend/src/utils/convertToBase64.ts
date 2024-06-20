import axios from "axios";

export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const convertURLCloudToBase64 = async (url: string): Promise<string> => {
    try {
        // Download image from URL
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Convert image data to buffer
        const buffer = Buffer.from(response.data, 'binary');

        // Convert buffer to base64 string
        const base64 = buffer.toString('base64');

        // Generate full base64 string with prefix
        const mimeType = response.headers['content-type'];
        const base64Image = `data:${mimeType};base64,${base64}`;

        return base64Image;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Unable to convert URL to base64: ${error.message}`);
        } else {
            throw new Error('Failed to convert URL to base64: Unknown error');
        }
    }
}
