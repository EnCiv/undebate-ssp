export default function scheme() {
    return (process.env.HOSTNAME || '').startsWith('localhost')
        ? 'http://'
        : /^([a-z][a-z0-9+\-.]*):\/\//i.test(process.env.HOSTNAME || '')
        ? ''
        : 'https://'
}
