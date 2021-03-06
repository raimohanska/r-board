import _ from "lodash"
import * as L from "lonna"
import * as uuid from "uuid"
import {
    Board,
    Item,
    Connection,
    Id,
    Point,
    findItemsRecursively,
    newNote,
    newText,
    ConnectionEndPoint,
    BOARD_ITEM_BORDER_MARGIN,
} from "../../../common/src/domain"
import { BoardCoordinateHelper } from "./board-coordinates"
import { BoardFocus, getSelectedIds } from "./board-focus"
import { Dispatch } from "../store/board-store"
import { YELLOW } from "../../../common/src/colors"
import { sanitizeHTML } from "../components/sanitizeHTML"
import * as G from "./geometry"

const CLIPBOARD_EVENTS = ["cut", "copy", "paste"] as const

export type ItemsAndConnections = {
    items: Item[]
    connections: Connection[]
}

export function findSelectedItems(currentFocus: BoardFocus, currentBoard: Board): ItemsAndConnections {
    const selectedIds = getSelectedIds(currentFocus)
    const items = findItemsRecursively([...selectedIds], currentBoard)
    const recursiveIds = new Set(items.map((i) => i.id))
    const connections = currentBoard.connections.filter((c) => {
        // Include connections between these items and connections that have one end
        // in these items and the other end not connected.
        const ids = connectedIds(c)
        return ids.length > 0 && !ids.some((id) => !recursiveIds.has(id))
    })
    return { items, connections }
}

function connectedIds(connection: Connection) {
    const endpoints = [connection.to, connection.from]
    return endpoints.flatMap((ep) => (typeof ep === "string" ? [ep] : []))
}

export function makeCopies(
    itemsAndConnections: ItemsAndConnections,
    xDiff: number,
    yDiff: number,
): { toCreate: Item[]; toSelect: Item[]; connections: Connection[] } {
    const items = itemsAndConnections.items
    const containerIds = items.map((i) => i.id)
    const contained = items.filter((i) => !!i.containerId && containerIds.includes(i.containerId))
    const notContained = items.filter((i) => !contained.some((c) => c.id === i.id))
    const oldToNewId: Record<Id, Id> = {}
    let toCreate: Item[] = []
    // As a side effect makeCopy adds items to toCreate
    const toSelect = notContained.map(makeCopy)
    const connections = itemsAndConnections.connections.map((c) => {
        return {
            ...c,
            from: translateEndpoint(c.from),
            to: translateEndpoint(c.to),
            controlPoints: c.controlPoints.map(translateEndpoint) as Point[],
            id: uuid.v4(),
        }
    })

    return { toCreate, toSelect, connections }

    function translateEndpoint(endPoint: ConnectionEndPoint) {
        if (typeof endPoint === "string") {
            const newId = oldToNewId[endPoint]
            if (!newId) {
                console.warn(`Target item ${endPoint} not found from pasted contents, assuming it exists on board`)
                return endPoint
            }
            return newId
        } else {
            return G.add(endPoint, { x: xDiff, y: yDiff })
        }
    }

    function makeCopy(i: Item): Item {
        const containerId = i.id
        const newContainer = flatCopy(i)
        toCreate.push(newContainer)
        // TODO: this won't work for deep containment hierarchies
        contained
            .filter((ctd) => ctd.containerId === containerId)
            .forEach((ctd) => {
                toCreate.push(makeCopy({ ...ctd, containerId: newContainer.id }))
            })
        return newContainer
    }

    function flatCopy(i: Item) {
        const newId = uuid.v4()
        oldToNewId[i.id] = newId
        return { ...i, id: newId, x: i.x + xDiff, y: i.y + yDiff }
    }
}

