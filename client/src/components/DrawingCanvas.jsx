import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import io from "socket.io-client"
import { v4 as uuidv4 } from "uuid"
import { drawOnCanvas } from "../utils/drawingUtils"
import { BASE_URL } from "../utils/constants"

const DrawingCanvas = () => {
	const { roomId } = useParams()
	const canvasRef = useRef(null)
	const contextRef = useRef(null)
	const socketRef = useRef(null)
	const [isDrawing, setIsDrawing] = useState(false)
	const [color, setColor] = useState("#ff4d4d")
	const [brushSize, setBrushSize] = useState(5)
	const [tool, setTool] = useState("freeDrawing")
	const [shareLink, setShareLink] = useState("")
	const [userId] = useState(uuidv4())

	useEffect(() => {
		const canvas = canvasRef.current
		const width = window.innerWidth - 100
		const height = 600

		canvas.width = width * 2
		canvas.height = height * 2
		canvas.style.width = `${width}px`
		canvas.style.height = `${height}px`

		const context = canvas.getContext("2d")
		context.scale(2, 2)
		context.lineCap = "round"
		contextRef.current = context

		const socket = io(BASE_URL)
		socketRef.current = socket
		socket.emit("joinRoom", { roomId, userId })

		socket.on("initialData", (data) => {
			context.clearRect(0, 0, canvas.width, canvas.height)
			data.forEach((d) => drawOnCanvas(d, context))
		})

		socket.on("draw", (data) => drawOnCanvas(data, context))
		socket.on("clearCanvas", () =>
			context.clearRect(0, 0, canvas.width, canvas.height)
		)
		socket.on("toolChange", ({ tool, value }) => {
			if (tool === "color") setColor(value)
			else if (tool === "brushSize") setBrushSize(value)
			else setTool(value)
		})

		return () => socket.disconnect()
	}, [roomId, userId])

	const startDrawing = ({ nativeEvent }) => {
		const { offsetX, offsetY } = nativeEvent
		contextRef.current.currentPosition = { x0: offsetX, y0: offsetY }
		setIsDrawing(true)
	}

	const finishDrawing = ({ nativeEvent }) => {
		if (!contextRef.current.currentPosition) return
		const { x0, y0 } = contextRef.current.currentPosition
		const { offsetX, offsetY } = nativeEvent

		if (tool !== "freeDrawing") {
			const data = {
				x0,
				y0,
				x1: offsetX,
				y1: offsetY,
				color,
				size: brushSize,
				tool,
			}
			drawOnCanvas(data, contextRef.current)
			socketRef.current.emit("draw", { roomId, userId, ...data })
		}
		setIsDrawing(false)
		contextRef.current.currentPosition = null
	}

	const draw = ({ nativeEvent }) => {
		if (!isDrawing || tool !== "freeDrawing") return
		const { offsetX, offsetY } = nativeEvent
		const { x0, y0 } = contextRef.current.currentPosition

		const data = {
			x0,
			y0,
			x1: offsetX,
			y1: offsetY,
			color,
			size: brushSize,
			tool,
		}
		drawOnCanvas(data, contextRef.current)
		socketRef.current.emit("draw", { roomId, userId, ...data })

		contextRef.current.currentPosition = { x0: offsetX, y0: offsetY }
	}

	const clearCanvas = () => {
		contextRef.current.clearRect(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		)
		socketRef.current.emit("clearCanvas", roomId)
	}

	const handleToolChange = (newTool) => {
		setTool(newTool)
		socketRef.current.emit("toolChange", {
			roomId,
			tool: "tool",
			value: newTool,
		})
	}

	const generateShareLink = () => {
		const link = `${window.location.origin}/draw/${roomId}`
		setShareLink(link)
	}

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(shareLink)
			.then(() => alert("Link copied!"))
	}

	useEffect(() => generateShareLink(), [roomId])

	return (
		<div className="flex flex-col items-center bg-black p-4">
			<canvas
				className="border-4 border-red-300 bg-white rounded-lg shadow-md"
				onMouseDown={startDrawing}
				onMouseUp={finishDrawing}
				onMouseMove={draw}
				onMouseLeave={finishDrawing}
				ref={canvasRef}
			/>

			<div className="mt-4 flex flex-wrap justify-center gap-2">
				<button
					onClick={() => handleToolChange("freeDrawing")}
					className={`p-2 rounded bg-red-300 hover:bg-red-400 text-black ${
						tool === "freeDrawing" && "ring-2 ring-red-500"
					}`}
				>
					Pen
				</button>
				<button
					onClick={() => handleToolChange("rectangle")}
					className={`p-2 rounded bg-red-300 hover:bg-red-400 text-black ${
						tool === "rectangle" && "ring-2 ring-red-500"
					}`}
				>
					Rectangle
				</button>
				<button
					onClick={() => handleToolChange("circle")}
					className={`p-2 rounded bg-red-300 hover:bg-red-400 text-black ${
						tool === "circle" && "ring-2 ring-red-500"
					}`}
				>
					Circle
				</button>
				<button
					onClick={() => handleToolChange("triangle")}
					className={`p-2 rounded bg-red-300 hover:bg-red-400 text-black ${
						tool === "triangle" && "ring-2 ring-red-500"
					}`}
				>
					Triangle
				</button>
				<button
					onClick={() => handleToolChange("database")}
					className={`p-2 rounded bg-red-300 hover:bg-red-400 text-black ${
						tool === "database" && "ring-2 ring-red-500"
					}`}
				>
					Diamond
				</button>
			</div>

			<div className="mt-3 flex gap-2">
				<input
					type="color"
					value={color}
					onChange={(e) => {
						setColor(e.target.value)
						socketRef.current.emit("toolChange", {
							roomId,
							tool: "color",
							value: e.target.value,
						})
					}}
					className="w-10 h-10 border-none rounded"
				/>
				<input
					type="range"
					min="1"
					max="50"
					value={brushSize}
					onChange={(e) => {
						setBrushSize(e.target.value)
						socketRef.current.emit("toolChange", {
							roomId,
							tool: "brushSize",
							value: e.target.value,
						})
					}}
					className="w-40"
				/>
				<button
					onClick={clearCanvas}
					className="p-2 rounded bg-red-300 hover:bg-red-400 text-black"
				>
					Clear
				</button>
			</div>

			<div className="mt-4 text-center">
				<button
					onClick={copyToClipboard}
					className="p-2 rounded bg-red-300 hover:bg-red-400 text-black"
				>
					Share Drawing
				</button>
				<p className="text-white mt-2">Share this link:</p>
				<a
					href={shareLink}
					target="_blank"
					rel="noopener noreferrer"
					className="text-red-300 hover:underline"
				>
					{shareLink}
				</a>
			</div>
		</div>
	)
}

export default DrawingCanvas
