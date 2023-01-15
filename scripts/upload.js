function bytesToSize(bytes) {
    const size = ['Bytes','KB','MB','GB','TB']
    if(!bytes) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes)/Math.log(1024)))
    return Math.round(bytes/Math.pow(1024,i))+ size[i]
}

const element = (tag, classes = [], content) => {
    const node = document.createElement(tag)

    if (classes.length){
        node.classList.add(...classes)
    }
    if (content){
        node.textContent = content
    }
    return node
}

function noop () {}

export function upload(selector, options = {}){
    let files = []
    const onUpload = options.onUpload ?? noop
    const input = document.querySelector(selector)
    const preview = element('div', ['preview'])
    const open = element('button', ['btn'],'Открыть')
    const upload = element('button', ['btn','primary'],'Загрузить')
    const message = element('div', ['alert-text'], 'Выберите изображение')
    upload.style.display = 'none'

    if (options.multi){
        input.setAttribute('multiple', true)
    }
    if (options.accept && Array.isArray(options.accept)){
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', upload)
    input.insertAdjacentElement('afterend', open)
    input.insertAdjacentElement('afterend', message)
    const triggerInput = () => input.click()

    const changeHandler = event => {
        console.log(event.target.files.length)
        if(!event.target.files.length){
            return
        }
        files = Array.from(event.target.files)
        //preview.innerHTML = '' очищать список добавленных картинок при добавлении новой картинки
        upload.style.display = 'inline'
        files.forEach(file =>{
           if(!file.type.match('image')){
            return
           }
            document.querySelector('.alert-text').style.display = 'none'
           const reader = new FileReader()

           reader.onload = ev => {
            const src = ev.target.result
           preview.insertAdjacentHTML("afterbegin", `
            <div class="preview-image">
            <div class="preview-remove" data-name="${file.name}">&times;</div>
            <img src="${src}" alt="${file.name}" />
            <div class="wrap-preview"><span>${file.name}</span></div>            
            <div class="preview-info">            
            ${bytesToSize(file.size)}
            </div>
            </div>
           `)
           }

           reader.readAsDataURL(file)

        })
    }

    const removeHandler = event =>{
       if (!event.target.dataset) {
        return
       }
       const {name} = event.target.dataset
       files = files.filter(file => file.name !== name)
        console.log(files.length);
        if (!files.length){
        upload.style.display = 'none'
            message.style.display = 'block'
       }

       const block = preview
       .querySelector(`[data-name="${name}"]`)
       .closest('.preview-image')

       block.classList.add('removing')
       setTimeout(()=>  block.remove(), 300)

    }
    const clearPreview = el => {
        el.style.bottom = '10%'
        el.innerHTML = '<div class="preview-info-progress"></div>'
        
    }
    const uploadHandler = () => {
        // preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)
        onUpload(files, previewInfo)       
    }

    open.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)

}