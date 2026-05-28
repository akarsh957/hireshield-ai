from fastapi import APIRouter, UploadFile, File, HTTPException
import io

router = APIRouter()

@router.post("/extract")
async def extract_text(image: UploadFile = File(...)):
    """Extract text from uploaded screenshot using OCR"""
    if image.content_type not in ["image/png", "image/jpeg", "image/webp", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only PNG, JPG, WEBP images supported")

    contents = await image.read()

    extracted = ""
    method = "none"

    # Try EasyOCR first
    try:
        import easyocr
        import numpy as np
        from PIL import Image as PILImage

        img = PILImage.open(io.BytesIO(contents)).convert("RGB")
        reader = easyocr.Reader(["en"], gpu=False, verbose=False)
        results = reader.readtext(np.array(img))
        extracted = " ".join([r[1] for r in results if r[2] > 0.4])
        method = "easyocr"
    except Exception:
        pass

    # Fallback to pytesseract
    if not extracted:
        try:
            import pytesseract
            from PIL import Image as PILImage
            img = PILImage.open(io.BytesIO(contents))
            extracted = pytesseract.image_to_string(img)
            method = "tesseract"
        except Exception:
            extracted = "[OCR unavailable — install easyocr or pytesseract]"
            method = "none"

    return {
        "extracted_text": extracted.strip(),
        "word_count": len(extracted.split()),
        "ocr_method": method
    }
