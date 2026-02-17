import openpyxl

def list_sheets(filename):
    try:
        wb = openpyxl.load_workbook(filename, read_only=True)
        print(f"Sheets: {wb.sheetnames}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_sheets("data.xlsx")
