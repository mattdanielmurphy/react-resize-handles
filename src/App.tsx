import { MouseEvent, useEffect, useState } from 'react'

import { GlobalStyle } from './styles/GlobalStyle'
import styled from 'styled-components'

const PseudoWindow = styled.div`
	position: absolute;
	top: 40px;
	bottom: 40px;
	width: 100%;
	background-color: rgba(255, 255, 255, 0.1);
	border-top: 1px solid white;
	border-bottom: 1px solid white;
	-webkit-app-region: drag;
	cursor: move;
`

const MiddleLine = styled.div`
	position: absolute;
	top: 50%;
	width: 100%;
	border-top: 1px solid white;
`

const BottomResize = styled.div`
	background-color: rgba(255, 255, 255, 0.5);
	position: absolute;
	bottom: 0;
	height: 10px;
	width: 100%;
	color: black;
	-webkit-app-region: no-drag;
	&:hover {
		cursor: ns-resize;
	}
`

const Container = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
	border: 1px solid white;
`

export function App() {
	const [mouseDown, setMouseDown] = useState(false)
	const [prevY, setPrevY] = useState<number | undefined>()
	const [cursorPresent, setCursorPresent] = useState<boolean | undefined>()
	const [cursorDraggedOffWindow, setCursorDraggedOffWindow] = useState(false)
	const [moveInterval, setMoveInterval] = useState<undefined | number>()

	useEffect(() => {
		// keep moving window down until cursor is back
		if (cursorDraggedOffWindow) {
			if (cursorPresent !== undefined) {
				console.log('cursor dragged off', cursorPresent)
				const interval = window.setInterval(() => {
					window.resizeBy(0, 5)
				}, 0)
				setMoveInterval(interval)
			}
		}
	}, [cursorDraggedOffWindow])

	useEffect(() => {
		if (cursorPresent) setCursorDraggedOffWindow(false)
	}, [cursorPresent])

	function handleMouseMove(e: MouseEvent) {
		// const offset = window.innerHeight - e.pageY

		// if (!mouseDown) {
		// 	setPrevY(undefined)
		// }
		if (mouseDown && prevY) {
			// const differenceY = e.screenY - prevY
			window.resizeTo(400, e.pageY + 50)
			setPrevY(e.screenY)
		}
	}
	function handleMouseDown(e: MouseEvent) {
		if (e.button === 2) {
			// left click
			resizeTo(400, 400)
		}
		setMouseDown(true)
		setPrevY(e.screenY)
		// setInitialY(e.screenY)
	}
	function handleMouseUp(e: MouseEvent) {
		setMouseDown(false)
	}
	function handleMouseEnter(e: MouseEvent) {
		console.log('mouse enter')
		setCursorPresent(true)
		clearInterval(moveInterval)
		if (mouseDown) {
			// cursor was dragged off-screen
			console.log('mousedown re-enter')
			window.resizeTo(400, e.pageY + 50)
		}
	}
	function handleMouseLeave(e: MouseEvent) {
		setCursorPresent(false)
		if (mouseDown) {
			setCursorDraggedOffWindow(true)
			// setMouseDown(false)
		}
	}
	return (
		<Container
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
			onMouseEnter={handleMouseEnter}
		>
			<GlobalStyle />
			<PseudoWindow>
				<MiddleLine />
				<BottomResize onMouseDown={handleMouseDown} />
			</PseudoWindow>
		</Container>
	)
}
