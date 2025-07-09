// /utils/drawingUtils.js

export const drawOnCanvas = ({ x0, y0, x1, y1, color, size, tool }, ctx) => {
	ctx.beginPath()
	ctx.strokeStyle = color
	ctx.lineWidth = size

	if (tool === "rectangle") {
		ctx.rect(x0, y0, x1 - x0, y1 - y0)
	} else if (tool === "circle") {
		const radius = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
		ctx.arc(x0, y0, radius, 0, 2 * Math.PI)
	} else if (tool === "triangle") {
		ctx.moveTo(x0, y0)
		ctx.lineTo(x1, y1)
		ctx.lineTo(x0 * 2 - x1, y1) // simple symmetric triangle
		ctx.closePath()
	} else if (tool === "database") {
		ctx.ellipse(
			x0,
			y0,
			Math.abs(x1 - x0),
			Math.abs(y1 - y0) / 2,
			0,
			0,
			2 * Math.PI
		)
	} else {
		ctx.moveTo(x0, y0)
		ctx.lineTo(x1, y1)
	}

	ctx.stroke()
	ctx.closePath()
}
