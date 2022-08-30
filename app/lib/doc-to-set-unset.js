// converts an object, where keys with the value undefined are turned into unsets for use in MongoDB

import { merge } from 'lodash'

function lp(path) {
    return path ? path + '.' : ''
}
export default function objToSetUnset(obj, $set = {}, $unset = {}, path = '') {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !(obj[key] instanceof Iota.ObjectID) && !(obj[key] instanceof Date)) {
            objToSetUnset(obj[key], $set, $unset, lp(path) + key)
        } else if (typeof obj[key] === 'function') return
        //just skip functions
        else if (typeof obj[key] === 'undefined') {
            $unset[lp(path) + key] = ''
        } else $set[lp(path) + key] = obj[key]
    })
    return { $set, $unset }
}

export function applySetUnset(obj, setUnset) {
    merge(obj, setUnset.$set)
    applyUnset(obj, setUnset.$unset)
    return obj
}

function applyUnset(obj, $unset) {
    Object.keys($unset).forEach(key => {
        if (typeof $unset[key] === 'object') {
            if (typeof obj[key] === 'object') applyUnset(obj[key], $unset[key])
            else return // no need to unset something that's not there
        } else delete obj[key]
    })
}
