import os

from groq import Groq

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def ask_llm(context: str, question: str):

    prompt = f"""
Kamu adalah AI Assistant untuk aplikasi Task Management.

Jawablah HANYA berdasarkan data task berikut.

Jika pertanyaan di luar task management,
jawab:

"Maaf, saya hanya dapat menjawab pertanyaan mengenai data task."

====================
DATA TASK

{context}

====================

PERTANYAAN

{question}

"""

    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0
    )

    return response.choices[0].message.content