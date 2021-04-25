import { h, Fragment } from "harmaja"
import * as L from "lonna"

export function ZoomControls({ zoom }: { zoom: L.Atom<number> }) {
    return (
        <span className="zoom-controls">
            <span className="icon" title="Zoom in" onClick={() => zoom.modify((z) => z * 1.1)}>
                <svg viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22.5" r="22" fill="#566570" />
                    <ellipse cx="20.6665" cy="21.1667" rx="7.99999" ry="8" stroke="white" stroke-width="2" />
                    <path d="M30.6262 32.5405C31.0167 32.931 31.6499 32.931 32.0404 32.5405C32.4309 32.15 32.4309 31.5168 32.0404 31.1263L30.6262 32.5405ZM32.0404 31.1263L26.707 25.7929L25.2928 27.2071L30.6262 32.5405L32.0404 31.1263Z" fill="white" />
                    <path d="M23.7609 21.572V20.684H21.4449V18.368H20.5569V20.684H18.2409V21.572H20.5569V23.888H21.4449V21.572H23.7609Z" fill="white" />
                </svg>

            </span>
            <span className="icon" title="Zoom out" onClick={() => zoom.modify((z) => z / 1.1)}>
                <svg viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22.5" r="22" fill="#566570" />
                    <ellipse cx="20.6665" cy="21.1667" rx="7.99999" ry="8" stroke="#F2F2F2" stroke-width="2" />
                    <path d="M30.6262 32.5405C31.0167 32.931 31.6499 32.931 32.0404 32.5405C32.4309 32.15 32.4309 31.5168 32.0404 31.1263L30.6262 32.5405ZM32.0404 31.1263L26.707 25.7929L25.2928 27.2071L30.6262 32.5405L32.0404 31.1263Z" fill="#F2F2F2" />
                    <path d="M18.6539 21.944V20.924H23.3459V21.944H18.6539Z" fill="#F2F2F2" />
                </svg>
            </span>
        </span>
    )
}