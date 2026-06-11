const urlInput = document.querySelector('#url')
const labelInput = document.querySelector('#label')
const listEl = document.querySelector('#links')
const form = document.querySelector('#link-form')
const submitBtn = form.querySelector('button')

const favicon = (u) =>
    `https://www.google.com/s2/favicons?domain=${new URL(u).hostname}&sz=64`

let items = []
let editIndex = null

const resetForm = () => {
    form.reset()
    editIndex = null
    submitBtn.textContent = 'Добавить'
}

const save = async () => {
    await chrome.storage.sync.set({ items })
    render()
}

const btn = (text, title, onClick, disabled, className = '') => {
    const el = document.createElement('button')
    el.type = 'button'
    el.textContent = text
    el.title = title
    if (className) el.className = className
    if (disabled) el.disabled = true
    else el.addEventListener('click', onClick)
    return el
}

const template = (data, i) => {
    const item = document.createElement('li')
    const icon = document.createElement('img')
    icon.src = favicon(data.url)
    icon.alt = ''
    const anchor = document.createElement('a')
    anchor.href = data.url
    anchor.textContent = data.label?.trim() || data.url
    anchor.target = '_blank'

    const actions = document.createElement('div')
    actions.className = 'actions'
    actions.append(
        btn('↑', 'Выше', async () => {
            const j = i - 1
            ;[items[i], items[j]] = [items[j], items[i]]
            if (editIndex === i) editIndex = j
            else if (editIndex === j) editIndex = i
            await save()
        }, i === 0),
        btn('↓', 'Ниже', async () => {
            const j = i + 1
            ;[items[i], items[j]] = [items[j], items[i]]
            if (editIndex === i) editIndex = j
            else if (editIndex === j) editIndex = i
            await save()
        }, i === items.length - 1),
        btn('✎', 'Изменить', () => {
            if (editIndex === i) {
                resetForm()
                return
            }
            editIndex = i
            urlInput.value = data.url
            labelInput.value = data.label || ''
            submitBtn.textContent = 'Сохранить'
            urlInput.focus()
        }),
        btn('✕', 'Удалить', async () => {
            if (editIndex === i) resetForm()
            else if (editIndex > i) editIndex--
            items = items.filter((_, idx) => idx !== i)
            await save()
        }, false, 'remove')
    )

    item.append(icon, anchor, actions)
    if (editIndex === i) item.classList.add('editing')
    return item
}

const render = () => {
    listEl.innerHTML = ''
    items.forEach((data, i) => listEl.append(template(data, i)))
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
    if (editIndex !== null) {
        items[editIndex] = { url, label }
        resetForm()
    } else {
        items = [{ url, label }, ...items.filter((entry) => entry.url !== url)]
        form.reset()
    }
    await save()
    urlInput.focus()
})

const normalize = (data) => {
    const list = Array.isArray(data) ? data : data?.items
    if (!Array.isArray(list)) return null
    return list
        .map((e) => ({
            url: String(e?.url || '').trim(),
            label: String(e?.label || '').trim(),
        }))
        .filter((e) => e.url)
}

document.querySelector('#export').addEventListener('click', () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(
        new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
    )
    a.download = 'quick-pins.json'
    a.click()
    URL.revokeObjectURL(a.href)
})

const importFile = document.querySelector('#import-file')
document.querySelector('#import').addEventListener('click', () => importFile.click())
importFile.addEventListener('change', async () => {
    const file = importFile.files?.[0]
    importFile.value = ''
    if (!file) return
    try {
        const list = normalize(JSON.parse(await file.text()))
        if (!list?.length) return
        if (items.length && !confirm('Заменить текущие pins?')) return
        resetForm()
        items = list
        await save()
    } catch {}
})

init()
