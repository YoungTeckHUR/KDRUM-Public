const path = require('node:path');
const fs = require('node:fs');
const {spawnSync} = require('node:child_process');

// Keep the PDF renderer out of the public website runtime. CI pins these two
// libraries and independently renders physical PDF pages 4..21, rather than
// trusting a filename or a newly approved JPEG checksum as proof of its content.
const root = path.resolve(process.env.P18_SOURCE_AUDIT_ROOT || path.join(__dirname, '../..'));
const output = path.resolve(process.env.AUDIT_DIR || '.github/artifacts/p18-source');
fs.mkdirSync(output, {recursive: true});
const script = String.raw`
from pathlib import Path
from io import BytesIO
import hashlib
import json
import re
import sys
import textwrap
import fitz
import PIL
from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageStat

root, output = map(Path, sys.argv[1:3])
assert fitz.VersionBind == '1.26.7', 'Use PyMuPDF==1.26.7'
assert PIL.__version__ == '11.3.0', 'Use Pillow==11.3.0'
media = root / 'docs/media/2026-09-12-p18'
images = root / 'docs/assets/presentation/2026-09-12-p18'
manifest = json.loads((media / 'manifest.json').read_text(encoding='utf-8'))
source_hashes = {
    'K-DRUM_v3.x_p18.pdf': '28fb9f4ca0c9a2b96330422dce575a7d8663964f6800b1ce899a1dbef5f8de75',
    'KDRUM_Nature_to_Digital_22s_web.mp4': '14b8173bdd1126049ad624ce4c335de72590f691dc46aab170d22bffe68dd54f',
    '07_Digital_Reference.png': 'e8d8ad3e5539706e9d7b51af915f2ae73e9e8f52822d896f5585fbea982579af',
}
for name, expected in source_hashes.items():
    assert hashlib.sha256((media / name).read_bytes()).hexdigest() == expected, name + ': original source changed'

pdf_name = 'K-DRUM_v3.x_p18.pdf'
assert manifest['presentation_pdf'] == pdf_name
assert manifest['source_pdf'] == {'file': pdf_name, 'sha256': source_hashes[pdf_name], 'page_count': 22}
render = manifest['feature_render']
assert render['width'] == 1600 and render['height'] == 900
assert render['quality'] == 90 and render['subsampling'] == 0
assert render['optimize'] is False and render['progressive'] is False
assert render['engine'] == 'PyMuPDF' and render['engine_version'] == fitz.VersionBind
assert render['format'] == 'JPEG'
assert render['image_library'] == 'Pillow' and render['image_library_version'] == PIL.__version__
assert render['colorspace'] == 'RGB' and render['alpha'] is False
assert len(manifest['feature_images']) == len(manifest['feature_source_pages']) == 18
assert len(set(manifest['feature_images'])) == 18
assert sorted(p.name for p in images.glob('*.jpg')) == sorted(manifest['feature_images'])

def normalized(text):
    return ' '.join(text.split()).upper()

def pixel_errors(actual, expected):
    difference = ImageStat.Stat(ImageChops.difference(actual, expected))
    return sum(difference.mean) / 3, sum(difference.rms) / 3

def same_slide(mean, rms):
    return mean <= 0.5 and rms <= 2.0

pdf = fitz.open(media / pdf_name)
assert len(pdf) == 22, 'The unmodified source PDF must contain 22 physical pages'
rows, failures, previews, negative_controls = [], [], [], []
previous_expected = None
for index, entry in enumerate(manifest['feature_source_pages']):
    number, physical_page = index + 1, index + 4
    name = manifest['feature_images'][index]
    # The independent sequence is essential: an off-by-one manifest cannot
    # make a correspondingly wrong image pass this content comparison.
    assert entry['file'] == name and Path(name).name == name
    assert name.startswith(f'{number:02d}_')
    assert entry['feature_number'] == number and entry['pdf_page'] == physical_page
    page = pdf[physical_page - 1]
    header = page.get_text().splitlines()[0].strip()
    title = re.sub(r'^\d{2}\s*\u00b7\s*', '', header)
    assert header.startswith(f'{number:02d} \u00b7 '), f'{name}: source feature number mismatch: {header}'
    assert normalized(title) == normalized(entry['title_en']), f'{name}: source feature title mismatch: {header}'
    assert hashlib.sha256((images / name).read_bytes()).hexdigest() == entry['sha256'], name + ': manifest checksum mismatch'

    pixmap = page.get_pixmap(matrix=fitz.Matrix(1600 / page.rect.width, 900 / page.rect.height), colorspace=fitz.csRGB, alpha=False)
    rendered = Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples)
    assert rendered.size == (1600, 900)
    encoded = BytesIO()
    rendered.save(encoded, format='JPEG', quality=90, subsampling=0, optimize=False, progressive=False)
    encoded.seek(0)
    expected = Image.open(encoded).convert('RGB')
    with Image.open(images / name) as supplied:
        assert supplied.format == 'JPEG' and supplied.size == (1600, 900), name + ': invalid image format or dimensions'
        actual = supplied.convert('RGB')
    mean, rms = pixel_errors(actual, expected)
    # Permit tiny cross-platform codec differences, but reject shifted slides,
    # changed wording, added padding, or a different crop of the source page.
    passed = same_slide(mean, rms)
    row = {'file': name, 'feature_number': number, 'pdf_page': physical_page,
           'source_header': header, 'title_en': entry['title_en'], 'sha256': entry['sha256'],
           'size': list(actual.size), 'pixel_mean_absolute_error': mean,
           'pixel_root_mean_square_error': rms, 'result': 'PASS' if passed else 'FAIL'}
    rows.append(row)
    previews.append((actual, row))
    if not passed:
        failures.append(f'{name}: does not match physical PDF page {physical_page} (MAE={mean:.4f}, RMS={rms:.4f})')
    # In-memory negative controls prove the tolerance rejects a one-slide
    # offset. No repository image or source file is changed for this check.
    if previous_expected is not None:
        wrong_mean, wrong_rms = pixel_errors(actual, previous_expected)
        rejected = not same_slide(wrong_mean, wrong_rms)
        negative_controls.append({'file': name, 'wrong_pdf_page': physical_page - 1,
                                  'pixel_mean_absolute_error': wrong_mean,
                                  'pixel_root_mean_square_error': wrong_rms, 'rejected': rejected})
        if not rejected:
            failures.append(f'{name}: negative control unexpectedly accepts preceding PDF page')
    if index == 1:
        wrong_mean, wrong_rms = pixel_errors(previews[0][0], expected)
        rejected = not same_slide(wrong_mean, wrong_rms)
        negative_controls.append({'file': manifest['feature_images'][0], 'wrong_pdf_page': physical_page,
                                  'pixel_mean_absolute_error': wrong_mean,
                                  'pixel_root_mean_square_error': wrong_rms, 'rejected': rejected})
        if not rejected:
            failures.append('First feature negative control unexpectedly accepts following PDF page')
    previous_expected = expected

font = ImageFont.load_default(size=14)
montage = Image.new('RGB', (3 * 532, 6 * 350), '#e7edf2')
draw = ImageDraw.Draw(montage)
for index, (slide, row) in enumerate(previews):
    x, y = (index % 3) * 532, (index // 3) * 350
    slide.thumbnail((512, 288), Image.Resampling.LANCZOS)
    montage.paste(slide, (x + 10, y + 8))
    label = f"{row['feature_number']:02d} | PDF page {row['pdf_page']:02d} | {row['file']}"
    draw.text((x + 10, y + 299), label, fill='#122638', font=font)
    draw.text((x + 10, y + 318), '\n'.join(textwrap.wrap(row['title_en'], width=63)), fill='#122638', font=font)
montage.save(output / 'feature-source-montage.png')
report = {'result': 'FAIL' if failures else 'PASS', 'source_pdf': manifest['source_pdf'],
          'unchanged_source_hashes': source_hashes, 'renderer': render,
          'expected_physical_pages': list(range(4, 22)), 'features': rows,
          'negative_controls': negative_controls, 'failures': failures}
(output / 'results.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
for row in rows:
    print(f"{row['result']} {row['file']} -> PDF page {row['pdf_page']}: {row['source_header']} (MAE={row['pixel_mean_absolute_error']:.4f})")
if failures:
    raise AssertionError('\n'.join(failures))
assert len(negative_controls) == 18
print('PASS 18 feature JPEGs match physical PDF pages 4..21; all titles/numbers and three original source hashes verified; 18 adjacent-page negative controls rejected')
`;
const result = spawnSync(process.env.PYTHON || 'python', ['-c', script, root, output], {
  encoding: 'utf8',
  env: {...process.env, PYTHONIOENCODING: 'utf-8'},
  maxBuffer: 4 * 1024 * 1024,
});
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
process.exitCode = result.status === 0 ? 0 : 1;
