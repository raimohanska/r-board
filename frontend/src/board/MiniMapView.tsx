import { h, ListView } from "harmaja"
import * as L from "lonna"
import _ from "lodash"
import { Board, Item } from "../../../common/src/domain"
import { Rect } from "./geometry"

export const MiniMapView = ({ viewRect, board }: { viewRect: L.Property<Rect>; board: L.Property<Board> }) => {
    const minimapDimensions = L.view(board, (rect) => {
        const minimapWidthEm = 15
        return { width: minimapWidthEm, height: (minimapWidthEm / rect.width) * rect.height }
    })
    const minimapAspectRatio = L.view(minimapDimensions, board, (mm, b) => mm.width / b.width)
    const minimapStyle = L.view(minimapDimensions, (d) => ({ width: d.width + "em", height: d.height + "em" }))
    const viewAreaStyle = L.view(viewRect, minimapDimensions, board, (vr, mm, b) => {
        return {
            width: (vr.width * mm.width) / b.width + "em",
            height: (vr.height * mm.height) / b.height + "em",
            left: Math.max(0, (vr.x * mm.width) / b.width) + "em",
            top: Math.max(0, (vr.y * mm.height) / b.height) + "em",
        }
    })
    return (
        <div className="minimap" style={minimapStyle}>
            <div className="content">
                <ListView
                    observable={L.view(L.view(board, "items"), Object.values)}
                    renderObservable={renderItem}
                    getKey={(i) => i.id}
                />
                <div className="viewarea" style={viewAreaStyle} />
            </div>
        </div>
    )

    function renderItem(id: string, item: L.Property<Item>) {
        const style = L.view(item, minimapAspectRatio, (item, ratio) => ({
            left: item.x * ratio + "em",
            top: item.y * ratio + "em",
            width: item.width * ratio + "em",
            height: item.height * ratio + "em",
        }))
        const type = item.get().type
        return <span className={"item " + type} style={style} />
    }
}
