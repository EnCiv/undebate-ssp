import cloudinary from 'cloudinary'

export default async function cloudinaryUpload(data, cb) {
    if (!this.synuser || !this.synuser.id) {
        logger.error('cloudinaryUpload called but no user logged in')
        return cb && cb() // no user
    }
    try {
        const options = {
            public_id: `${this.synuser.id}-${data.type}`,
            context: {
                user: this.synuser.id,
                type: data.type,
            },
        }
        const result = await cloudinary.v2.uploader.upload(data.file, options)
        cb({ url: result.secure_url })
    } catch (error) {
        cb({ error: error })
    }
}
