import { h } from "harmaja"
import { Color } from "../../../common/src/domain"
import * as L from "lonna"
import { black, disabledColor } from "../components/UIColors"

export const ZoomInIcon = () => (
    <svg viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22.5" r="22" fill="#566570" />
        <ellipse cx="20.6665" cy="21.1667" rx="7.99999" ry="8" stroke="white" stroke-width="2" />
        <path
            d="M30.6262 32.5405C31.0167 32.931 31.6499 32.931 32.0404 32.5405C32.4309 32.15 32.4309 31.5168 32.0404 31.1263L30.6262 32.5405ZM32.0404 31.1263L26.707 25.7929L25.2928 27.2071L30.6262 32.5405L32.0404 31.1263Z"
            fill="white"
        />
        <path
            d="M23.7609 21.572V20.684H21.4449V18.368H20.5569V20.684H18.2409V21.572H20.5569V23.888H21.4449V21.572H23.7609Z"
            fill="white"
        />
    </svg>
)

export const ZoomOutIcon = () => (
    <svg viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22.5" r="22" fill="#566570" />
        <ellipse cx="20.6665" cy="21.1667" rx="7.99999" ry="8" stroke="#F2F2F2" stroke-width="2" />
        <path
            d="M30.6262 32.5405C31.0167 32.931 31.6499 32.931 32.0404 32.5405C32.4309 32.15 32.4309 31.5168 32.0404 31.1263L30.6262 32.5405ZM32.0404 31.1263L26.707 25.7929L25.2928 27.2071L30.6262 32.5405L32.0404 31.1263Z"
            fill="#F2F2F2"
        />
        <path d="M18.6539 21.944V20.924H23.3459V21.944H18.6539Z" fill="#F2F2F2" />
    </svg>
)

export const ShapeSquareIcon = (color: Color) => (
    <svg viewBox="-2 -2 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="31" height="31" rx="1.5" stroke={color} stroke-width="3" stroke-linecap="round" />
    </svg>
)

export const ShapeRoundIcon = (color: Color) => (
    <svg viewBox="-2 -2 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke={color} stroke-width="3" stroke-linecap="round" />
    </svg>
)

export const ShapeRectIcon = (color: Color) => (
    <svg viewBox="-2 -2 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="6.5" width="31" height="20" rx="1.5" stroke={color} stroke-width="3" stroke-linecap="round" />
    </svg>
)

export const ShapeDiamondIcon = (color: Color) => (
    <svg viewBox="-2 -2 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
            x="4"
            y="4"
            width="23"
            height="23"
            rx="1.5"
            stroke={color}
            stroke-width="3"
            stroke-linecap="round"
            transform="rotate(45 15.5 15.5)"
        />
    </svg>
)

export const IncreaseFontSizeIcon = () => (
    <svg viewBox="0 -3 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.11072 0.959999H8.93472L15.8947 18H13.5907L11.5747 13.008H4.42272L2.43072 18H0.126719L7.11072 0.959999ZM11.0947 11.328L8.02272 3.456L4.85472 11.328H11.0947ZM24.9129 8.616V10.344H22.0809V13.416H20.1609V10.344H17.3289V8.616H20.1609V5.544H22.0809V8.616H24.9129Z"
            fill="black"
        />
    </svg>
)

export const DecreaseFontSizeIcon = () => (
    <svg viewBox="0 -4 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.01913 0.639999H6.23513L10.8751 12H9.33913L7.99513 8.672H3.22713L1.89913 12H0.363125L5.01913 0.639999ZM7.67513 7.552L5.62713 2.304L3.51513 7.552H7.67513ZM12.0553 8.272V6.992H16.7753V8.272H12.0553Z"
            fill="black"
        />
    </svg>
)

export const UndoIcon = ({ enabled }: { enabled: L.Property<boolean> }) => {
    const undoColor = L.view(enabled, (c) => (c ? black : disabledColor))
    return (
        <svg width="100%" viewBox="0 0 36 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.57075 16.0193C8.69107 8.20216 18.4669 5.25727 26.4057 9.44172C29.6423 11.1477 32.0739 13.7753 33.5397 16.8193"
                stroke={undoColor}
                stroke-width="2"
                stroke-linecap="round"
            />
            <path
                d="M2.43115 11.5003L4.54688 17.1371L10.3929 15.6968"
                stroke={undoColor}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )
}

export const RedoIcon = ({ enabled }: { enabled: L.Property<boolean> }) => {
    const redoColor = L.view(enabled, (c) => (c ? black : disabledColor))
    return (
        <svg width="100%" viewBox="0 0 35 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M30.3954 16.1554C26.5718 8.18892 16.9135 4.87867 8.82307 8.76176C5.52461 10.3449 2.99598 12.8793 1.41683 15.8659"
                stroke={redoColor}
                stroke-width="2"
                stroke-linecap="round"
            />
            <path
                d="M32.7031 11.72L30.377 17.2733L24.5893 15.6143"
                stroke={redoColor}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )
}

export const AlignHorizontalLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M4 22H2V2h2v20zM22 7H6v3h16V7zm-6 7H6v3h10v-3z" />
    </svg>
)

export const AlignVerticalTopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M22 2v2H2V2h20zM7 22h3V6H7v16zm7-6h3V6h-3v10z" />
    </svg>
)

export const HorizontalDistributeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M4 22H2V2h2v20zM22 2h-2v20h2V2zm-8.5 5h-3v10h3V7z" />
    </svg>
)

export const VerticalDistributeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M22 2v2H2V2h20zM7 10.5v3h10v-3H7zM2 20v2h20v-2H2z" />
    </svg>
)

export const TileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
            d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"
            fill-rule="evenodd"
        />
    </svg>
)

export const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z" />
    </svg>
)

export const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89l.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54l.72-1.21l-3.5-2.08V8H12z" />
    </svg>
)

export const UserIcon = () => (
    <svg viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse
            cx="9.00008"
            cy="5.44441"
            rx="4.44441"
            ry="4.44441"
            stroke="#566570"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M17 18C17 13.5817 13.4183 10 9 10C4.58172 10 1 13.5817 1 18"
            stroke="#566570"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
)
