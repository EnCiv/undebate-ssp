// https://github.com/EnCiv/undebate-ssp/issues/22

import { createUseStyles } from "react-jss"
import UndebateLogoSVG from "../svgr/undebate-logo"
import MagnifyingGlassSVG from "../svgr/magnifying-glass"
import OpenBookSVG from "../svgr/open-book"
import ExampleUserSVG from "../svgr/example-user"
import LogOutSVG from "../svgr/log-out"

const UndebatesHeaderBar = props => {
    const { className, style, userId } = props
    const classes = useStyles()
    return (
        <div className={classes.undebatesHeader}>
            <UndebateLogoSVG className={classes.logo} />
            <div className={classes.buttonGroup}>
                <button className={classes.svgButton}>
                    <MagnifyingGlassSVG className={classes.svg} />
                </button>
                <button className={classes.svgButton}>
                    <OpenBookSVG className={classes.svg} />
                </button>
                <button className={classes.button}>Create New</button>
                <div className={classes.userImageGroup}>
                    <div className={classes.hidden}>
                        <span className={classes.userId}>{userId}</span>
                        <button className={classes.logoutButton}>
                            <LogOutSVG className={classes.svg} />
                            LOGOUT
                        </button>
                    </div>
                    <ExampleUserSVG className={classes.userImage} />
                </div>
            </div>
        </div>
    )
}

export default UndebatesHeaderBar

const useStyles = createUseStyles({
    undebatesHeader: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "2.5rem",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-around",
        gap: "2rem",
        alignItems: "center",
    },
    svgButton: {
        background: "transparent",
        border: "none",
        padding: "0",
    },
    svg: {
        width: "1.25rem",
        height: "1.25rem",
    },
    logo: {
        height: "2.75rem",
        width: "12.5rem",
        marginRight: "auto",
    },
    button: {
        borderRadius: "2rem",
        border: "none",
        background: "linear-gradient(0deg, #7470FF,#7470FF), #FFFFFF",
        padding: "1rem 2.75rem",
        whiteSpace: "nowrap",
        color: "#FFFFFF",
    },
    userImageGroup: {
        display: "flex",
        alignItems: "center",
        height: "3.25rem",
        border: "none",
        borderRadius: "2rem",
        background: "linear-gradient(0deg, #7470FF,#7470FF), #FFFFFF",
        width: "auto",
        "&:hover": {
            "& > $hidden": {
                width: "17rem",
            },
        },
    },
    hidden: {
        transition: "width 0.5s",
        display: "flex",
        overflow: "hidden",
        width: "0",
        alignItems: "center",
        justifyContent: "space-between",
    },
    logoutButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "none",
        background: "transparent",
        padding: "1rem",
        whiteSpace: "nowrap",
        color: "#FFFFFF",
    },
    userId: {
        opacity: "0.7",
        color: "#FFFFFF",
        marginLeft: "1rem",
    },
    userImage: {
        height: "3.25rem",
        width: "3.25rem",
    },
    "@media screen and (max-width: 840px)": {
        undebatesHeader: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
        logo: {
            marginRight: "0",
            width: "100rem",
        },
        buttonGroup: {
            flexDirection: "column",
        },
    },
})
