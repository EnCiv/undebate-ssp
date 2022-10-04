import cloudinary from 'cloudinary'

export default async function cloudinaryUpload(file, cb) {
    if (!this.synuser || !this.synuser.id) {
        logger.error('cloudinaryUpload called but no user logged in')
        return cb && cb() // no user
    }
    try {
        const result = await cloudinary.v2.uploader.upload(file)
        cb({ url: result.secure_url })
    } catch (error) {
        cb({ error: error })
    }
}
