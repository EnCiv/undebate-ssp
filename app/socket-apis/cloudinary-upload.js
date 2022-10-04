import cloudinary from 'cloudinary'

export default async function cloudinaryUpload(file, cb) {
    if (!this.synuser || !this.synuser.id) {
        logger.error('cloudinaryUpload called but no user logged in')
        return cb && cb() // no user
    }
    try {
        const options = {
            context: {
                user: this.synuser.id,
            },
        }
        const result = await cloudinary.v2.uploader.upload(file, options)
        cb({ url: result.secure_url })
    } catch (error) {
        cb({ error: error })
    }
}
