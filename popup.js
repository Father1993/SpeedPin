const urlInput = document.querySelector('#url')
const labelInput = document.querySelector('#label')
const listEl = document.querySelector('#links')
const form = document.querySelector('#link-form')

const favicon = (u) =>
    `https://www.google.com/s2/favicons?domain=${new URL(u).hostname}&sz=64`
const template = ({ url, label }) => {
    const item = document.createElement('li')
    const icon = document.createElement('img')
    icon.src = favicon(url)
    icon.alt = ''
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.textContent = label?.trim() || url
    anchor.target = '_blank'
    const remove = document.createElement('button')
    remove.textContent = '✕'
    remove.title = 'Удалить'
    remove.addEventListener('click', async () => {
        items = items.filter((entry) => entry.url !== url)
        await chrome.storage.sync.set({ items })
        item.remove()
    })
    item.append(icon, anchor, remove)
    return item
}

let items = []
const render = () => {
    listEl.innerHTML = ''
    items.forEach((data) => listEl.append(template(data)))
}

const init = async () => {
    const { items: stored = [] } = await chrome.storage.sync.get('items')
    items = stored
    render()
}

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const url = urlInput.value.trim()
    if (!url) return
    const label = labelInput.value.trim()
    items = [{ url, label }, ...items.filter((entry) => entry.url !== url)]
    await chrome.storage.sync.set({ items })
    render()
    form.reset()
    urlInput.focus()
})

init()
