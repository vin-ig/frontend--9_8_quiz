function checkUserData() {
    const url = new URL(location.href)
    const name = url.searchParams.get('name')
    const lastName = url.searchParams.get('lastName')
    const email = url.searchParams.get('email')

    if (!name || !lastName || !email) {
        location.href = 'index.html'
    }
}

function checkSessionUserData() {
    try {
        const userData = JSON.parse(sessionStorage.getItem('userInfo'))
        if (!userData.name || !userData.lastName || !userData.email) {
            throw new Error()
        }
    } catch {
        location.href = 'index.html'
    }
}

function getParsedResponse(url) {
    return null  // STUB
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.send()

    if (xhr.status === 200 && xhr.responseText) {
        try {
            return JSON.parse(xhr.responseText)
        } catch (e) {
            return null
        }
    } else {
        return null
    }
}