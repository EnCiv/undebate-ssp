"use strict"

import { createUseStyles } from "react-jss"
import cx from "classnames"

import DefaultUserSVG from "../svgr/default-user"

const UserImage = props => {
    const { className, style } = props
    const classes = useStyles()

    return (
        <div className={cx(className, classes.background)} style={style}>
            <DefaultUserSVG className={classes.userImage} />
        </div>
    )
}

const useStyles = createUseStyles({
    userImage: {
        height: "70%",
        width: "70%",
    },
    background: {
        background: "white",
        borderRadius: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "3.25rem",
        width: "3.25rem",
    },
})

export default UserImage
