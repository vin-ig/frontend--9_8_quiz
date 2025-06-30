export class UlrManager {
    static checkSessionUserData() {
        try {
            const userData = JSON.parse(sessionStorage.getItem('userInfo'))
            if (!userData.name || !userData.lastName || !userData.email) {
                throw new Error()
            }
        } catch {
            location.href = '#/'
        }
    }

    static getParsedResponse(url) {
        // return null  // STUB
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
}
