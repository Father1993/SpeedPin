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

let cachedItems = []
let loadingItems = null

const loadItems = async () => {
    const [{ items: sync }, { items: local }] = await Promise.all([
        chrome.storage.sync.get('items'),
        chrome.storage.local.get('items'),
    ])
    cachedItems =
        [normalize(sync), normalize(local)]
            .filter((list) => list?.length)
            .sort((a, b) => b.length - a.length)[0] ?? []
    return cachedItems
}

const refreshItems = () => {
    loadingItems = loadItems().catch(() => cachedItems)
    return loadingItems
}

refreshItems()

chrome.runtime.onInstalled.addListener(refreshItems)
chrome.runtime.onStartup.addListener(refreshItems)

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (changes.items && (areaName === 'sync' || areaName === 'local')) refreshItems()
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== 'getItems') return false

    ;(loadingItems || refreshItems()).then((items) => {
        sendResponse({ items })
    })
    return true
})
