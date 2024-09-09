import uvicorn
from fastapi import FastAPI

app = FastAPI()


@app.route(path="/")
def home():
    """
    Home route
    """
    return {"Project": "Something"}


if __name__ == "__main__":
    uvicorn.run(app=app)
