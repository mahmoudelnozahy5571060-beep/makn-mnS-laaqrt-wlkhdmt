import fitz
from pathlib import Path

source = Path("attached_assets/وثيقة_متطلبات_مشروع_منصة_العقارات_والخدمات_المتكاملة_1789049137109.pdf")
output = Path(".agents/outputs/requirements_pages")
output.mkdir(parents=True, exist_ok=True)

doc = fitz.open(source)
print(f"pages={doc.page_count}")
for index, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(1.25, 1.25), alpha=False)
    path = output / f"page-{index + 1:02d}.png"
    pix.save(path)
print(f"rendered={len(list(output.glob('*.png')))}")