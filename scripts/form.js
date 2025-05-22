(function () {
    const Form = {
        agreeElement: null,
        processElement: null,
        fields: [
            {
                name: 'name',
                id: 'name',
                element: null,
                regex: /^[А-ЯA-Z][а-яa-z]+\s*$/,
                valid: false,
            },
            {
                name: 'lastName',
                id: 'last-name',
                element: null,
                regex: /^[А-ЯA-Z][а-яa-z]+\s*$/,
                valid: false,
            },
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
        ],
        init() {
            const that = this
            this.fields.forEach(item => {
                item.element = document.getElementById(item.id)
                item.element.onchange = function () {
                    that.validateField.call(that, item, this)
                    that.validateForm()
                }
            })
            this.agreeElement = document.getElementById('agree')
            this.agreeElement.onchange = function () {
                that.validateForm()
            }
            this.processElement = document.getElementById('process')
            this.processElement.onclick = function () {
                that.processForm()
            }
        },
        validateField(field, element) {
            if (!element.value || !element.value.match(field.regex)) {
                element.parentNode.style.borderColor = 'red'
                field.valid = false
            } else {
                element.parentNode.removeAttribute('style')
                field.valid = true
            }
        },
        validateForm() {
            const validForm = this.fields.every(item => item.valid)
            const isValid = this.agreeElement.checked && validForm
            if (isValid) {
                this.processElement.removeAttribute('disabled')
            } else {
                this.processElement.setAttribute('disabled', 'disabled')
            }
            return isValid
        },
        processForm() {
            if (this.validateForm()) {
                const userInfo = Object.fromEntries(
                    this.fields.map(field => [field.name, field.element.value])
                )
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
                location.href = 'choice.html'
            }
        }
    }

    Form.init()
})()