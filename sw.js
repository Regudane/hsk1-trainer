// HSK 1 Trainer phone app: keeps the app's own files on the phone (scripts/phone/build.ts writes
// this file). The recordings are kept by the app itself as they're used; Microsoft's sign-in and
// OneDrive always go to the network and are never kept here.
const VERSION = 'hsk1-shell-ab4f5c4cbd'
const SHELL = ["./","assets/phone-B7IrKebw.js","assets/phone-HovWmPZQ.css","assets/phone-app-CJvE-l51.js","assets/phone-app-PYXEjlOI.css","audio/index.json","content/bootcamp.json","content/characters.json","content/dialogues.json","content/exam-lines.json","content/exams.json","content/grammar.json","content/lessons.json","content/near-synonyms.json","content/notes.json","content/phrases.json","content/sentences.json","content/sounds.json","content/speech-check.json","content/stories.json","content/story-lines.json","content/syllables.json","content/tone-check.json","content/units.json","content/words.json","fonts/LXGWWenKai.woff2","fonts/NotoSansSC.woff2","hanzi.json","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","index.html","manifest.webmanifest"]

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))))
})
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('hsk1-shell-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})
self.addEventListener('message', (e) => {
  if (e.data === 'skip') self.skipWaiting()
})
self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('index.html').then((r) => r || fetch(req)))
    return
  }
  if (url.pathname.includes('/audio/') && url.pathname.endsWith('.mp3')) return
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req)))
})
