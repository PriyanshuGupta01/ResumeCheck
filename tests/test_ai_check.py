import urllib.request
import json

boundary = '----WebKitFormBoundaryTest'
with open('tests/samples/sample_resume.pdf', 'rb') as f:
    pdf_bytes = f.read()
with open('tests/samples/jd_datascience.txt', 'r', encoding='utf-8') as f:
    jd_text = f.read()

parts = []
parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="resume"; filename="sample.pdf"\r\nContent-Type: application/pdf\r\n\r\n'.encode('utf-8'))
parts.append(pdf_bytes)
parts.append(f'\r\n--{boundary}\r\nContent-Disposition: form-data; name="job_description"\r\n\r\n{jd_text}\r\n--{boundary}--\r\n'.encode('utf-8'))
body = b''.join(parts)

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/analyze',
    data=body,
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
)

with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode('utf-8'))
    print('Status:', res.get('status'))
    print('AI Enabled:', res.get('is_ai_enabled'))
    has_feedback = res.get('ai_feedback') is not None
    print('Has AI Feedback:', has_feedback)
    if has_feedback:
        fb = res['ai_feedback']
        print('Summary:', fb.get('summary'))
        print('Strengths count:', len(fb.get('strengths', [])))
        print('Improved bullets count:', len(fb.get('improved_bullets', [])))
