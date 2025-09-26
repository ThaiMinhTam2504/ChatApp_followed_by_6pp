import { useEffect, useState } from "react";


const Test = () => {

    const [count, setCount] = useState(0)
    useEffect(() => {
        const id = setInterval(() => {
            setCount((prevCount) => prevCount + 1)
        }, 1000)
        return () => clearInterval(id)
    }, [])
    return <div style={{ backgroundColor: 'lightblue', height: '100vh' }}>
        No Cleanup count: {count}
    </div>
}
export default Test