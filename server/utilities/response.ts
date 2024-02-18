const response = {
    "OK": (data) => {
        return {
            error_status: false,
            status: 200,
            data,
            message: "DATA RETURNED SUCCESSFULLY"
        }
    },
    "CREATED": {
        error_status: false,
        status: 201,
        message: "DATA CREATED SUCCESSFULLY"
    },
    "UNABLE_TO_PROCESS": {
        error_status: true,
        status: 400,
        message: "UNABLE TO PROCESS THE REQUEST"
    },
    "UN_AUTHORIZED": {
        error_status: true,
        status: 401,
        message: "UNAUTHORIZED"
    },
    "NOT_FOUND": {
        error_status: true,
        status: 404,
        message: "DATA NOT FOUND"
    },
    "MISSING": {
        error_status: true,
        status: 422,
        message: "SOME PARAMETERS ARE MISSING"
    },
    "SYSTEM_ERROR": {
        error_status: true,
        status: 501,
        message: "SOMETHING WENT WRONG. PLEASE REACH OUT SYS ADMIN"
    }
}

export default response;