# from typing import Any

# from database import Base
# from sqlalchemy import Column, ForeignKey, Integer, String
# from sqlalchemy.orm import relationship
# from sqlalchemy.orm.relationships import _RelationshipDeclared


# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#     email = Column(String)

#     # Relationship to the Project model
#     projects: _RelationshipDeclared[Any] = relationship(
#         argument="Project", backref="user"
#     )


# class Project(Base):
#     __tablename__ = "projects"

#     id = Column(Integer, primary_key=True)
#     name = Column(String)

#     # Foreign key referencing the user's id
#     user_id = Column(Integer, ForeignKey("users.id"))
#     user: _RelationshipDeclared[Any] = relationship("User")  # Backref to the User model


# # Base.metadata.create_all(engine)

from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)

    # Relationship to the Project model
    projects = relationship("Project", back_populates="user")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    # Foreign key referencing the user's id
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationship back to the User model
    user = relationship("User", back_populates="projects")
