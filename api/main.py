from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item (BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    
@app.post("/items/{item_id}")
async def create_item(item_id: int, item: Item):
    return {"item_id": item_id, **item.model_dump()}