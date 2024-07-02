from pydantic import BaseModel, Field


class GetAnomaliesByDayModel(BaseModel):
    list_of_tables: list[str]
    period: int
    n_top: int = Field(default=3)
    n_days: int = Field(default=10)
    n_objects: int = Field(default=1000)
    n_of_clusters: int=Field(default=32)