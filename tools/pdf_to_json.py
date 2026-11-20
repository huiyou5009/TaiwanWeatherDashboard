# import argparse
import calendar
import glob
import json
import os
import re
import sys
import pdfplumber

YEAR = 2026
INPUT_DIR = f"SUN/{YEAR}"
OUTPUT_PATH = f"SUN/suntime-{YEAR}.json"

SKIP_COUNT_CHECK = False

COUNTIES = [
  '基隆市', '臺北市', '新北市', '桃園市', '宜蘭縣',
  '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣',
  '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市',
  '高雄市', '屏東縣', '花蓮縣', '臺東縣', '澎湖縣',
  '金門縣', '連江縣'
]

def norm(c):
  return c.replace("台", "臺")

FIXES = []
SOFT = []

def fix_cells(ws, county, month, label):
  out = []
  for d, w in enumerate(ws, start=1):
    if re.fullmatch(r"\d{2}:\d{2}", w["text"]):
      out.append(w["text"])
    else:
      marker = f"TODO_FIX_{len(FIXES)+1}"
      FIXES.append(f"{county}:{month}月{d}日 {label}讀到「{w['text']}」，已填入{marker}")
      out.append(marker)
  return out

def print_fixes():
  if FIXES:
    print(f"\n 【需手動修正共{len(FIXES)}項】(到JSON搜尋TODO_FIX修改)")
    for f in FIXES:
      print(f"  - {f}")



def read_pdf(pdf_path, year):
  county = norm(os.path.splitext(os.path.basename(pdf_path))[0])
  problems = []
  date_dict = {}

  with pdfplumber.open(pdf_path) as pdf:
    if len(pdf.pages) !=2:
      problems.append(("檔案結構", f"頁數是{len(pdf.pages)}，應為2(上半年&下半年)"))

    for page_idx, page in enumerate(pdf.pages):

      head = "".join((page.extract_text() or "").splitlines()[:6])
      head = norm(re.sub(r"\s+", "", head))

      years = {int(y) for y in re.findall(r"西元(\d{4})年",head)}

      if not years:
        problems.append(("年份", "標題找不到年份，無法確認"))
      elif years != {year}:
        problems.append(("年份", f"標題年份是{sorted(years)}，不是{year}"))

      names = {c for c in map(norm, COUNTIES) if c in head}
      if not names:
        problems.append(("縣市名", "標題找不到縣市名，無法確認"))
      elif names != {county}:
        problems.append(("縣市名", f"檔名是{county}，但標題是{'、'.join(sorted(names))}"))

      words = page.extract_words()

      times = [w for w in page.extract_words() if re.fullmatch(r"\d{2}:\d{2}", w["text"])]
      if not times:
        problems.append(("天數", "有一頁讀不到任何時間資料"))
        continue

      times.sort(key=lambda w:(w["x0"] + w["x1"])/2)
      xs = [(w["x0"] + w["x1"]) / 2 for w in times]
      cuts = [0] + [k for k in range(1, len(xs)) if xs[k] - xs[k-1] > 10] + [len(xs)]
      cols = [times[cuts[k]:cuts[k+1]] for k in range(len(cuts)-1)]

      if len(cols) != 12:
        problems.append(("天數", f"有一頁偵測到{len(cols)}欄時間，應為12欄"))
        continue

      centers = [sum((w["x0"] + w["x1"]) / 2 for w in c) / len(c) for c in cols]
      top_min = min(w["top"] for w in times)
      bottom_max = max(w["bottom"] for w in times)
      for w in words:
        if re.fullmatch(r"\d{2}:\d{2}", w["text"]):
          continue
        if w["top"] < top_min - 2 or w["bottom"] > bottom_max + 2:
          continue
        wc = (w["x0"] + w["x1"]) / 2
        k = min(range(len(cols)), key=lambda j: abs((centers[j]) - wc))
        if abs(centers[k] - wc) <= 16:
          cols[k].append(w)


      start_month = 1 if page_idx == 0 else 7
      for i in range(6):
        month = start_month + i
        rises = fix_cells(sorted(cols[i * 2], key=lambda w:w["top"]), county, month, "日出")
        sets = fix_cells(sorted(cols[i * 2 + 1], key=lambda w:w["top"]), county, month, "日沒")      

        days_in_month = calendar.monthrange(year, month)[1]

        ok_rise = sum(1 for w in cols[i * 2] if re.fullmatch(r"\d{2}:\d{2}", w["text"]))
        ok_set = sum(1 for w in cols[i * 2 + 1] if re.fullmatch(r"\d{2}:\d{2}", w["text"]))

        if ok_rise != len(rises) or ok_set != len(sets):
          SOFT.append(f"{county}:{month}月: 日出{ok_rise}筆、日沒{ok_set}筆，應各為{days_in_month}筆")
        if len(rises) != days_in_month or len(sets) != days_in_month:
          problems.append(("天數", f"{month}月: 日出{len(rises)}筆、日沒{len(sets)}筆，應各為{days_in_month}筆"))

        for d in range(min(len(rises), len(sets), days_in_month)):
          date_dict[f"{year}-{month:02d}-{d + 1:02d}"] = {
            "Sunrise": rises[d],
            "Sunset": sets[d],
          }

  excepted = 366 if calendar.isleap(year) else 365
  if len(date_dict) != excepted:
    problems.append(("天數", f"全年共{len(date_dict)}筆，應為{excepted}筆"))
  problems = list(dict.fromkeys(problems))
  return county, date_dict, problems


def main():
  pdf_files = sorted(glob.glob(os.path.join(INPUT_DIR, "*.pdf")))
  if not pdf_files:
    sys.exit(f"找不到任何PDF: {INPUT_DIR}")

  errors = []


  if not SKIP_COUNT_CHECK:
    found = {norm(os.path.splitext(os.path.basename(f))[0]) for f in pdf_files}
    expected = {norm(c) for c in COUNTIES}
    if expected - found:
      errors.append(("檔案數量", f"缺少{len(expected - found)}個縣市: {'、'.join(sorted(expected-found))}"))
    if found - expected:
      errors.append(("檔案數量", f"多出清單以外的檔案: {'、'.join(sorted(found - expected))}"))


  all_data = {}
  for pdf_path in pdf_files:
    print(f"正在處理: {os.path.basename(pdf_path)}...")
    county, date_dict, problems = read_pdf(pdf_path, YEAR)
    all_data[county] = date_dict
    errors.extend((category, f"{county}:{msg}") for category, msg in problems)

  if errors:
    print("\n 檢查未通過，不會輸出JSON:")
    for category in dict.fromkeys(c for c, _ in errors):
      items = [m for c, m in errors if c == category]
      print(f"\n 【{category}共{len(items)}項】")
      for m in items:
        print(f"  - {m}")
    if SOFT:
      print(f"\n 【天數(資料格異常)共{len(SOFT)}項】(先解決其他問題；只剩這項時，會產生JSON並引導手動修正)")
      for m in SOFT:
        print(f"  - {m}")
    sys.exit(1)

  os.makedirs(os.path.dirname(OUTPUT_PATH) or ".", exist_ok=True)
  with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=4)
  print(f"\n 全部檢查通過，轉換完成! JSON已儲存至: {OUTPUT_PATH}")
  print_fixes()


if __name__ == "__main__":
  main()