"""
HireShield AI — Monorepo Root Entrypoint Bridge
Enables running `uvicorn src.main:app` directly from the workspace root (d:\\hireshield-ai-v2)
without needing to cd into apps/ai-service first.
"""

import sys
import os
import importlib.util

# Calculate absolute path to apps/ai-service/src
current_dir = os.path.dirname(os.path.abspath(__file__))
ai_service_src = os.path.abspath(os.path.join(current_dir, "..", "apps", "ai-service", "src"))
ai_service_root = os.path.abspath(os.path.join(current_dir, "..", "apps", "ai-service"))

# Insert paths to sys.path so schemas, scam_detector, and modules resolve cleanly
for path in [ai_service_src, ai_service_root]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Dynamically import apps/ai-service/src/main.py
main_file = os.path.join(ai_service_src, "main.py")
spec = importlib.util.spec_from_file_location("apps_ai_service_main", main_file)
if spec is None or spec.loader is None:
    raise ImportError(f"Cannot load module from {main_file}")

module = importlib.util.module_from_spec(spec)
sys.modules["apps_ai_service_main"] = module
spec.loader.exec_module(module)

# Expose FastAPI app instance for uvicorn
app = getattr(module, "app")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("src.main:app", host="127.0.0.1", port=port, reload=True)
