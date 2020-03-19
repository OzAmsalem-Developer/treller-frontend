export const cloudinaryService = {
    uploadImg
}
function uploadImg(ev) {
    const CLOUD_NAME = "ramus"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const formData = new FormData();
    formData.append('file', ev.target.files[0])
    formData.append('upload_preset', 'nhn1typb'); // second parameter is the upload preset
    return fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            return res.url
        })
        .catch(err => console.error(err))
}