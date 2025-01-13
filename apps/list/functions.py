import xlsxwriter

# ! Make sure to download them from the browser to the user device


def write_excel(data,filename):
    print("Writing Excel")
    workbook  = xlsxwriter.Workbook(filename)
    worksheet = workbook.add_worksheet()

    worksheet.write(0, 0, 'Hello Excel')

    workbook.close()
    print("Excel written")

def write_pdf(data,filename):
    print("Writing PDF")
    print("PDF written")

def write_csv(data,filename):
    print("Writing CSV")
    print("CSV written")

def write_txt(data,filename):
    print("Writing TXT")
    print("TXT written")

def write_json(data,filename):
    print("Writing JSON")
    print("JSON written")

def write_xml(data,filename):
    print("Writing XML")
    print("XML written")

