# Manual de Replicación del Agente de Conversación - Reserbot

Este documento contiene toda la información técnica necesaria para que un agente de IA configure y despliegue un nuevo asistente conversacional para un negocio específico dentro de la plataforma Reserbot.

---

## 1. Arquitectura Técnica
- **Backend:** FastAPI (Python 3.11).
- **IA Engine:** LangChain (v0.3.x) con `AgentExecutor` y `tool_calling_agent`.
- **LLM:** OpenAI (GPT-4o-mini o superior) a través de OpenRouter.
- **Base de Datos Relacional:** MySQL (SQLAlchemy ORM) para gestión de negocios, clientes y memoria de chat.
- **Base de Datos de Vectores:** ChromaDB (v1.1.x) para búsqueda semántica del menú/conocimiento.

## 2. Variables de Entorno Requeridas (.env)
El agente debe asegurarse de que las siguientes variables estén configuradas:
```env
# Claves de IA
OPENROUTER_API_KEY="tu_clave_aquí"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
LLM_MODEL_NAME="openai/gpt-4o-mini"
LLM_TEMPERATURE=0

# Base de Datos
DB_USER="root"
DB_PASSWORD="tu_password"
DB_HOST="localhost"
DB_NAME="mvp_reserbot_db"

# Seguridad
SECRET_KEY="clave_secreta_jwt"
ALGORITHM="HS256"
```

## 3. Esquema de Datos Clave (Modelos Relacionales)
Para que el agente funcione, el negocio debe existir en la tabla [businesses](file:///c:/Proyects/mvp_reserbot/app/core/services.py#808-821).
- **Business:** Define el [id](file:///c:/Proyects/mvp_reserbot/app/core/services.py#119-124), [name](file:///c:/Proyects/mvp_reserbot/app/core/services.py#180-187), e `industry_type` (RESTAURANT o HEALTH).
- **OperatingHours:** Define la disponibilidad horaria semanal.
- **Resource:** Define las mesas o personal disponible (capacidad).
- **Service:** Define la duración de la reserva/cita.
- **ChatMessage:** Almacena la memoria para que el agente sea coherente.

## 4. Configuración de Conocimiento (Vectores)
El agente utiliza RAG (Retrieval-Augmented Generation) para responder sobre el menú.
1. **Archivo fuente:** PDF del menú en `static/menus/`.
2. **Procesamiento:** Usar el script `scripts/create_vectorstore.py`.
   - Comando: `python scripts/create_vectorstore.py --business-id <ID> --pdf-path <PATH_AL_PDF>`
3. **Almacenamiento:** Los vectores se guardan en el directorio `vector_db/`.

## 5. Lógica del Agente (Tools)
El agente debe tener acceso a las siguientes herramientas definidas en `app/core/agent.py`:
- `search_menu`: Búsqueda en ChromaDB.
- `check_availability`: Verificación de huecos libres en la DB relacional.
- `create_reservation`: Inserción de nuevas reservas en la DB.
- `get_operating_hours`: Consulta de horarios.
- `get_business_contact_info`: Datos de contacto básicos.

## 6. Prompts de Sistema (Personalidad)
El agente selecciona el prompt basado en la industria. Los templates están en `app/core/prompts.py`.
- **Restaurante:** Enfocado en mesas, comida y hospitalidad.
- **Salud:** Enfocado en citas médicas, DNI del paciente y empatía profesional.

## 7. Instrucciones para el Agente de Aplicación (Setup Step-by-Step)
Para crear un agente para un nuevo negocio:
1. **Paso 1:** Crear el registro del negocio en MySQL.
2. **Paso 2:** Configurar sus `operating_hours` y `resources` (mesas).
3. **Paso 3:** Subir el PDF del menú y ejecutar el script de vectorización (`create_vectorstore.py`).
4. **Paso 4:** Invocar al agente a través del endpoint `POST /api/v1/chat/` enviando la `X-API-Key` del negocio.

---

**Nota para la IA:** Este sistema es modular. Si necesitas añadir una nueva industria, simplemente crea un nuevo prompt en `app/core/prompts.py` y actualiza el Enum `IndustryTypeEnum` en `app/db/models.py`.
