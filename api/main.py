from email import message

import uvicorn
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get(path="/project/all")
async def get_all_projects():
    return {
        "data": [
            {"name": "Project 1", "creator": "winter"},
            {"name": "Project 2", "creator": "winter"},
        ]
    }


#
@app.put(path="/project/update/")
async def update_projects():
    return {
        "data": [
            {"name": "Project 1", "creator": "winter"},
            {"name": "Project 2", "creator": "winter"},
        ]
    }


# de
@app.delete("/project/delete/")
async def project_delete():
    return {message: "Project delete"}


# add
@app.delete("/project/add/")
async def project_add():
    return {message: "Project delete"}


if __name__ == "__main__":
    uvicorn.run(app=app)
