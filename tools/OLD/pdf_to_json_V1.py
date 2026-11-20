# import glob
# import json
# import os
# import pdfplumber

# all_data_list = []
# pdf_files = glob.glob("SUN/2026/*.pdf")

# for pdf_path in pdf_files:
#   filename = os.path.basename(pdf_path)
#   county_name = os.path.splitext(filename)[0]
#   print(f"正在處理：{county_name}...")

#   with pdfplumber.open(pdf_path) as pdf:
#     for page_idx, page in enumerate(pdf.pages):
#       table = page.extract_table()
#       if not table:
#         continue

#       start_month = 1 if page_idx == 0 else 7

#       for i in range(6):
#         month = start_month + i
#         sunrise_col = 1 + (i * 2)
#         sunset_col = 2 + (i * 2)

#         sunrise_lines = []
#         sunset_lines = []

#         for row in table[3:]:
#           if sunrise_col < len(row) and row[sunrise_col]:
#             lines = row[sunrise_col].split("\n")
#             sunrise_lines.extend([l.strip() for l in lines if l.strip()])

#           if sunset_col < len(row) and row[sunset_col]:
#             lines = row[sunset_col].split("\n")
#             sunset_lines.extend([l.strip() for l in lines if l.strip()])

#         for day_idx in range(len(sunrise_lines)):
#           day = day_idx + 1
#           sunrise = sunrise_lines[day_idx]
#           sunset = sunset_lines[day_idx] if day_idx < len(sunset_lines) else ""

#           if sunrise:
#             year = 2026
#             date_str = f"{year}-{month:02d}-{day:02d}"

#             item = {
#                 "CountyName": county_name,
#                 "Date": date_str,
#                 "Sunrise": sunrise,
#                 "Sunset": sunset,
#             }
#             all_data_list.append(item)

# output_json_path = "sunrise_sunset_2026.json"
# with open(output_json_path, "w", encoding="utf-8") as f:
#   json.dump(all_data_list, f, ensure_ascii=False, indent=4)

# print(f"轉換完成！JSON 已儲存至：{output_json_path}")



import glob
import json
import os
import pdfplumber

all_regions_data = {}
pdf_files = glob.glob("SUN/2026/*.pdf")

for pdf_path in pdf_files:
  filename = os.path.basename(pdf_path)
  county_name = os.path.splitext(filename)[0]
  print(f"正在處理：{county_name}...")

  date_dict = {}

  with pdfplumber.open(pdf_path) as pdf:
    for page_idx, page in enumerate(pdf.pages):
      table = page.extract_table()
      if not table:
        continue

      start_month = 1 if page_idx == 0 else 7

      for i in range(6):
        month = start_month + i
        sunrise_col = 1 + (i * 2)
        sunset_col = 2 + (i * 2)

        sunrise_lines = []
        sunset_lines = []

        for row in table[3:]:
          if sunrise_col < len(row) and row[sunrise_col]:
            lines = row[sunrise_col].split("\n")
            sunrise_lines.extend([l.strip() for l in lines if l.strip()])

          if sunset_col < len(row) and row[sunset_col]:
            lines = row[sunset_col].split("\n")
            sunset_lines.extend([l.strip() for l in lines if l.strip()])

        for day_idx in range(len(sunrise_lines)):
          day = day_idx + 1
          sunrise = sunrise_lines[day_idx]
          sunset = sunset_lines[day_idx] if day_idx < len(sunset_lines) else ""

          if sunrise:
            year = 2026
            date_str = f"{year}-{month:02d}-{day:02d}"

            date_dict[date_str] = {"Sunrise": sunrise, "Sunset": sunset}

  all_regions_data[county_name] = date_dict


output_json_path = "suntime-20269.json"
with open(output_json_path, "w", encoding="utf-8") as f:
  json.dump(all_regions_data, f, ensure_ascii=False, indent=4)

print(f"轉換完成！JSON 已儲存至：{output_json_path}")