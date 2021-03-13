import * as L from "lonna"
import { Board, Connection } from "../../../common/src/domain"
import { BoardCoordinateHelper } from "./board-coordinates"
import { Dispatch } from "../store/server-connection"
import * as uuid from "uuid"
import { Tool } from "./BoardView"
import { containedBy } from "./geometry"

export const DND_GHOST_HIDING_IMAGE = new Image()
// https://png-pixel.com/
DND_GHOST_HIDING_IMAGE.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

export function drawConnectionHandler(
    elem: HTMLElement,
    id: string,
    board: L.Property<Board>,
    coordinateHelper: BoardCoordinateHelper,
    tool: L.Atom<Tool>,
    dispatch: Dispatch,
) {
    let localConnection = L.atom<Connection | null>(null)

    localConnection.forEach((c) => {
        if (!c) {
            return
        }

        const existing = board.get().connections.find((co) => co.id === c.id)
        if (!existing) {
            dispatch({ action: "connection.add", boardId: board.get().id, connection: c })
        } else {
            dispatch({ action: "connection.modify", boardId: board.get().id, connection: c })
        }
    })

    function whileDragging(e: MouseEvent) {
        if (tool.get() !== "connect") return
        e.stopPropagation()
        const to = coordinateHelper.currentBoardCoordinates.get()
        localConnection.modify((c) => {
            if (c === null) {
                throw Error(`Invariant violation: trying to modify null connection`)
            }

            const items = board.get().items
            const target = items.find((i) => containedBy({ ...to, width: 0, height: 0 }, i))

            return {
                ...c,
                to: target ? target.id : to,
            }
        })
    }

    function newConnection(): Connection {
        return {
            id: uuid.v4(),
            from: id,
            controlPoints: [],
            to: coordinateHelper.currentBoardCoordinates.get(),
        }
    }

    elem.addEventListener("dragstart", (e) => {
        if (tool.get() !== "connect") return
        e.stopPropagation()
        e.dataTransfer?.setDragImage(DND_GHOST_HIDING_IMAGE, 0, 0)
        localConnection.set(newConnection())
    })

    elem.addEventListener("drag", whileDragging)

    elem.addEventListener("dragend", (e) => {
        if (tool.get() !== "connect") return
        e.stopPropagation()
        tool.set("select")
        localConnection.set(null)
    })
}

export function existingConnectionHandler(
    endNode: Element,
    connectionId: string,
    coordinateHelper: BoardCoordinateHelper,
    board: L.Property<Board>,
    dispatch: Dispatch,
) {
    endNode.addEventListener("drag", (e) => {
        e.stopPropagation()
        const connection = board.get().connections.find((c) => c.id === connectionId)!
        const items = board.get().items
        const coords = coordinateHelper.currentBoardCoordinates.get()

        const hitsItem = items.find((i) => containedBy({ ...coords, width: 0, height: 0 }, i))
        const to = hitsItem && hitsItem.id !== connection.from ? hitsItem.id : coords
        dispatch({ action: "connection.modify", boardId: board.get().id, connection: { ...connection, to } })
    })
}