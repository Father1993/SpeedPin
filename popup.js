const elements = {
    url: document.querySelector('#url'),
    label: document.querySelector('#label'),
    list: document.querySelector('#links'),
    form: document.querySelector('#link-form'),
}

const storage = {
    async get() {
        const { items = [] } = await chrome.storage.sync.get('items')
        return items
    },
    async set(items) {
        await chrome.storage.sync.set({ items })
    },
}

const favicon = (url) =>
    `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`

const createItem = ({ url, label }, onRemove) => {
    const item = document.createElement('li')
    item.innerHTML = `
        <img src="${favicon(url)}" alt="">
        <a href="${url}" target="_blank">${label?.trim() || url}</a>
        <button title="Удалить">✕</button>
    `
    item.querySelector('button').addEventListener('click', onRemove)
    return item
}

const render = (items) => {
    elements.list.innerHTML = ''
    items.forEach((data) => {
        const onRemove = async () => {
            const updated = items.filter((entry) => entry.url !== data.url)
            await storage.set(updated)
            render(updated)
        }
        elements.list.append(createItem(data, onRemove))
    })
}

elements.form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const url = elements.url.value.trim()
    if (!url) return

    const items = await storage.get()
    const updated = [
        { url, label: elements.label.value.trim() },
        ...items.filter((entry) => entry.url !== url),
    ]
    await storage.set(updated)
    render(updated)
    elements.form.reset()
    elements.url.focus()
})

storage.get().then(render)
