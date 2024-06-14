FROM python:3.10.14-bookworm 
COPY ./src /app
COPY pyproject.toml poetry.lock ./
WORKDIR /app
RUN python3 -m pip install pipx
RUN python3 -m pip install python-dotenv
ENV PATH="${PATH}:/root/.local/bin"
RUN pipx ensurepath 
RUN pipx install poetry
RUN poetry env use 3.10
RUN poetry update
RUN poetry install --no-dev
