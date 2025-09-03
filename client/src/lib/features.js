import moment from "moment"


const fileFormat = (url = '') => {

    const fileExt = url.split('.').pop()
    if (fileExt === 'mp4' || fileExt === 'webm' || fileExt === 'ogg')
        return 'video'

    if (fileExt === 'mp3' || fileExt === 'wav' || fileExt === 'ogg')
        return 'audio'

    if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png' || fileExt === 'gif' || fileExt === 'bmp' || fileExt === 'svg')
        return 'image'


    return 'file'
}

const transformImage = (url = '', width = 100) => url

const getLast7Days = () => {
    const currentDate = moment()

    const last7Days = []

    for (let i = 0; i < 7; i++) {
        const dayDate = currentDate.clone().subtract(i, 'days')
        const dayName = dayDate.format('dddd')

        last7Days.unshift(dayName)
    }
    return last7Days.reverse()
}

export { fileFormat, transformImage, getLast7Days }