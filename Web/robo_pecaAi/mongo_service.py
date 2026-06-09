from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(
    os.getenv("MONGO_URI")
)

db = client[
    os.getenv("MONGO_DATABASE")
]

collection = db[
    os.getenv("MONGO_COLLECTION")
]


def salvar_pecas(lista_pecas):

    if not lista_pecas:
        return

    resultado = collection.insert_many(
        lista_pecas
    )

    print(
        f"Salvas {len(resultado.inserted_ids)} peças"
    )