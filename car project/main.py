from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel, Field
import json
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID, uuid4
from datetime import datetime, date

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("storage.json", "r") as file:
    car_data = json.load(file)

    class Car(BaseModel):
        name: str
        start: date
        end: date

    @app.post("/add_car")
    def add_car(car: Car):
        with open("storage.json", "r") as file:
            car_data = json.load(file)
            new_car = {
                "id": str(uuid4()),
                "name": car.name,
                "start": str(car.start),
                "end": str(car.end),
            }
            car_data.append(new_car)

        with open("storage.json", "w") as file:
            json.dump(car_data, file, indent=2)

        return new_car


    @app.get("/get_cars")
    def get_cars():
        with open("storage.json", "r") as file:
            car_data = json.load(file)
            return car_data


@app.delete("/delete_car/{car_name}")
def delete_car(car_name: str):
    with open("storage.json", "r") as file:
        car_data = json.load(file)

        car_to_delete = next((car for car in car_data if car["name"] == car_name), None)

        if car_to_delete:
            car_data.remove(car_to_delete)
            with open("storage.json", "w") as file:
                json.dump(car_data, file, indent=2)
            return {"message": f"Car {car_name} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"Car {car_name} not found")