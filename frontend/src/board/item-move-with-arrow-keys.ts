import { componentScope } from "harmaja"
import * as L from "lonna"
import { Board, BOARD_ITEM_BORDER_MARGIN, Item } from "../../../common/src/domain"
import { BoardFocus } from "./board-focus"
import { Dispatch } from "../store/board-store"
import { findSelectedItems } from "./item-cut-copy-paste"

function updatePosition(board: Board, item: Item, dx: number, dy: number): Item {
    const margin = BOARD_ITEM_BORDER_MARGIN
    return {
        ...item,
        x: Math.min(Math.max(item.x + dx, margin), board.width - item.width - margin),
        y: Math.min(Math.max(item.y + dy, margin), board.height - item.height - margin),
    }
}

function moveItem(board: Board, item: Item, key: string, shiftKey: boolean, altKey: boolean): Item {
    const stepSize = shiftKey ? 10 : altKey ? 0.1 : 1
    switch (key) {
        case "ArrowLeft":
            return updatePosition(board, item, -stepSize, 0)
        case "ArrowRight":
            return updatePosition(board, item, stepSize, 0)
        case "ArrowUp":
            return updatePosition(board, item, 0, -stepSize)
        case "ArrowDown":
            return updatePosition(board, item, 0, stepSize)
    }
    return item
}

export function itemMoveWithArrowKeysHandler(board: L.Property<Board>, dispatch: Dispatch, focus: L.Atom<BoardFocus>) {
    ;["keydown", "keyup", "keypress"].forEach((eventName) => {
        // Prevent default for all arrow key events
        L.fromEvent<JSX.KeyboardEvent>(document, eventName)
            .pipe(L.applyScope(componentScope()))
            .forEach((e) => {
                if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                    if (eventName === "keydown") {
                        const currentBoard = board.get()
                        const itemsAndConnections = findSelectedItems(focus.get(), currentBoard)
                        if (itemsAndConnections.items.length > 0 || itemsAndConnections.connections.length > 0) {
                            e.preventDefault()
                            const movedItems = itemsAndConnections.items.map((item) =>
                                moveItem(currentBoard, item, e.key, e.shiftKey, e.altKey),
                            )
                            dispatch({ action: "item.move", boardId: currentBoard.id, items: movedItems })
                        }
                    }
                }
            })
    })
}
