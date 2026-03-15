let ws: WebSocket | null = null

export function connectWS(){

ws = new WebSocket("ws://localhost:8080/ws")

ws.onopen = ()=>{

console.log("WebSocket connected")

}

ws.onmessage = (msg)=>{

const data = JSON.parse(msg.data)

console.log("设备数据",data)

}

}

export function sendMessage(data:any){

if(ws){

ws.send(JSON.stringify(data))

}

}