from pydantic import BaseModel, Field


class GetAnomaliesByDayModel(BaseModel):
    list_of_tables: list[str]
    period: int
    n_top: int = Field(default=3)