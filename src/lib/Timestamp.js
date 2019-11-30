import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const fromNow = (date, format) => dayjs(date).fromNow()

export default {
  fromNow
}