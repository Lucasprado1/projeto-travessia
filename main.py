from openpyxl import Workbook, load_workbook


wb = load_workbook("sources/ModeloNEO-unicalinha.xlsx")
wb1 = load_workbook("sources/base_NEO_raposo1.xlsx")

aba_origem = wb1['Recebimentos']
aba_destino = wb['Recebimentos']

numero_de_linhas_recebimento = aba_origem.max_row
print(numero_de_linhas_recebimento)

aba_origem_recebiveis = wb1['Recebíveis']
aba_destino_recebiveis = wb['Recebíveis']

coluna_origem_inicio = 'S'
coluna_origem_fim = 'Y'
linha_origem = 2
linhas_destino = numero_de_linhas_recebimento - 1

# print(aba_destino_recebiveis["S2"].value)

for linha in range(linhas_destino):
    for coluna_origem, coluna_destino in zip(range(ord(coluna_origem_inicio), ord(coluna_origem_fim) + 1), range(ord(coluna_origem_inicio), ord(coluna_origem_fim) + 1)):
        célula_origem = aba_destino[f"{chr(coluna_origem)}{linha_origem}"]
        célula_destino = aba_destino[f"{chr(coluna_destino)}{linha_origem + linha}"]
        célula_destino.value = célula_origem.value
        print('origem',célula_origem.value)
        print('destino',célula_destino.value)

# wb.save("sources/ModeloNEOEdited.xlsx")


# ==================================

numero_de_linhas_recebiveis = aba_origem_recebiveis.max_row
print(numero_de_linhas_recebiveis)

intervalo_recebimento = f'A2:R{numero_de_linhas_recebimento}'
intervalo_recebiveis = f'A2:R{numero_de_linhas_recebiveis}'


células_origem = aba_origem[intervalo_recebimento]
células_destino = aba_destino[intervalo_recebimento]

for row_origem, row_destino in zip(células_origem, células_destino):
    for célula_origem, célula_destino in zip(row_origem, row_destino):
        célula_destino.value = célula_origem.value

aba_origem_recebiveis = aba_origem[intervalo_recebiveis]
aba_destino_recebiveis = aba_destino[intervalo_recebiveis]

for row_origem, row_destino in zip(aba_origem_recebiveis, aba_destino_recebiveis):
    for célula_origem, célula_destino in zip(row_origem, row_destino):
        célula_destino.value = célula_origem.value


wb.save("sources/ModeloNEOEdited.xlsx")


# ======================================================

# for row_number in range(2, 22):  # Linhas de 2 a 21
#     cell = aba_ativa_relatorio.cell(row=row_number, column=4)  # Coluna "K" (11ª coluna)
#     cell.value = 45184

# for row in aba_ativa_relatorio.iter_rows(min_row=2, max_row=21, min_col=11, max_col=17):
#     for cell in row:
#         i = i + 1
#         print(cell)
#         cell.value = 10

# for row in aba_ativa_relatorio.iter_rows(min_row=2, max_row=21, min_col=11, max_col=17):
#     for cell in row:
#         i = i + 1
#         print(cell)
#         cell.value = 10


# print("quantidade: ", i)
