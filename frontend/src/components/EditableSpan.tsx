import * as H from "harmaja"
import * as L from "lonna"
import { componentScope, h, HarmajaOutput } from "harmaja"
import { globalScope } from "lonna"

export type EditableSpanProps = {
    value: L.Atom<string>
    editingThis: L.Atom<boolean>
    showIcon?: boolean
    commit?: () => void
    cancel?: () => void
} & JSX.DetailedHTMLProps<JSX.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1
function clearSelection() {
    if (!isFirefox) {
        // Don't clear selection on Firefox, because for an unknown reason, the "selectAll" functionality below breaks after first clearSelection call.
        window.getSelection()?.removeAllRanges()
    }
}

export const EditableSpan = (props: EditableSpanProps) => {
    let { value, editingThis, commit, cancel, ...rest } = props
    const nameElement = L.atom<HTMLSpanElement | null>(null)
    const onClick = (e: JSX.MouseEvent) => {
        if (e.shiftKey) return
        editingThis.set(true)
        e.preventDefault()
        e.stopPropagation()
    }
    editingThis.pipe(L.changes).forEach((editing) => {
        if (editing) {
            setTimeout(() => {
                nameElement.get()!.focus()
                document.execCommand("selectAll", false)
            }, 1)
        } else {
            clearSelection()
        }
    })

    const endEditing = () => {
        editingThis.set(false)
    }
    const onKeyPress = (e: JSX.KeyboardEvent) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            commit && commit()
            editingThis.set(false)
        } else if (e.keyCode === 27) {
            // esc
            cancel && cancel()
            editingThis.set(false)
            nameElement.get()!.textContent = value.get()
        }
        e.stopPropagation() // To prevent propagating to higher handlers which, for instance prevent defaults for backspace
    }
    const onKey = (e: JSX.KeyboardEvent) => {
        e.stopPropagation() // To prevent propagating to higher handlers which, for instance prevent defaults for backspace
    }
    const onInput = (e: JSX.InputEvent<HTMLSpanElement>) => {
        value.set(e.currentTarget!.textContent || "")
    }

    const onPaste = (e: JSX.ClipboardEvent<HTMLSpanElement>) => {
        e.preventDefault()
        // Paste as plain text, remove formatting.
        var text = e.clipboardData.getData("text/plain")
        document.execCommand("insertHTML", false, text)
    }
    return (
        <span onClick={onClick} style={{ cursor: "pointer" }} {...rest}>
            {!!props.showIcon && <span className="icon edit" style={{ marginRight: "0.3em", fontSize: "0.8em" }} />}
            <span
                onBlur={endEditing}
                contentEditable={editingThis}
                style={L.view(value, (v) => (v ? {} : { display: "inline-block", minWidth: "1em", minHeight: "1em" }))}
                ref={nameElement.set}
                onKeyPress={onKeyPress}
                onKeyUp={onKeyPress}
                onKeyDown={onKey}
                onInput={onInput}
                onPaste={onPaste}
            >
                {props.value}
            </span>
        </span>
    )
}

export const If = ({
    condition,
    component,
}: {
    condition: L.Property<boolean>
    component: () => H.HarmajaOutput
}): HarmajaOutput => {
    return condition.pipe(L.map((c) => (c ? component() : [])))
}

export const IfElse = ({
    condition,
    ifTrue,
    ifFalse,
}: {
    condition: L.Property<boolean>
    ifTrue: () => H.HarmajaOutput
    ifFalse: () => H.HarmajaOutput
}) => {
    return condition.pipe(L.map((c) => (c ? ifTrue() : ifFalse())))
}
