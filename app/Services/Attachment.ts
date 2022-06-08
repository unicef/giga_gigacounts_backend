import Attachment from 'App/Models/Attachment'

import storage from 'App/Services/Storage'

const uploadAttachment = async (file: string): Promise<Attachment> => {
  try {
    const fileUrl = await storage.uploadFile(file)
    const attachment = await Attachment.create({ url: fileUrl })
    return attachment
  } catch (error) {
    throw error
  }
}

export default {
  uploadAttachment,
}
