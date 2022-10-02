import cloudinary from 'cloudinary'

export default async function cloudinaryUpload(file, cb) {
    try {
        const result = await cloudinary.v2.uploader.upload(file)
        cb({ url: result.secure_url })
    } catch (error) {
        cb({ error: error })
    }
}
