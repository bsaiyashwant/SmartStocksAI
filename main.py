from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from confluent_kafka import Consumer, KafkaException
import json
import asyncio
import logging
import os
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Stock Market Big Data API")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

KAFKA_BROKER = 'localhost:29092'
PROCESSED_TOPIC = 'processed_stock_data'

# Connection Manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info("New WebSocket connection established.")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info("WebSocket connection closed.")

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Failed to send to websocket: {e}")

manager = ConnectionManager()

def create_kafka_consumer():
    conf = {
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': 'fastapi-websocket-group',
        'auto.offset.reset': 'latest'
    }
    consumer = Consumer(conf)
    consumer.subscribe([PROCESSED_TOPIC])
    return consumer

async def consume_kafka_and_broadcast():
    consumer = create_kafka_consumer()
    logger.info("Started Kafka consumer for WebSockets.")
    
    try:
        while True:
            # We use a non-blocking poll with a timeout in an asyncio loop
            msg = consumer.poll(0.1)
            if msg is None:
                await asyncio.sleep(0.1)
                continue
            if msg.error():
                logger.error(f"Consumer error: {msg.error()}")
                continue
            
            # Message successfully received
            if msg.value():
                record_value = msg.value().decode('utf-8')
                logger.info(f"Received processed data from Kafka: {record_value}")
                
                # Broadcast to all connected WebSocket clients
                await manager.broadcast(record_value)
            
    except Exception as e:
        logger.error(f"Kafka consumer thread error: {e}")
    finally:
        consumer.close()

@app.on_event("startup")
async def startup_event():
    # Start the background task to consume Kafka messages
    asyncio.create_task(consume_kafka_and_broadcast())
    logger.info("FastAPI application started.")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We don't expect the client to send much, but we keep the connection alive
            data = await websocket.receive_text()
            logger.debug(f"Received from client: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- User Authentication ---
USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    name: str
    age: int
    phone: str
    email: str
    password: str

@app.post("/api/login")
def login(req: LoginRequest):
    # Admin hardcoded check
    if req.username == "bsaiyashwant" and req.password == "bsaiyashwant":
        return {"success": True, "token": "admin-token", "user": {"username": req.username, "role": "admin"}}
    
    users = load_users()
    if req.username in users and users[req.username]["password"] == req.password:
        # Don't send password back
        user_data = users[req.username].copy()
        user_data.pop("password", None)
        return {"success": True, "token": "user-token", "user": user_data}
    
    return {"success": False, "message": "Invalid username or password"}

@app.post("/api/register")
def register(req: RegisterRequest):
    if req.username == "bsaiyashwant":
        return {"success": False, "message": "Username reserved for Admin"}
        
    users = load_users()
    if req.username in users:
        return {"success": False, "message": "Username already exists"}
        
    users[req.username] = {
        "username": req.username,
        "name": req.name,
        "age": req.age,
        "phone": req.phone,
        "email": req.email,
        "password": req.password, # Plaintext for simplicity based on project scope
        "role": "user"
    }
    save_users(users)
    
    return {"success": True, "message": "Registration successful"}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Stock Market Big Data API"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}
