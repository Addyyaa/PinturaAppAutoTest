import websocket
import json
from mitmproxy import http

# 创建 WebSocket 连接
ws = websocket.WebSocket()
ws.connect("ws://localhost:12345")  # WebSocket 服务器地址

data = {}


def request(flow: http.HTTPFlow) -> None:
    if "139.224.192.36" in flow.request.pretty_url or "austinelec" in flow.request.pretty_url:
        if "X-TOKEN" in flow.request.headers:
            data["X-TOKEN"] = flow.request.headers["X-TOKEN"]
            print(f"token:{data["X-TOKEN"]}")
        if "albumId" in flow.request.query:
            data["albumId"] = flow.request.query["albumId"]
            print(f"albumId:{data["albumId"]}")
        if "screenGroupId" in flow.request.query:
            data["screenGroupId"] = flow.request.query["screenGroupId"]
            print(f"screenGroupId:{data["screenGroupId"]}")
        if "screenId" in flow.request.query:
            data["screenId"] = flow.request.query["screenId"]
            print(f"screenId:{data["screenId"]}")

        ws.send(json.dumps(data))

def response(flow: http.HTTPFlow) -> None:
    if "/device/list" in flow.request.path:
        data["groupResponse"] = flow.response.json()["data"]["group"]
        print(f"group:{data}")
        ws.send(json.dumps(data))
