import uvicorn
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get(path="/")
async def get_projects_all():
    return {
        "data": [
            {"name": "Project 1", "creator": "winter"},
            {"name": "Project 2", "creator": "winter"},
        ]
    }


if __name__ == "__main__":
    uvicorn.run(app=app)