export function cutCopyPasteHandler(
    board: L.Property<Board>,
    focus: L.Atom<BoardFocus>,
    coordinateHelper: BoardCoordinateHelper,
    dispatch: Dispatch,
    uploadImageFile: (file: File) => Promise<void>,
) {
    const clipboardEventHandler = (e: ClipboardEvent) => {
        const currentFocus = focus.get()
        const currentBoard = board.get()
        switch (e.type) {
            case "cut": {
                if (currentFocus.status !== "selected" || currentFocus.ids.size === 0) return
                const clipboard = findSelectedItems(currentFocus, currentBoard)
                dispatch({ action: "item.delete", boardId: currentBoard.id, itemIds: clipboard.items.map((i) => i.id) })
                e.clipboardData!.setData("application/rboard", JSON.stringify(clipboard))
                e.preventDefault()
                break
            }
            case "copy": {
                if (currentFocus.status !== "selected") return
                const clipboard = findSelectedItems(currentFocus, currentBoard)
                e.clipboardData!.setData("application/rboard", JSON.stringify(clipboard))
                e.preventDefault()
                break
            }
            case "paste": {
                if (e.clipboardData) {
                    const imageFile = [...e.clipboardData.files].find((file) => file.type.startsWith("image/"))
                    if (imageFile) {
                        uploadImageFile(imageFile)
                        return
                    }
                }
                if (currentFocus.status === "editing") return
                const rboardData = e.clipboardData?.getData("application/rboard")
                if (!rboardData) {
                    const html = e.clipboardData?.getData("text/html") || e.clipboardData?.getData("text/plain")
                    if (html) {
                        const sanitized = sanitizeHTML(html)
                        const currentCenter = coordinateHelper.currentBoardCoordinates.get()
                        let toCreate
                        if (sanitized.length > 50) {
                            toCreate = [newText(sanitized, currentCenter.x, currentCenter.y)]
                        } else {
                            toCreate = [newNote(sanitized, YELLOW, currentCenter.x, currentCenter.y)]
                        }
                        dispatch({ action: "item.add", boardId: currentBoard.id, items: toCreate })
                    } else if (e.clipboardData) {
                        console.log(
                            "Unsupported data from clipboard.",
                            Object.fromEntries(e.clipboardData.types.map((t) => [t, e.clipboardData?.getData(t)])),
                        )
                    }
                } else {
                    const clipboard = JSON.parse(rboardData) as ItemsAndConnections
                    if (!("items" in clipboard)) {
                        console.warn("Unexpected clipboard content", clipboard)
                        return
                    }
                    const requiredMargin = BOARD_ITEM_BORDER_MARGIN
                    const xDiffMin = -_.min(clipboard.items.map((i) => i.x))! + requiredMargin
                    const yDiffMin = -_.min(clipboard.items.map((i) => i.y))! + requiredMargin
                    const xDiffMax =
                        board.get().width - _.max(clipboard.items.map((i) => i.x + i.width))! - requiredMargin
                    const yDiffMax =
                        board.get().height - _.max(clipboard.items.map((i) => i.y + i.height))! - requiredMargin
                    const xCenterOld = _.sum(clipboard.items.map((i) => i.x + i.width / 2)) / clipboard.items.length
                    const yCenterOld = _.sum(clipboard.items.map((i) => i.y + i.height / 2)) / clipboard.items.length
                    const currentCenter = coordinateHelper.currentBoardCoordinates.get()

                    const xDiff = Math.min(Math.max(currentCenter.x - xCenterOld, xDiffMin), xDiffMax)
                    const yDiff = Math.min(Math.max(currentCenter.y - yCenterOld, yDiffMin), yDiffMax)
                    const { toCreate, toSelect, connections } = makeCopies(clipboard, xDiff, yDiff)
                    dispatch({ action: "item.add", boardId: currentBoard.id, items: toCreate, connections })
                    focus.set({ status: "selected", ids: new Set(toSelect.map((it) => it.id)) })
                    e.preventDefault()
                }
                break
            }
        }
    }

    CLIPBOARD_EVENTS.forEach((eventType) => {
        document.addEventListener(eventType, clipboardEventHandler)
    })

    return () => {
        CLIPBOARD_EVENTS.forEach((eventType) => {
            document.removeEventListener(eventType, clipboardEventHandler)
        })
    }
}
