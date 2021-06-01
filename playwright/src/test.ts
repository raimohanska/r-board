import { Browser, Page, chromium, webkit } from "playwright"

let chromiumBrowser: Browser
let webkitBrowser: Browser

const boardUrl = "http://localhost:1337/b/default"
const notePalette = `[data-test="palette-new-note"]`

beforeAll(async () => {
    chromiumBrowser = await chromium.launch({ headless: true })
    webkitBrowser = await webkit.launch({ headless: true })
})

afterAll(async () => {
    await chromiumBrowser.close()
    await webkitBrowser.close()
})

test("two anonymous users can see each other notes", async () => {
    const userPage = await navigateToBoard(chromiumBrowser)
    const anotherUserPage = await navigateToBoard(webkitBrowser)

    // create 2 notes, one on each page
    const userPageNoteText = `note-${semiUniqueId()}`
    await createNoteWithText(0, userPageNoteText, userPage)
    const anotherUserPageNoteText = `another-${semiUniqueId()}`
    await createNoteWithText(500, anotherUserPageNoteText, anotherUserPage)

    const note = await anotherUserPage.waitForSelector(`[data-test^="note"][data-test*="${userPageNoteText}"]`)
    const anotherNote = await userPage.waitForSelector(`[data-test^="note"][data-test*="${anotherUserPageNoteText}"]`)

    expect(note).not.toBeNull()
    expect(anotherNote).not.toBeNull()
})

const semiUniqueId = () => {
    const now = String(Date.now())
    return now.substring(now.length - 5)
}

const createNoteWithText = async (offset: number, text: string, page: Page) => {
    const container = (await page.$(`div [class="border-container"]`))!
    const { width, height } = (await container.boundingBox())!

    const note = (await page.$(notePalette))!

    await note.dispatchEvent("dragstart")
    await note.dispatchEvent("dragover")
    await page.mouse.move(width / 2 + offset, height / 2 + offset, { steps: 10 })
    await note.dispatchEvent("dragend")

    await note.dispatchEvent("select")
    await page.keyboard.type(`${text}`, { delay: 100 })
}

const navigateToBoard = async (browser: Browser): Promise<Page> => {
    const page = await browser.newPage()
    await page.goto(boardUrl)
    await page.waitForSelector(notePalette)
    return page
}
