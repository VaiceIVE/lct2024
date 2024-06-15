from pydantic import BaseModel


class GetAnomaliesByDayModel(BaseModel):
    list_of_tables: list[str]
    period: int