import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Draw = () => {
	const navigate = useNavigate()

	useEffect(() => {
		const roomId = Math.random().toString(36).substring(2, 15)
		navigate(`/draw/${roomId}`) // Redirect to /draw/:roomId
	}, [])

	return (
		<div className="text-center p-10">
			<p>Creating room... Redirecting.</p>
		</div>
	)
}

export default Draw
